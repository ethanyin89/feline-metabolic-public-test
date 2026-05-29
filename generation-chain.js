/**
 * Protocol Generation Chain
 * Client-side implementation of the generation workflow
 *
 * Chain: Intake JSON → Wiki Evidence Pack → Peer Review → ChatGPT Framework → Claude Protocol → Quality Gate
 */

const GenerationChain = {
    // Quality Gate Rubric
    qualityRubric: {
        critical: [
            { id: 'C1', name: '边界声明', pattern: /不是批准版|不代表|均需|不处理报价/ },
            { id: 'C2', name: '生成链路', pattern: /客户粗需求|Wiki|专家|ChatGPT|Claude/ },
            { id: 'C3', name: '客户问题重述', pattern: /客户问题重述|真实.*拆解|技术问题/ },
            { id: 'C4', name: '证据表', pattern: /Evidence Table/ },
            { id: 'C5', name: '专家审核清单', pattern: /Expert Review Checklist/ },
            { id: 'C6', name: '无执行承诺', pattern: /动物数.*确定为[0-9]|剂量.*确定为.*mg/, negative: true },
            { id: 'C7', name: '无报价信息', pattern: /报价[：:][^不]|价格[：:].*[0-9].*万|费用[：:].*[0-9]/, negative: true }
        ],
        required: [
            { id: 'R1', name: '执行摘要', pattern: /Executive Summary|执行摘要/ },
            { id: 'R2', name: '实验目的', pattern: /实验目的|主要目的|Objectives/ },
            { id: 'R3', name: '背景依据', pattern: /实验背景与依据|Background/ },
            { id: 'R4', name: '受试物', pattern: /受试物|Test Article/ },
            { id: 'R5', name: '动物模型', pattern: /实验动物|推荐.*模型|动物模型/ },
            { id: 'R6', name: '入排标准', pattern: /入组标准|排除标准|Inclusion|Exclusion/ },
            { id: 'R7', name: '实验设计', pattern: /实验设计|Experimental Design|随机化/ },
            { id: 'R8', name: '终点分层', pattern: /主要终点|次要终点|探索.*终点/ },
            { id: 'R9', name: '样本采集', pattern: /样本采集|Sample Collection/ },
            { id: 'R10', name: '动物福利', pattern: /动物福利|Animal Welfare|伦理/ },
            { id: 'R11', name: '数据分析', pattern: /数据分析|Data Analysis|统计/ },
            { id: 'R12', name: '失效模式', pattern: /失效模式|Failure Mode|风险.*缓解/ },
            { id: 'R13', name: 'Sponsor问题', pattern: /Sponsor.*问题|后续问题/ },
            { id: 'R14', name: '内部材料', pattern: /内部材料|材料需求|下一步/ },
            { id: 'R15', name: 'Wiki证据', pattern: /feline-research-os|Wiki.*evidence|Wiki source/ },
            { id: 'R16', name: '专家视角', pattern: /专家.*视角|同行评审|角色视角/ }
        ]
    },

    /**
     * Step 1: Build Intake JSON from parsed result
     */
    buildIntakeJSON(parsedResult) {
        const pe = parsedResult.parsed_elements || {};
        const matrix = parsedResult.matrixClassification || {};

        return {
            customer_raw_need: parsedResult.raw_request || '',
            classification: {
                axis_a: matrix.axisA || 'unknown',
                axis_b: matrix.axisB || 'unknown',
                output_level: matrix.level || 'L1',
                confidence: parsedResult.confidence === 'high' ? 0.9 : parsedResult.confidence === 'medium' ? 0.7 : 0.5
            },
            extracted_facts: {
                molecule_type: pe.drug_type || 'unknown',
                target_gene: pe.target_gene || null,
                target_species: 'cat',
                target_condition: pe.target_indication || 'metabolic',
                study_intent: pe.study_intent || 'efficacy_exploration',
                disclosed_details: {
                    dose: pe.dosing_route ? 'partial' : null,
                    route: pe.dosing_route || null,
                    frequency: pe.dosing_regimen || null,
                    formulation: null
                }
            },
            missing_critical: parsedResult.missing_critical || [],
            risk_flags: (parsedResult.risk_flags || []).map(f => ({
                type: 'warning',
                description: f,
                severity: 'medium'
            })),
            suggested_clarifications: parsedResult.clarification_questions || [],
            metadata: {
                parsed_at: new Date().toISOString(),
                parser_version: '1.0',
                source: 'intake-parser-web'
            }
        };
    },

    /**
     * Step 2: Generate Wiki Evidence Pack
     */
    generateWikiEvidencePack(intakeJSON, parsedResult) {
        const axisA = intakeJSON.classification.axis_a;
        const axisB = intakeJSON.classification.axis_b;
        const level = intakeJSON.classification.output_level;

        // Derive evidence needs from classification
        const evidenceNeeds = [];

        if (axisA.includes('DIO') || axisA.includes('OVERWEIGHT')) {
            evidenceNeeds.push({
                source: 'feline-research-os/obesity/mechanism-overview',
                supports: '多因素肥胖成因、BCS/MCS 评估、体成分测量',
                boundary: '只针对猫；不覆盖其他物种外推'
            });
        }
        if (axisA.includes('INSULIN') || axisA.includes('DM') || axisA.includes('AT_RISK')) {
            evidenceNeeds.push({
                source: 'feline-research-os/obesity/diabetes-bridge',
                supports: '肥胖-糖尿病桥接、胰岛素抵抗定义、稳定 DM 诊断标准',
                boundary: '不提供诊断；只提供定义和终点选择依据'
            });
        }
        if (level === 'L2' || level === 'L3') {
            evidenceNeeds.push({
                source: 'feline-research-os/obesity/endpoint-handbook',
                supports: '终点分级（主要/次要/探索）、检测方法、时间点',
                boundary: '不包含具体 SOP 或 assay validation'
            });
        }

        return {
            generated_for: 'Intake JSON',
            output_level: level,
            classification: `${axisA} × ${axisB}`,
            generated_at: new Date().toISOString(),
            evidence_sources: evidenceNeeds,
            status: evidenceNeeds.length > 0 ? 'populated' : 'placeholder'
        };
    },

    /**
     * Step 3: Generate Peer Review Critique
     */
    generatePeerReviewCritique(intakeJSON, parsedResult) {
        const pe = parsedResult.parsed_elements || {};
        const perspectives = [];

        // International perspectives
        if (pe.drug_type && pe.drug_type !== 'other') {
            perspectives.push({
                domain: '兽医营养/肥胖医学',
                type: 'international',
                constraint: '不只看体重；必须加入 BCS/MCS、体成分、摄食量和肌肉保留风险',
                boundary: '不确认具体 BCS 评分方法可用性'
            });
        }

        perspectives.push({
            domain: '小动物内分泌/糖尿病',
            type: 'international',
            constraint: '肥胖代谢风险和稳定糖尿病治疗 claim 必须分开',
            boundary: '不诊断个体动物'
        });

        perspectives.push({
            domain: '转化药理学',
            type: 'international',
            constraint: '剂量、route、frequency 必须由 species-fit、PK/PD、安全性决定',
            boundary: '不提供具体剂量数字'
        });

        // Domestic perspectives
        perspectives.push({
            domain: '模型/营养',
            type: 'domestic',
            constraint: 'DIO 模型需明确来源、建模逻辑、baseline 稳定性和日粮控制',
            boundary: '不确认内部模型可用性'
        });

        perspectives.push({
            domain: '实验室诊断/内分泌检测',
            type: 'domestic',
            constraint: '单点血糖受应激影响，需标准化禁食、采血时间和样本处理',
            boundary: '不确认具体 assay 可用性'
        });

        perspectives.push({
            domain: '研究总监/福利',
            type: 'domestic',
            constraint: '体重下降需与厌食/不适区分，必须有 dose hold、withdrawal 和救援规则',
            boundary: '不批准方案执行'
        });

        return {
            generated_for: 'Intake JSON',
            approach: 'Role-based domain expertise perspectives',
            generated_at: new Date().toISOString(),
            perspectives: perspectives,
            disclaimer: '这些视角代表领域专业考量，不是实际专家审核记录、署名背书或签字意见。'
        };
    },

    /**
     * Step 4: Generate ChatGPT Framework
     */
    generateChatGPTFramework(intakeJSON, parsedResult, wikiPack, peerReview) {
        const pe = parsedResult.parsed_elements || {};
        const model = parsedResult.model_recommendation || {};
        const endpoints = parsedResult.endpoint_suggestions || {};

        return {
            generated_for: 'Intake JSON',
            framework_version: new Date().toISOString(),
            classification: `${intakeJSON.classification.axis_a} × ${intakeJSON.classification.axis_b} (${intakeJSON.classification.output_level})`,
            expert_perspective: '待专家选择提示词确定',

            problem_definition: {
                customer_stated: intakeJSON.customer_raw_need,
                technical_questions: intakeJSON.missing_critical,
                study_is_not: model.not_recommended || '正式执行方案 / 报价处理',
                study_is: `${intakeJSON.classification.output_level === 'L3' ? '相对完整方案草案' : '模型适配评估'}`
            },

            evidence_base: {
                wiki_sources: wikiPack.evidence_sources.map(s => s.source),
                evidence_gaps: intakeJSON.missing_critical
            },

            experiment_design: {
                objectives: {
                    primary: endpoints.primary || ['待确认'],
                    secondary: endpoints.mechanism || ['待确认'],
                    exploratory: endpoints.safety || ['待确认']
                },
                test_article: {
                    type: pe.drug_type || 'TBD',
                    target: pe.target_gene || 'TBD',
                    route: pe.dosing_route || 'TBD',
                    tbd_fields: ['dose', 'frequency', 'formulation']
                },
                animals: {
                    recommended: model.recommended || 'DIO 肥胖猫',
                    not_recommended: model.not_recommended,
                    not_recommended_reason: model.not_recommended_reason
                }
            },

            key_decisions: [
                { point: '模型选择', position: model.recommended || 'TBD', rationale: model.reason || '待确认' },
                { point: '主要终点', position: (endpoints.primary || ['TBD'])[0], rationale: '待 Wiki 证据支持' },
                { point: '研究周期', position: 'TBD', rationale: '待 sponsor 确认' },
                { point: '剂量选择', position: 'TBD', rationale: '需要 PK/PD 数据' }
            ],

            tbd_items: intakeJSON.missing_critical.map(item => ({
                item: item,
                required_source: 'sponsor package 或内部材料'
            })),

            handoff_ready: intakeJSON.classification.output_level === 'L3' && intakeJSON.missing_critical.length < 5,
            status: 'framework_complete'
        };
    },

    /**
     * Step 5: Generate Claude Protocol Draft
     */
    generateClaudeProtocol(intakeJSON, parsedResult, wikiPack, peerReview, framework) {
        const pe = parsedResult.parsed_elements || {};
        const model = parsedResult.model_recommendation || {};
        const endpoints = parsedResult.endpoint_suggestions || {};
        const level = intakeJSON.classification.output_level;
        const date = new Date().toISOString().split('T')[0];

        const protocol = `# 研究方案草案

**Version:** v0.2 (web-generated draft)
**Date:** ${date}
**Status:** Internal ${level} draft generated from rough need
**Generation chain:** 客户粗需求 -> feline-research-os Wiki -> 国内外专家角色同行评审 -> ChatGPT 方案框架 -> Claude 长文方案
**Boundary:** 本方案不是批准版，不代表执行承诺，所有参数均需 sponsor package 和内部 feasibility 确认后才能落地。本方案不处理报价。

---

## 0. Executive Summary

本方案基于客户粗需求生成，分类为 ${intakeJSON.classification.axis_a} × ${intakeJSON.classification.axis_b}，输出层级 ${level}。

**客户披露内容:** ${intakeJSON.customer_raw_need.substring(0, 200)}${intakeJSON.customer_raw_need.length > 200 ? '...' : ''}

**模型方向建议:** ${model.recommended || '待确认'}

**核心设计建议:**
- 主要终点: ${(endpoints.primary || ['待确认']).join(', ')}
- 次要终点: ${(endpoints.mechanism || ['待确认']).join(', ')}
- 模型选择理由: ${model.reason || '待确认'}

---

## 1. 客户问题重述和真实技术问题拆解

### 1.1 客户表面问题
${intakeJSON.customer_raw_need}

### 1.2 真实需要拆解的技术问题
| 技术问题 | 本方案处理方式 |
|---|---|
${intakeJSON.missing_critical.map(q => `| ${q} | 待 sponsor package 或内部材料确认 |`).join('\n')}

### 1.3 本研究不是
${model.not_recommended || '正式执行方案 / 报价处理'}

### 1.4 本研究是
${level === 'L3' ? 'DIO 肥胖猫探索性代谢药效评价草案' : '模型适配评估 / 材料澄清'}

---

## 2. 生成依据

### 2.1 feline-research-os Wiki evidence pack
| Wiki source | 支持内容 | 边界 |
|---|---|---|
${wikiPack.evidence_sources.map(s => `| ${s.source} | ${s.supports} | ${s.boundary} |`).join('\n')}

### 2.2 国内外专家角色同行评审吸收
| 角色视角 | 对方案的约束 |
|---|---|
${peerReview.perspectives.map(p => `| ${p.domain} (${p.type === 'international' ? '国际' : '国内'}) | ${p.constraint} |`).join('\n')}

---

## 3. 实验目的

### 3.1 主要目的
${(endpoints.primary || ['待确认']).join('\n- ')}

### 3.2 次要目的
${(endpoints.mechanism || ['待确认']).join('\n- ')}

### 3.3 探索目的
${(endpoints.safety || ['待确认']).join('\n- ')}

---

## 4. 实验背景与依据

基于 feline-research-os Wiki 证据包，${pe.target_indication || '代谢异常'}领域的研究需要关注:
- 多因素肥胖成因
- 终点选择的科学依据
- 模型选择的合理性

具体依据见 Section 2.1 Wiki evidence pack。

---

## 5. 受试物

| 字段 | 当前状态 | 正式方案所需 |
|---|---|---|
| Molecule / modality | ${pe.drug_type || 'TBD'} | Sponsor disclosure |
| Target / mechanism | ${pe.target_gene || 'TBD'} | Sponsor disclosure |
| Route | ${pe.dosing_route || 'TBD'} | PK/PD analysis |
| Dose levels | TBD | PK/PD-based selection |
| Frequency | ${pe.dosing_regimen || 'TBD'} | Half-life data |
| Formulation | TBD | CMC information |

**边界:** 剂量、route、frequency 必须由 species-fit、PK/PD、安全性决定，不能从其他种属直接外推。

---

## 6. 实验动物

### 6.1 推荐动物模型
${model.recommended || 'DIO 肥胖猫'}

**选择理由:** ${model.reason || '待确认'}

### 6.2 不推荐 ${model.not_recommended || '其他模型'}
| 原因 | 影响 |
|---|---|
| ${model.not_recommended_reason || '待确认'} | 可能影响结果解读 |

### 6.3 入组标准草案
1. [待内部模型 SOP 确认]
2. [待 baseline 表型标准确认]
3. [待健康状态标准确认]

### 6.4 排除标准草案
1. [待福利标准确认]
2. [待疾病排除标准确认]

### 6.5 基线检测包
- 最低包: 体重、BCS、临床观察
- 增强包: 血糖、果糖胺、血脂、肝肾功能 (待 assay 可用性确认)

---

## 7. 实验设计

### 7.1 设计原则
平行对照设计，vehicle 对照组 vs 处理组。

### 7.2 随机化
按基线体重/BCS 分层随机化。

### 7.3 盲法
单盲或双盲 (待可行性确认)。

### 7.4 分组和剂量
| 组别 | 动物数 | 处理 | 剂量 |
|---|---|---|---|
| Vehicle | TBD | Vehicle | - |
| Low | TBD | Test article | TBD |
| High | TBD | Test article | TBD |

**边界:** 动物数量需统计师 power analysis，剂量需 PK/PD-based selection。

### 7.5 给药原则
[待 route、frequency、duration 确认]

---

## 8. 观察和评价

### 8.1 主要终点
${(endpoints.primary || ['待确认']).map((e, i) => `${i + 1}. ${e}`).join('\n')}

### 8.2 次要终点
${(endpoints.mechanism || ['待确认']).map((e, i) => `${i + 1}. ${e}`).join('\n')}

### 8.3 探索性终点
${(endpoints.safety || ['待确认']).map((e, i) => `${i + 1}. ${e}`).join('\n')}

### 8.4 Schedule of Activities
| 时间点 | 检测项目 |
|---|---|
| Baseline (Day -7 to -1) | 体重、BCS、临床观察、基线血样 |
| Treatment Day 1 | 给药、临床观察 |
| Weekly | 体重、摄食、临床观察 |
| Terminal | 完整检测套餐、组织采样 (待确认) |

---

## 9. 样本采集和检测链

[待内部 assay chain 和 SOP 确认]

- Blood sampling: 待标准化禁食、采血时间和样本处理 SOP
- Tissue sampling: 待确认是否接受组织取样

---

## 10. 动物福利和伦理

[待 Study Director 和福利官确认]

- 体重下降救援规则: 需与厌食/不适区分
- Humane endpoints: 待定义
- Dose hold/withdrawal 规则: 待定义

---

## 11. 数据分析整理

### 11.1 统计方法
[待统计师确认]

- 主要终点: 待确认 effect size 和 power
- 多重比较校正: 待确认

---

## 12. 大致时间窗口

[待排期确认]

- Acclimation: 1-2 weeks
- Treatment: 4-8 weeks (待 sponsor 确认)
- Analysis/reporting: 2-4 weeks

**边界:** Timeline 需要真实资源表确认，当前仅为估计。

---

## 13. 失效模式和缓解

| 失效模式 | 风险水平 | 缓解措施 |
|---|---|---|
| 模型 baseline 不稳定 | Medium | 延长 acclimation，收紧入组标准 |
| 剂量不适当 | High | 需要 PK/PD 数据支持剂量选择 |
| 终点检测不可行 | Medium | 提前确认 assay availability |
| 福利问题 | Medium | 定义清晰的 dose hold 和 humane endpoint |

---

## 14. Sponsor 后续问题清单

${intakeJSON.suggested_clarifications.map((q, i) => `${i + 1}. ${q}`).join('\n')}

---

## 15. Evidence Table

| Claim | Source | Boundary |
|---|---|---|
${wikiPack.evidence_sources.map(s => `| ${s.supports.split('、')[0]} | ${s.source} | ${s.boundary} |`).join('\n')}

---

## 16. Expert Review Checklist

| Review Area | Status | Notes |
|---|---|---|
| 终点选择 | Role-based review | 基于 Wiki evidence，待真人专家确认 |
| 模型选择 | Role-based review | 基于分类矩阵，待内部可行性确认 |
| 剂量设计 | TBD | 需要 sponsor PK/PD 数据 |
| 福利标准 | TBD | 需要 Study Director 确认 |
| 统计设计 | TBD | 需要统计师 review |

---

## 17. 内部材料需求和下一步

| Gate | Required material | 缺失时的处理 |
|---|---|---|
| Sponsor package | modality、target、mechanism、intended claim、cat activity、PK/safety | Sponsor information not provided |
| DIO feasibility | DIO SOP、动物来源、cohort criteria、baseline phenotype | DIO is a candidate direction, pending feasibility |
| Assay chain | Blood sampling SOP、assay availability | Assay feasibility not available |
| Statistics | primary endpoint、effect size、variance、sample size | Sample size requires statistician review |
| Expert review | real reviewer、date、scope、conclusion | Role-based review only; real expert review pending |

---

**Note:** 本方案是基于客户粗需求的草案，不是可执行方案。下一步需要补齐 sponsor package、内部模型和 assay feasibility、统计样本量、福利审核和真人专家评审。
`;

        return {
            content: protocol,
            metadata: {
                generated_at: new Date().toISOString(),
                output_level: level,
                word_count: protocol.split(/\s+/).length,
                classification: `${intakeJSON.classification.axis_a} × ${intakeJSON.classification.axis_b}`
            }
        };
    },

    /**
     * Step 6: Run Quality Gate
     */
    runQualityGate(protocolContent) {
        const results = {
            critical: { passed: 0, failed: 0, failures: [] },
            required: { passed: 0, failed: 0, failures: [] },
            warnings: [],
            result: 'UNKNOWN'
        };

        // Word count check
        const wordCount = protocolContent.split(/\s+/).length;
        if (wordCount < 3000) {
            results.warnings.push(`Word count ${wordCount} < 3000 suggests framework-only output`);
        }

        // Placeholder detection
        const placeholderCount = (protocolContent.match(/\[placeholder|\[pending|\[requires|\[tbd\]|待填写|TBD/gi) || []).length;
        if (placeholderCount > 10) {
            results.warnings.push(`High placeholder count (${placeholderCount}) suggests incomplete content`);
        }

        // Run critical checks
        for (const check of this.qualityRubric.critical) {
            const matches = check.pattern.test(protocolContent);
            const passed = check.negative ? !matches : matches;

            if (passed) {
                results.critical.passed++;
            } else {
                results.critical.failed++;
                results.critical.failures.push(check);
            }
        }

        // Run required checks
        for (const check of this.qualityRubric.required) {
            const matches = check.pattern.test(protocolContent);
            const passed = check.negative ? !matches : matches;

            if (passed) {
                results.required.passed++;
            } else {
                results.required.failed++;
                results.required.failures.push(check);
            }
        }

        // Determine overall result
        if (results.critical.failed > 0) {
            results.result = 'FAIL';
            results.reason = 'Critical checks failed';
        } else if (placeholderCount > 20) {
            results.result = 'FAIL';
            results.reason = 'Too many placeholders (framework-only)';
        } else if (results.required.failed > 0) {
            results.result = 'WARN';
            results.reason = `${results.required.failed} required checks failed`;
        } else if (wordCount < 3000 || placeholderCount > 10) {
            results.result = 'WARN';
            results.reason = 'Low word count or placeholders';
        } else {
            results.result = 'PASS';
            results.reason = 'Meets v1.4 quality standard';
        }

        results.summary = {
            critical: `${results.critical.passed}/${this.qualityRubric.critical.length}`,
            required: `${results.required.passed}/${this.qualityRubric.required.length}`,
            wordCount: wordCount,
            placeholderCount: placeholderCount
        };

        return results;
    },

    /**
     * Main: Run full generation chain
     */
    async generate(parsedResult) {
        const artifacts = {
            timestamp: new Date().toISOString(),
            steps: []
        };

        try {
            // Step 1: Build Intake JSON
            const intakeJSON = this.buildIntakeJSON(parsedResult);
            artifacts.intakeJSON = intakeJSON;
            artifacts.steps.push({ step: 1, name: 'Intake JSON', status: 'complete' });

            // Step 2: Wiki Evidence Pack
            const wikiPack = this.generateWikiEvidencePack(intakeJSON, parsedResult);
            artifacts.wikiPack = wikiPack;
            artifacts.steps.push({ step: 2, name: 'Wiki Evidence Pack', status: 'complete' });

            // Step 3: Peer Review Critique
            const peerReview = this.generatePeerReviewCritique(intakeJSON, parsedResult);
            artifacts.peerReview = peerReview;
            artifacts.steps.push({ step: 3, name: 'Peer Review Critique', status: 'complete' });

            // Step 4: ChatGPT Framework
            const framework = this.generateChatGPTFramework(intakeJSON, parsedResult, wikiPack, peerReview);
            artifacts.framework = framework;
            artifacts.steps.push({ step: 4, name: 'ChatGPT Framework', status: 'complete' });

            // Step 5: Claude Protocol
            const protocol = this.generateClaudeProtocol(intakeJSON, parsedResult, wikiPack, peerReview, framework);
            artifacts.protocol = protocol;
            artifacts.steps.push({ step: 5, name: 'Claude Protocol', status: 'complete' });

            // Step 6: Quality Gate
            const qualityGate = this.runQualityGate(protocol.content);
            artifacts.qualityGate = qualityGate;
            artifacts.steps.push({ step: 6, name: 'Quality Gate', status: qualityGate.result });

            artifacts.success = true;
            artifacts.canDownload = qualityGate.result !== 'FAIL';

        } catch (error) {
            artifacts.success = false;
            artifacts.error = error.message;
            artifacts.steps.push({ step: 'error', name: 'Generation Failed', status: 'error' });
        }

        return artifacts;
    }
};

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.GenerationChain = GenerationChain;
}
