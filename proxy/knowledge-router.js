/**
 * Knowledge Router
 *
 * Searches the feline-research-os knowledge base using grep.
 * Runs on the proxy server side (not browser).
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Knowledge base path - configurable via env
const KB_PATH = process.env.FELINE_KB_PATH || '/Users/jiawei/Desktop/insclaude/feline-research-os';

// Weight configuration for knowledge sources
const SOURCE_WEIGHTS = {
  'feline-research-os': 0.7,
  'default': 0.5
};

/**
 * Search knowledge base for relevant content
 * @param {string} query - Search query (keywords)
 * @param {object} options - Search options
 * @returns {Array} Array of matched content with metadata
 */
function searchKnowledge(query, options = {}) {
  const {
    topics = ['obesity', 'diabetes'],
    maxResults = 10,
    includeEntities = true
  } = options;

  const results = [];

  // Check if KB exists
  if (!fs.existsSync(KB_PATH)) {
    console.warn(`Knowledge base not found at: ${KB_PATH}`);
    return results;
  }

  // Build search paths
  const searchPaths = [];
  for (const topic of topics) {
    const topicPath = path.join(KB_PATH, 'topics', topic);
    if (fs.existsSync(topicPath)) {
      searchPaths.push(topicPath);
    }
  }

  if (includeEntities) {
    const entitiesPath = path.join(KB_PATH, 'entities');
    if (fs.existsSync(entitiesPath)) {
      searchPaths.push(entitiesPath);
    }
  }

  if (searchPaths.length === 0) {
    return results;
  }

  // Extract keywords from query
  const keywords = extractKeywords(query);

  // Run grep for each keyword
  for (const keyword of keywords) {
    for (const searchPath of searchPaths) {
      try {
        // Use grep -r -l to find files containing the keyword
        const grepCmd = `grep -r -l -i "${escapeShell(keyword)}" "${searchPath}" 2>/dev/null | head -${maxResults}`;
        const output = execSync(grepCmd, { encoding: 'utf8', timeout: 5000 });

        const files = output.trim().split('\n').filter(f => f);

        for (const filePath of files) {
          // Skip if already in results
          if (results.find(r => r.filePath === filePath)) continue;

          const content = readFileContent(filePath);
          if (content) {
            results.push({
              filePath,
              fileName: path.basename(filePath),
              topic: extractTopic(filePath),
              content: content.content,
              metadata: content.metadata,
              weight: SOURCE_WEIGHTS['feline-research-os'],
              matchedKeyword: keyword
            });
          }
        }
      } catch (e) {
        // grep returns error if no matches, which is fine
        continue;
      }
    }
  }

  // Sort by weight and limit results
  return results
    .sort((a, b) => b.weight - a.weight)
    .slice(0, maxResults);
}

/**
 * Extract keywords from query
 */
function extractKeywords(query) {
  // Split by common delimiters and filter
  const words = query
    .replace(/[，。、；：""''（）【】]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2);

  // Add domain-specific keywords
  const domainKeywords = [];

  // GLP-1 related
  if (query.includes('GLP-1') || query.includes('肥胖') || query.includes('减重')) {
    domainKeywords.push('GLP-1', 'obesity', 'weight', 'semaglutide');
  }

  // Diabetes related
  if (query.includes('糖尿病') || query.includes('血糖') || query.includes('胰岛素')) {
    domainKeywords.push('diabetes', 'insulin', 'glucose');
  }

  return [...new Set([...words, ...domainKeywords])];
}

/**
 * Read file content with YAML frontmatter parsing
 */
function readFileContent(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');

    // Parse YAML frontmatter if present
    const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (frontmatterMatch) {
      const metadata = parseSimpleYaml(frontmatterMatch[1]);
      const content = frontmatterMatch[2];
      return { metadata, content };
    }

    return { metadata: {}, content: raw };
  } catch (e) {
    return null;
  }
}

/**
 * Simple YAML parser for frontmatter
 */
function parseSimpleYaml(yaml) {
  const result = {};
  const lines = yaml.split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      let value = match[2].trim();
      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim());
      }
      result[match[1]] = value;
    }
  }

  return result;
}

/**
 * Extract topic from file path
 */
function extractTopic(filePath) {
  const match = filePath.match(/topics\/(\w+)\//);
  return match ? match[1] : 'general';
}

/**
 * Escape shell special characters
 */
function escapeShell(str) {
  return str.replace(/['"\\$`]/g, '\\$&');
}

/**
 * Build knowledge context for LLM prompt
 * @param {string} query - User's rough requirement
 * @returns {string} Formatted knowledge context
 */
function buildKnowledgeContext(query) {
  const results = searchKnowledge(query, {
    topics: ['obesity', 'diabetes'],
    maxResults: 5,
    includeEntities: true
  });

  if (results.length === 0) {
    return '（未找到相关知识库内容）';
  }

  let context = '## 相关知识库内容\n\n';

  for (const result of results) {
    context += `### ${result.fileName} (${result.topic})\n`;
    if (result.metadata.confidence) {
      context += `置信度: ${result.metadata.confidence}\n`;
    }
    // Truncate content to avoid token overflow
    const truncated = result.content.slice(0, 2000);
    context += `${truncated}\n\n`;
  }

  return context;
}

module.exports = {
  searchKnowledge,
  buildKnowledgeContext,
  KB_PATH
};
