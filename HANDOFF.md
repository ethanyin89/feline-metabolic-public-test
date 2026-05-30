# Handoff Document: Expert-Driven Protocol Generator

**Project:** feline-metabolic-public-test
**Date:** 2026-05-30
**Author:** Claude Code
**Status:** Production-ready on GitHub Pages

---

## 1. Project Overview

### What It Does
A web-based tool that generates clinical trial protocols for feline metabolic research using LLM-powered expert simulation. The system simulates international and domestic veterinary experts reviewing requirements and producing professional-grade research protocols.

### Live URL
https://ethanyin89.github.io/feline-metabolic-public-test/

### Key Pages
| Page | Purpose |
|------|---------|
| `intake-parser.html` | Initial requirement parsing and classification |
| `protocol-generator.html` | Expert-driven protocol generation (main tool) |

---

## 2. Architecture

### System Flow
```
┌─────────────────┐     localStorage      ┌──────────────────────┐
│  Intake Parser  │ ──────────────────►   │  Protocol Generator  │
│  (Classification)│    handoff data      │  (Expert Simulation) │
└─────────────────┘                       └──────────────────────┘
                                                    │
                                                    ▼
                                          ┌──────────────────┐
                                          │   OpenRouter API │
                                          │  (Claude/GPT-4)  │
                                          └──────────────────┘
```

### Decision Chain Handoff
When user clicks "🧬 专家驱动生成器" in intake-parser.html:
1. Decision data saved to `localStorage.setItem('intake_handoff_data', JSON.stringify(data))`
2. Redirects to `protocol-generator.html?handoff=intake-parser`
3. Protocol generator reads handoff data and displays classification context

### Deployment Modes
| Mode | Detection | Behavior |
|------|-----------|----------|
| Local Dev | `localhost` in hostname | Uses proxy server at `http://localhost:3456` |
| GitHub Pages | `github.io` in hostname | Direct OpenRouter API calls |

---

## 3. Generation Pipeline

### Standard Mode (5 Steps)
```
Step 1: Expert Selection (Sonnet)
   └─► Select 6 experts based on domain (3 INTL + 3 CN)

Step 2: International Peer Review (Sonnet)
   └─► Lisa Freeman, Margarethe Hoenig perspectives

Step 3: Domestic Expert Review (Sonnet)
   └─► 夏兆飞, 王姜维, 陈杰 cross-validation

Step 4: Framework Generation (Sonnet)
   └─► 10-section outline

Step 5: Complete Protocol (Opus)
   └─► Full protocol generation
```

### Smart Mode (Hierarchical Expansion)
```
Phase 1: Structure (Haiku)           ~$0.01
   └─► Generate detailed outline for 10 sections

Phase 2: Section Expansion (Opus)    ~$2.50
   └─► 10 parallel expansions, each section gets full focus
   └─► Sections: 执行摘要, 研究背景, 研究设计, 动物模型,
       试验药物, 观察指标, 统计分析, 伦理福利, 风险评估, 时间线

Phase 3: Self-Critique (Opus)        ~$0.30
   └─► Quality scoring (1-10)
   └─► Issue identification with priority

Phase 4: Refinement (Sonnet)         ~$0.15
   └─► Fix high-priority issues

Phase 5: Final Assembly              ~$0.00
   └─► Combine sections + add metadata
```

### Cost Comparison
| Mode | Typical Cost | Output Quality | Output Length |
|------|-------------|----------------|---------------|
| Standard (Sonnet) | ~$0.60 | Framework-like | ~400 lines |
| Standard (Opus) | ~$3.00 | Better detail | ~500 lines |
| Smart Mode | ~$2.50 | Highest quality | ~800+ lines |

---

## 4. Key Files

### Frontend
| File | Description |
|------|-------------|
| `protocol-generator.html` | Main application (single HTML with embedded JS/CSS) |
| `intake-parser.html` | Requirement intake and classification |
| `expert-config-extended.js` | Expert pool definitions (6 experts) |
| `decision-log.js` | Decision audit trail system |

### Backend (Local Dev Only)
| File | Description |
|------|-------------|
| `proxy/server.js` | Express proxy server |
| `proxy/knowledge-router.js` | Knowledge base search |

### Configuration
| File | Description |
|------|-------------|
| `DESIGN.md` | Design system (colors, typography) |
| `CLAUDE.md` | AI assistant instructions |

---

## 5. Expert Pool

### International Experts (INTL)
| ID | Name | Specialty |
|----|------|-----------|
| `lisa-freeman` | Lisa Freeman | Veterinary nutrition, obesity management |
| `margarethe-hoenig` | Margarethe Hoenig | Feline diabetes, insulin resistance |
| `translational-advisor` | Translational Advisor | Cross-species PK/PD |

