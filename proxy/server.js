/**
 * Expert-Driven Protocol Generator - Local Proxy Server
 *
 * Handles:
 * 1. Pending queue with web UI confirmation
 * 2. OpenRouter API calls for multi-model LLM access
 * 3. Knowledge base search integration
 *
 * Architecture: Frontend (browser) → Local Proxy (this) → OpenRouter API
 */

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { buildKnowledgeContext, KB_PATH } = require('./knowledge-router');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3456;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ============================================================================
// Pending Request Queue
// ============================================================================

const pendingRequests = new Map();

/**
 * Create a new pending request
 * POST /api/generate/request
 * Body: { model, prompt, step, expertId }
 */
app.post('/api/generate/request', (req, res) => {
  const { model, prompt, step, expertId, metadata } = req.body;

  if (!model || !prompt || !step) {
    return res.status(400).json({ error: 'Missing required fields: model, prompt, step' });
  }

  const requestId = uuidv4();
  const timestamp = new Date().toISOString();

  pendingRequests.set(requestId, {
    requestId,
    model,
    prompt,
    step,
    expertId: expertId || null,
    metadata: metadata || {},
    status: 'pending',
    createdAt: timestamp,
    result: null,
    error: null
  });

  console.log(`[${timestamp}] New request queued: ${requestId} (step: ${step}, model: ${model})`);

  res.json({
    requestId,
    status: 'pending',
    message: `Request queued. Visit /confirm.html?id=${requestId} to approve and execute.`
  });
});

/**
 * Get status of a pending request
 * GET /api/generate/status/:requestId
 */
app.get('/api/generate/status/:requestId', (req, res) => {
  const { requestId } = req.params;
  const request = pendingRequests.get(requestId);

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.json({
    requestId: request.requestId,
    status: request.status,
    step: request.step,
    model: request.model,
    createdAt: request.createdAt,
    result: request.status === 'completed' ? request.result : null,
    error: request.error
  });
});

/**
 * Confirm and execute a pending request
 * POST /api/generate/confirm/:requestId
 * Body: { apiKey } - OpenRouter API key
 */
app.post('/api/generate/confirm/:requestId', async (req, res) => {
  const { requestId } = req.params;
  const { apiKey } = req.body;

  const request = pendingRequests.get(requestId);

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({
      error: `Request already ${request.status}`,
      result: request.result
    });
  }

  if (!apiKey) {
    return res.status(400).json({ error: 'API key required' });
  }

  // Update status
  request.status = 'executing';
  console.log(`[${new Date().toISOString()}] Executing request: ${requestId}`);

  try {
    const result = await callOpenRouter(apiKey, request.model, request.prompt);
    request.status = 'completed';
    request.result = result;

    console.log(`[${new Date().toISOString()}] Request completed: ${requestId} (${result.length} chars)`);

    res.json({
      requestId,
      status: 'completed',
      result
    });
  } catch (error) {
    request.status = 'failed';
    request.error = error.message;

    console.error(`[${new Date().toISOString()}] Request failed: ${requestId}`, error.message);

    res.status(500).json({
      requestId,
      status: 'failed',
      error: error.message
    });
  }
});

/**
 * List all pending requests
 * GET /api/generate/pending
 */
app.get('/api/generate/pending', (req, res) => {
  const pending = [];
  for (const [id, request] of pendingRequests) {
    if (request.status === 'pending') {
      pending.push({
        requestId: request.requestId,
        step: request.step,
        model: request.model,
        createdAt: request.createdAt,
        promptPreview: request.prompt.slice(0, 200) + '...'
      });
    }
  }
  res.json(pending);
});

/**
 * Clear completed/failed requests older than 1 hour
 * POST /api/generate/cleanup
 */
app.post('/api/generate/cleanup', (req, res) => {
  const oneHourAgo = Date.now() - 3600000;
  let cleaned = 0;

  for (const [id, request] of pendingRequests) {
    if (request.status !== 'pending' && new Date(request.createdAt).getTime() < oneHourAgo) {
      pendingRequests.delete(id);
      cleaned++;
    }
  }

  res.json({ cleaned });
});

// ============================================================================
// OpenRouter API Integration
// ============================================================================

/**
 * Call OpenRouter API
 */
