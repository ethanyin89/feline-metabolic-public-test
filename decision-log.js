/**
 * Decision Log System
 * Records inference-level decision chains for audit purposes
 *
 * Schema version: 1.0
 * Generated: 2026-05-29
 */

// Generate UUID for session tracking
function generateSessionId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Global decision log object
window.decisionLog = null;

/**
 * Initialize a new decision log session
 * Called at the start of parseRequest()
 */
function initDecisionLog(rawInput) {
    window.decisionLog = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        sessionId: generateSessionId(),
        input: {
            rawText: rawInput,
            parsedElements: null  // Will be filled after parsing
        },
        inferences: [],
        finalDecision: null,
        expertPerspectives: null
    };
    return window.decisionLog.sessionId;
}

/**
 * Log an inference step
 * @param {number} step - Step number (1-4)
 * @param {string} name - Step name (关键词提取, 业务分流, 风险标记, 专家视角选择)
 * @param {*} input - Input to this step
 * @param {string[]} rules - Rule IDs triggered
 * @param {string[]} evidence - Evidence/reasoning for the decision
 * @param {*} output - Output of this step
 * @param {string[]} matchedPatterns - (Optional) Regex patterns that matched
 */
function logInference(step, name, input, rules, evidence, output, matchedPatterns = []) {
    if (!window.decisionLog) {
        console.warn('Decision log not initialized');
        return;
    }

    window.decisionLog.inferences.push({
        step,
        name,
        timestamp: new Date().toISOString(),
        input: typeof input === 'object' ? JSON.parse(JSON.stringify(input)) : input,
        rules,
        evidence,
        output: typeof output === 'object' ? JSON.parse(JSON.stringify(output)) : output,
        matchedPatterns
    });
}

/**
 * Log the final decision
 */
function logFinalDecision(workflow, risks, gaps) {
    if (!window.decisionLog) return;

    window.decisionLog.finalDecision = {
        workflow,
        risks: risks || [],
        gaps: gaps || []
    };
}

/**
 * Log expert perspectives
 */
function logExpertPerspectives(international, domestic) {
    if (!window.decisionLog) return;

    window.decisionLog.expertPerspectives = {
        international: international || [],
        domestic: domestic || []
    };
}

/**
 * Set parsed elements after extraction
 */
function logParsedElements(elements) {
    if (!window.decisionLog) return;
    window.decisionLog.input.parsedElements = elements;
}

/**
 * Save decision log to localStorage
 * Called after parsing is complete
 */
function saveDecisionLog() {
    if (!window.decisionLog) return null;

    const key = `audit_${window.decisionLog.sessionId}`;
    try {
        localStorage.setItem(key, JSON.stringify(window.decisionLog));

        // Also maintain an index of all sessions
        let index = JSON.parse(localStorage.getItem('audit_index') || '[]');
        index.push({
            sessionId: window.decisionLog.sessionId,
            timestamp: window.decisionLog.timestamp,
            preview: window.decisionLog.input.rawText.substring(0, 100) + '...'
        });
        // Keep only last 50 sessions
        if (index.length > 50) {
            const removed = index.shift();
            localStorage.removeItem(`audit_${removed.sessionId}`);
        }
        localStorage.setItem('audit_index', JSON.stringify(index));

        return key;
    } catch (e) {
        console.error('Failed to save decision log:', e);
        return null;
    }
}

/**
 * Export decision log as JSON file
 */
function exportDecisionLog() {
    if (!window.decisionLog) {
        alert('没有可导出的决策日志');
        return;
    }

    const blob = new Blob([JSON.stringify(window.decisionLog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decision-log-${window.decisionLog.sessionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Load decision log by session ID
 */
function loadDecisionLog(sessionId) {
    const key = `audit_${sessionId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

/**
 * Get all session summaries from index
 */
function getDecisionLogIndex() {
    return JSON.parse(localStorage.getItem('audit_index') || '[]');
}

/**
 * Get the current session's audit URL
 */
function getAuditUrl() {
    if (!window.decisionLog) return null;
    const base = window.location.href.replace(/[^/]*$/, '');
    return `${base}audit-view.html?session=${window.decisionLog.sessionId}`;
}

// Export for use in other scripts
window.DecisionLog = {
    init: initDecisionLog,
    logInference,
    logFinalDecision,
    logExpertPerspectives,
    logParsedElements,
    save: saveDecisionLog,
    export: exportDecisionLog,
    load: loadDecisionLog,
    getIndex: getDecisionLogIndex,
    getAuditUrl
};