### Domestic Experts (CN)
| ID | Name | Specialty |
|----|------|-----------|
| `xia-zhaofei` | 夏兆飞 | DIO models, nutrition intervention |
| `wang-jiangwei` | 王姜维 | Endocrine diagnosis, diabetes |
| `chen-jie` | 陈杰 | Clinical evaluation, adverse reactions |

---

## 6. API Configuration

### OpenRouter Models Used
| Model ID | Usage | Cost/1M tokens |
|----------|-------|----------------|
| `anthropic/claude-3-haiku-20240307` | Structure generation | $0.25 |
| `anthropic/claude-sonnet-4` | Reviews, refinement | $3.00 |
| `anthropic/claude-opus-4` | Final protocol, critique | $15.00 |
| `openai/gpt-4o` | Alternative option | $5.00 |

### API Call Pattern
```javascript
// Direct OpenRouter call (GitHub Pages)
fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.href,
    'X-Title': 'Feline Protocol Generator'
  },
  body: JSON.stringify({
    model: 'anthropic/claude-opus-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4096
  })
});
```

---

## 7. Fixes Applied

### ISSUE-001: Expert Selection Failed on GitHub Pages (CRITICAL)
- **Problem:** Fetching from `localhost:3456` failed on public deployment
- **Fix:** Added client-side `EXPERT_POOL` fallback with `IS_GITHUB_PAGES` detection
- **Commit:** `e1fed2e`

### ISSUE-002: Excessive Console Errors from Proxy Polling
- **Problem:** `setInterval(checkProxyStatus, 10000)` caused constant errors
- **Fix:** Wrapped in `if (!IS_GITHUB_PAGES)` check
- **Commit:** `dc9d437`

### ISSUE-003: NetworkError on LLM API Calls
- **Problem:** `callLLMWithConfirmation` called proxy which doesn't exist
- **Fix:** Added `callOpenRouterDirect()` fallback for GitHub Pages
- **Commit:** `0b488c8`

---

## 8. How to Use

### For End Users
1. Go to https://ethanyin89.github.io/feline-metabolic-public-test/protocol-generator.html
2. Enter OpenRouter API key (get from https://openrouter.ai/)
3. Select model (Sonnet recommended for cost, Opus for quality)
4. **Optional:** Enable 🧠 Smart Mode for highest quality
5. Enter research requirement in Chinese
6. Click "开始生成"
7. Wait for 5 steps to complete (~2-5 minutes)
8. Download result as Markdown

### For Developers
```bash
# Clone
git clone https://github.com/ethanyin89/feline-metabolic-public-test.git
cd feline-metabolic-public-test

# Local development with proxy (optional)
cd proxy && npm install && node server.js

# Or just open HTML files directly - they work standalone
open protocol-generator.html
```

---

## 9. Future Enhancements

### Option D: Agentic Mode (Not Implemented)
```
Agent (Opus) with Tools:
├─► Search Knowledge Base
├─► Lookup Literature (PubMed/Google Scholar)
├─► Calculate Doses
├─► Validate Against Guidelines
└─► Self-Critique Loop
```

### Other Ideas
- [ ] Multi-model ensemble (GPT-4 + Claude + Gemini consensus)
- [ ] Save/load protocol drafts
- [ ] Version comparison
- [ ] Export to Word/PDF
- [ ] Integration with literature databases
- [ ] Cost optimization with caching

---

## 10. Known Limitations

1. **No authentication** - API key stored in localStorage (client-side only)
2. **No rate limiting** - Could hit OpenRouter limits on heavy use
3. **No caching** - Same prompt regenerates fully each time
4. **Chinese only** - UI and prompts in Chinese, English support not implemented
5. **Single domain** - Expert pool only covers metabolism, no oncology/cardiology etc.

---

## 11. Commit History (Recent)

| Commit | Description |
|--------|-------------|
| `2c5f318` | feat: add Smart Mode with hierarchical expansion |
| `0b488c8` | fix: add direct OpenRouter API fallback |
| `dc9d437` | fix: disable proxy polling on GitHub Pages |
| `e1fed2e` | fix: client-side fallback for expert pool |
| `dbeae08` | Add public test and decision chain handoff |

---

## 12. Contact

- **Repository:** https://github.com/ethanyin89/feline-metabolic-public-test
- **Issues:** https://github.com/ethanyin89/feline-metabolic-public-test/issues

---

*Generated by Claude Code on 2026-05-30*