async function callOpenRouter(apiKey, model, prompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://feline-metabolic-public-test.local',
      'X-Title': 'Feline Protocol Generator'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 8192
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ============================================================================
// Knowledge Base Integration
// ============================================================================

/**
 * Search knowledge base
 * POST /api/knowledge/search
 * Body: { query, topics, maxResults }
 */
app.post('/api/knowledge/search', (req, res) => {
  const { query, topics, maxResults } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    const context = buildKnowledgeContext(query);
    res.json({ context, kbPath: KB_PATH });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// Expert Pool
// ============================================================================

// Load expert config
let EXPERT_POOL = {};
const expertConfigPath = path.join(__dirname, '..', 'expert-config-extended.js');

function loadExpertPool() {
  try {
    // Clear cache and reload
    delete require.cache[require.resolve(expertConfigPath)];
    const config = require(expertConfigPath);
    EXPERT_POOL = config.EXPERT_POOL || {};
    console.log(`Loaded expert pool: ${Object.keys(EXPERT_POOL).length} domains`);
  } catch (e) {
    console.warn('Could not load expert-config-extended.js, using empty pool');
    EXPERT_POOL = {};
  }
}

loadExpertPool();

/**
 * Get available experts
 * GET /api/experts
 */
app.get('/api/experts', (req, res) => {
  res.json(EXPERT_POOL);
});

/**
 * Get expert by ID
 * GET /api/experts/:id
 */
app.get('/api/experts/:id', (req, res) => {
  const { id } = req.params;

  for (const domain of Object.values(EXPERT_POOL)) {
    const expert = domain.experts?.find(e => e.id === id);
    if (expert) {
      return res.json(expert);
    }
  }

  res.status(404).json({ error: 'Expert not found' });
});

// ============================================================================
// Static Files & Confirmation UI
// ============================================================================

// Serve confirmation UI
app.get('/confirm.html', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>确认 LLM 请求</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    .card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { font-size: 24px; margin-bottom: 20px; }
    h2 { font-size: 18px; margin-bottom: 10px; color: #333; }
    .info { margin-bottom: 15px; }
    .label { font-weight: 600; color: #666; }
    .value { color: #333; }
    .prompt { background: #f8f8f8; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 13px; white-space: pre-wrap; max-height: 400px; overflow-y: auto; }
    input[type="password"] { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; margin-bottom: 15px; }
    button { padding: 12px 24px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
    .btn-confirm { background: #4CAF50; color: white; }
    .btn-confirm:hover { background: #45a049; }
    .btn-reject { background: #f44336; color: white; margin-left: 10px; }
    .status { padding: 10px; border-radius: 4px; margin-top: 15px; }
    .status.success { background: #e8f5e9; color: #2e7d32; }
    .status.error { background: #ffebee; color: #c62828; }
    .status.pending { background: #fff3e0; color: #e65100; }
    .result { margin-top: 20px; }
    .result pre { background: #f8f8f8; padding: 15px; border-radius: 4px; white-space: pre-wrap; max-height: 600px; overflow-y: auto; }
  </style>
</head>
<body>
  <div class="container">
    <h1>确认 LLM 请求</h1>
    <div id="content">加载中...</div>
  </div>

  <script>
    const params = new URLSearchParams(window.location.search);
    const requestId = params.get('id');

    async function loadRequest() {
      if (!requestId) {
        document.getElementById('content').innerHTML = '<div class="card"><p>错误：缺少请求 ID</p></div>';
        return;
      }

      try {
        const res = await fetch('/api/generate/status/' + requestId);
        const data = await res.json();

        if (!res.ok) {
          document.getElementById('content').innerHTML = '<div class="card"><p>错误：' + data.error + '</p></div>';
          return;
        }

        renderRequest(data);
      } catch (e) {
        document.getElementById('content').innerHTML = '<div class="card"><p>加载失败：' + e.message + '</p></div>';
      }
    }

    function renderRequest(data) {
      let html = '<div class="card">';
      html += '<div class="info"><span class="label">请求 ID：</span><span class="value">' + data.requestId + '</span></div>';
      html += '<div class="info"><span class="label">步骤：</span><span class="value">' + data.step + '</span></div>';
      html += '<div class="info"><span class="label">模型：</span><span class="value">' + data.model + '</span></div>';
      html += '<div class="info"><span class="label">创建时间：</span><span class="value">' + data.createdAt + '</span></div>';
      html += '<div class="info"><span class="label">状态：</span><span class="value status ' + data.status + '">' + data.status + '</span></div>';
      html += '</div>';

      if (data.status === 'pending') {
        html += '<div class="card">';
        html += '<h2>确认执行</h2>';
        html += '<p style="margin-bottom: 15px; color: #666;">请输入您的 OpenRouter API Key 以确认执行此请求：</p>';
        html += '<input type="password" id="apiKey" placeholder="sk-or-..." />';
        html += '<button class="btn-confirm" onclick="confirmRequest()">确认执行</button>';
        html += '<button class="btn-reject" onclick="rejectRequest()">取消</button>';
        html += '<div id="result"></div>';
        html += '</div>';
      } else if (data.status === 'completed' && data.result) {
        html += '<div class="card result">';
        html += '<h2>生成结果</h2>';
        html += '<pre>' + escapeHtml(data.result) + '</pre>';
        html += '</div>';
      } else if (data.status === 'failed' && data.error) {
        html += '<div class="card">';
        html += '<div class="status error">错误：' + escapeHtml(data.error) + '</div>';
        html += '</div>';
      }

      document.getElementById('content').innerHTML = html;
    }

    async function confirmRequest() {
      const apiKey = document.getElementById('apiKey').value.trim();
      if (!apiKey) {
        document.getElementById('result').innerHTML = '<div class="status error">请输入 API Key</div>';
        return;
      }

      document.getElementById('result').innerHTML = '<div class="status pending">正在执行...</div>';

      try {
        const res = await fetch('/api/generate/confirm/' + requestId, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey })
        });
        const data = await res.json();

        if (data.status === 'completed') {
          document.getElementById('result').innerHTML = '<div class="status success">执行完成！</div><div class="result"><h2>生成结果</h2><pre>' + escapeHtml(data.result) + '</pre></div>';
        } else {
          document.getElementById('result').innerHTML = '<div class="status error">执行失败：' + (data.error || '未知错误') + '</div>';
        }
      } catch (e) {
        document.getElementById('result').innerHTML = '<div class="status error">请求失败：' + e.message + '</div>';
      }
    }

    function rejectRequest() {
      window.close();
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    loadRequest();
  </script>
</body>
</html>
  `);
});

// Serve pending requests dashboard
app.get('/dashboard.html', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>请求队列</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1000px; margin: 0 auto; }
    h1 { font-size: 24px; margin-bottom: 20px; }
    .card { background: white; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .step { font-weight: 600; color: #1976d2; }
    .model { color: #666; font-size: 14px; }
    .time { color: #999; font-size: 12px; }
    .preview { color: #333; font-size: 13px; background: #f8f8f8; padding: 10px; border-radius: 4px; }
    a { color: #1976d2; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .empty { text-align: center; color: #999; padding: 40px; }
    .refresh { margin-bottom: 20px; padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: white; }
    .refresh:hover { background: #f0f0f0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>待确认请求队列</h1>
    <button class="refresh" onclick="loadPending()">刷新</button>
    <div id="list">加载中...</div>
  </div>

  <script>
    async function loadPending() {
      try {
        const res = await fetch('/api/generate/pending');
        const data = await res.json();

        if (data.length === 0) {
          document.getElementById('list').innerHTML = '<div class="empty">暂无待确认请求</div>';
          return;
        }

        let html = '';
        for (const req of data) {
          html += '<div class="card">';
          html += '<div class="card-header">';
          html += '<span class="step">' + req.step + '</span>';
          html += '<span class="model">' + req.model + '</span>';
          html += '</div>';
          html += '<div class="time">创建于：' + req.createdAt + '</div>';
          html += '<div class="preview">' + req.promptPreview + '</div>';
          html += '<div style="margin-top: 10px;"><a href="/confirm.html?id=' + req.requestId + '">查看并确认 →</a></div>';
          html += '</div>';
        }

        document.getElementById('list').innerHTML = html;
      } catch (e) {
        document.getElementById('list').innerHTML = '<div class="empty">加载失败：' + e.message + '</div>';
      }
    }

    loadPending();
    setInterval(loadPending, 5000);
  </script>
</body>
</html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    kbPath: KB_PATH,
    kbExists: fs.existsSync(KB_PATH),
    pendingRequests: pendingRequests.size,
    expertDomains: Object.keys(EXPERT_POOL)
  });
});

// ============================================================================
// Start Server
// ============================================================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  Expert-Driven Protocol Generator - Local Proxy Server    ║
╠═══════════════════════════════════════════════════════════╣
║  Port:        http://localhost:${PORT}                       ║
║  Dashboard:   http://localhost:${PORT}/dashboard.html        ║
║  Health:      http://localhost:${PORT}/health                ║
║  KB Path:     ${KB_PATH.slice(0, 45)}...  ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
