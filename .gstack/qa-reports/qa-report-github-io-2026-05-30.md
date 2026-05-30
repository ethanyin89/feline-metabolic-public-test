# QA Report: feline-metabolic-public-test

**Date:** 2026-05-30
**URL:** https://ethanyin89.github.io/feline-metabolic-public-test/
**Duration:** ~15 minutes
**Pages Tested:** 2 (protocol-generator.html, intake-parser.html)
**Health Score:** 85/100 → 92/100 (after fixes)

## Summary

- **Issues Found:** 2
- **Fixes Applied:** 2 (both verified)
- **Deferred:** 0

## Issues

### ISSUE-001: Expert Selection failed on GitHub Pages (CRITICAL)
**Status:** VERIFIED ✅

**Description:** The Expert Selection step (Step 1) showed "出错" (error) when running on GitHub Pages. The page was trying to fetch expert data from `http://localhost:3456/api/experts` which is unavailable on the public deployment.

**Root Cause:** `protocol-generator.html:781` fetched from `${PROXY_URL}/api/experts` without fallback for when the proxy is unavailable.

**Fix:**
- Added `<script src="expert-config-extended.js"></script>` to load expert pool client-side
- Added `IS_GITHUB_PAGES` detection based on hostname
- Modified `runStep1_ExpertSelection` to fall back to `EXPERT_POOL` when proxy unavailable
- Commit: e1fed2e

**Evidence:**
- Before: Step 1 showed "出错" immediately on page load
- After: Step 1 shows "已完成" with all 6 experts loaded (3 international, 3 domestic)
- Console: "Using client-side EXPERT_POOL fallback" confirms fallback working

---

### ISSUE-002: Excessive console errors from proxy polling (MEDIUM)
**Status:** VERIFIED ✅

**Description:** The page polled the proxy server every 10 seconds indefinitely, generating ~6 "ERR_CONNECTION_REFUSED" errors per minute on GitHub Pages.

**Root Cause:** `setInterval(checkProxyStatus, 10000)` ran unconditionally, even when deployed to GitHub Pages where no proxy exists.

**Fix:**
- Wrapped the polling interval in `if (!IS_GITHUB_PAGES)` check
- Polling now only runs when serving locally
- Commit: dc9d437

**Evidence:**
- Before: Console showed 20+ connection refused errors during testing session
- After: Console shows only initial check error, no repeated errors
- Post-deployment verification: After reloading the page and waiting 15+ seconds, no new errors appeared in console

---

## Integration Testing: Intake Parser → Protocol Generator Handoff

**Status:** WORKING ✅

The decision chain handoff flow was tested end-to-end:

1. Filled in test requirement in intake-parser.html
2. Generated initial judgment
3. Clicked "🧬 专家驱动生成器" button
4. Protocol-generator.html loaded with handoff context displayed:
   - 分类矩阵: OVERWEIGHT × METABOLIC → L3
   - 药物类型: GLP-1 RA / 代谢改善候选物
   - 模型建议: DIO肥胖猫
   - 风险提示: DIO/肥胖模型不能自动等同于稳定临床糖尿病模型
5. Rough need textarea pre-filled with original request
6. "查看原始决策路径" link available for traceability

---

## Health Score Breakdown

| Category | Before | After | Weight |
|----------|--------|-------|--------|
| Console | 10 | 80 | 15% |
| Links | 100 | 100 | 10% |
| Visual | 100 | 100 | 10% |
| Functional | 60 | 95 | 20% |
| UX | 90 | 95 | 15% |
| Performance | 95 | 95 | 10% |
| Content | 100 | 100 | 5% |
| Accessibility | 85 | 85 | 15% |

**Final Score:** 85 → 92 (+7)

---

## Screenshots

- `screenshots/protocol-generator-initial.png` - Initial page state
- `screenshots/before-start-generation.png` - Before clicking start
- `screenshots/after-start-generation.png` - After start, showing fixed Expert Selection
- `screenshots/intake-parser-initial.png` - Intake parser page
- `screenshots/intake-parser-result.png` - After generating judgment
- `screenshots/before-handoff.png` - Before handoff click
- `screenshots/after-handoff.png` - Protocol generator with handoff context

---

## PR Summary

> QA found 2 issues, fixed 2 (verified), health score 85 → 92. Expert selection now works on GitHub Pages via client-side fallback; proxy polling disabled on public deployment.
