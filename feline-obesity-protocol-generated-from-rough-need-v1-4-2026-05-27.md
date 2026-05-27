# 猫肥胖/代谢改善候选物临床前药效评价方案草案

**Version:** v1.4 GOLDEN OUTPUT DRAFT  
**Date:** 2026-05-27  
**Status:** Internal long-form protocol draft generated from rough need  
**Generation chain:** 客户粗需求 -> `feline-research-os` Karpathy LLM Wiki -> 国内外专家角色同行评审 -> ChatGPT 方案框架 -> Claude 长文方案  
**Boundary:** 本文件不是批准版 SOP，不是报价文件，不处理报价，不代表真实专家本人已审核或背书。所有动物数量、剂量、SOP、assay QC、timeline、模型可用性和执行承诺均需真实 sponsor package、内部 Class B execution evidence、Study Director、统计、assay、福利、QA/legal 和真人专家审核。

---

## 0. Executive Summary

客户当前只披露了粗需求：希望围绕猫肥胖/代谢改善方向，基于有限信息形成一份相对完整的临床前药效实验方案。候选物暂按 GLP-1 RA 或类似代谢改善候选物处理，模型方向为 DIO 肥胖猫或肥胖伴早期糖代谢风险猫，重点关注体重、体成分、摄食量、糖代谢和安全性。

本方案建议将第一项研究定位为：

> DIO 肥胖猫或肥胖伴早期代谢异常风险猫中的探索性代谢药效评价，而不是稳定临床糖尿病治疗试验。

核心设计建议如下：

1. 研究模型优先考虑 DIO 肥胖猫或肥胖伴早期糖代谢风险猫；不建议把第一项研究直接设计成自然糖尿病猫治疗试验。
2. 主要药效问题定义为：候选物是否能在肥胖/代谢风险猫中改善体重、体脂/体成分、摄食行为和糖代谢相关指标。
3. 主要终点候选为体重相对 baseline 变化和体脂/体成分变化；糖代谢指标作为关键次要或探索终点。
4. 受试物、剂量、route、frequency、formulation、给药周期和停药规则均需 sponsor package 和 PK/PD / safety review 后确定。
5. 动物数不得凭经验写死；应由主要终点、方差、预期效应量、脱落率、dose-response 需求和伦理/资源约束共同决定。
6. 报价不属于当前项目范围。

---

## 1. 客户问题重述和真实技术问题拆解

### 1.1 客户表面问题

客户表面上希望得到：

> 一份猫肥胖/代谢改善候选物的临床前药效实验方案。

### 1.2 真实需要拆解的问题

| 技术问题 | 本方案处理方式 |
|---|---|
| 候选物是否适合猫物种 | 需要 sponsor 提供猫 target 活性、species-fit、PK/PD 或桥接依据 |
| 猫上是否能读出减重/体脂信号 | 以 DIO 肥胖猫/肥胖代谢风险猫作为候选模型方向 |
| 是否能支持糖代谢改善判断 | 使用 fasting glucose、fructosamine、insulin、可选 OGTT/IVGTT/CGM，不用单点血糖做结论 |
| 是否能支持机制解释 | target engagement、qPCR、adipokine、inflammatory marker 只能作为机制支持 |
| 是否能进入执行 | 不能。缺 sponsor package、内部模型材料、assay/SOP/QC、统计和福利审查 |

### 1.3 本研究不是

1. 稳定临床糖尿病猫治疗试验。
2. 注册性 pivotal study。
3. 宠主减重指导方案。
4. CRO 已确认模型资源、SOP、assay、timeline 的执行承诺。
5. 报价或商务文件。

### 1.4 本研究是

> 基于客户粗需求和可披露信息形成的 early feline obesity / metabolic improvement efficacy and mechanism-readability protocol draft。

---

## 2. 生成依据

### 2.1 feline-research-os Wiki evidence pack

| Wiki source | 支持内容 | 边界 |
|---|---|---|
| `topics/obesity/mechanism-overview.md` | 猫肥胖是多因素营养/代谢问题，风险因素包括动物因素、日粮、环境、喂养行为和体况 | 不证明内部 DIO 模型可用性 |
| `topics/obesity/diabetes-bridge-bilingual.md` | 肥胖与胰岛素敏感性下降、葡萄糖代谢异常风险相关 | 不支持把肥胖猫直接写成糖尿病治疗模型 |
| `topics/diabetes/endpoint-handbook.md` | 糖代谢终点需要分层：glycemic control、remission、diet response、body condition、safety | 不支持治疗方案排名或正式疗效 claim |

### 2.2 国内外专家角色同行评审吸收

| 角色视角 | 对方案的约束 |
|---|---|
| 国际兽医营养/肥胖医学 | 不只看体重；必须加入 BCS/MCS、体成分、摄食量和肌肉保留风险 |
| 国际小动物内分泌/糖尿病 | 肥胖代谢风险和稳定糖尿病治疗 claim 必须分开 |
| 国际转化药理 | 剂量、route、frequency 必须由 species-fit、PK/PD、安全性决定 |
| 国内模型/营养同行 | DIO 模型需明确来源、建模逻辑、baseline 稳定性和日粮控制 |
| 国内实验室诊断/内分泌检测 | 单点血糖受应激影响，需标准化禁食、采血时间和样本处理 |
| 国内 Study Director/福利 | 体重下降需与厌食/不适区分，必须有 dose hold、withdrawal 和救援规则 |

---

## 3. 实验目的

### 3.1 主要目的

评价候选代谢改善受试物在 DIO 肥胖猫或肥胖伴早期糖代谢风险猫中，是否相对于 vehicle/placebo 改善体重和体脂/体成分相关指标。

### 3.2 次要目的

1. 评价摄食量、饮水、BCS/MCS、活动和一般状态变化。
2. 评价 fasting glucose、fructosamine、insulin、lipid panel 等糖脂代谢指标变化。
3. 描述给药期间安全性、耐受性和动物福利事件。

### 3.3 探索目的

1. 若候选物机制需要，评价 target engagement、qPCR 或下游 pathway marker。
2. 若设备、assay 和福利条件允许，探索 CGM、adipokine、inflammatory marker、粪便或行为终点。
3. 为后续 dose optimization、机制验证或 confirmatory study 提供 endpoint、variance、feasibility 和 safety signal 输入。

---

## 4. 实验背景与依据

猫肥胖不应被简化为单纯体重过高。根据 `feline-research-os` 肥胖机制页，猫肥胖涉及动物内在因素、绝育状态、年龄、日粮、环境、活动水平、喂养方式和 owner perception 等多因素。肥胖可与胰岛素抵抗、糖代谢异常、肌肉/运动负担、皮肤/泌尿/肾脏等相关病理共同出现。因此，一个代谢改善研究不能只用体重作为唯一读数。

肥胖-糖尿病桥接页提示，肥胖与胰岛素敏感性下降和 glucose effectiveness 变化相关；但个体易感性重要，并非所有肥胖猫都会变成糖尿病猫。这个边界决定了本研究的定位：糖代谢指标应作为代谢改善方向的关键次要或探索终点，而不是直接写成糖尿病治疗疗效。

糖尿病终点手册进一步提示，glycemic control、remission、diet response、body condition、safety 和 complication endpoints 必须分层解释。基于这一点，本方案将体重/体成分作为主要药效候选终点，将 fasting glucose、fructosamine、insulin、lipid panel 作为代谢解释终点，并将摄食量、MCS、GI 反应、安全实验室指标用于区分“真实代谢改善”和“厌食/不适导致的体重下降”。

---

## 5. 受试物

当前受试物只能按“GLP-1 RA 或类似代谢改善候选物”占位。正式方案前必须补齐：

| 字段 | 当前状态 | 正式方案所需 |
|---|---|---|
| Molecule / modality | Not provided | 候选物名称、类型、批号、纯度/浓度 |
| Target / mechanism | Not provided | 靶点、作用机制、猫 species-fit |
| Route | TBD | 给药途径和可行性 |
| Dose levels | TBD | PK/PD、安全性、暴露和剂量选择依据 |
| Frequency | TBD | 半衰期、暴露窗口、耐受性和操作可行性 |
| Formulation | TBD | 制剂、储存、稳定性、适口性/注射可行性 |

剂量不得从人、犬或啮齿类数据直接换算成猫执行剂量。非猫数据只能作为桥接问题来源，而不能替代猫种属 PK/PD 或安全性判断。

---

## 6. 实验动物

### 6.1 推荐动物模型

首选候选模型：

> DIO 肥胖猫或肥胖伴早期代谢异常风险猫。

推荐理由：

1. 更贴合减重、体脂、摄食和胰岛素敏感性变化的研究问题。
2. 比自然糖尿病猫更适合作为第一项 controlled preclinical metabolic efficacy study。
3. 可同时观察体重、体成分、摄食、糖代谢和安全终点。
4. 可以在条件允许时加入机制终点。

### 6.2 不推荐首项研究直接使用自然糖尿病猫

| 原因 | 影响 |
|---|---|
| 病程、beta-cell function 和既往治疗差异大 | 药效信号容易被疾病阶段掩盖 |
| 饮食、胰岛素或其他治疗背景不一致 | 终点解释困难 |
| 并发病和 rescue 标准复杂 | 动物福利和数据解释风险增加 |
| 研究 claim 容易被误写成糖尿病治疗 | 商务和科学风险过高 |

自然糖尿病猫可作为后续 translational / field-like exploratory study，而不应作为当前粗需求下的第一项方案。

### 6.3 入组标准草案

1. 成年猫，年龄、性别、绝育状态完整记录。
2. 符合 DIO 肥胖或肥胖伴早期代谢异常风险定义。
3. Baseline 期体重和摄食相对稳定。
4. 可完成称重、摄食记录、采血、给药、体成分/体况评估和日常观察。
5. 无急性系统性疾病或需要临床救治状态。

### 6.4 排除标准草案

1. 已确诊且需要临床治疗的稳定或不稳定糖尿病猫。
2. 明显厌食、呕吐、腹泻、脱水、疼痛或严重应激状态。
3. 近期使用显著影响体重、食欲、糖代谢或脂代谢的药物。
4. 肝肾、胰腺、内分泌或血液学异常达到福利或解释风险阈值。
5. 无法适应笼舍、采血、给药或体成分测量流程。

### 6.5 基线检测包

最低基线包：

1. Physical exam。
2. Body weight。
3. BCS / MCS。
4. Food intake baseline。
5. CBC。
6. Serum chemistry。
7. Urinalysis。
8. Fasting blood glucose。
9. Fructosamine。
10. Fasting insulin。

增强基线包：

1. Validated body composition measurement。
2. OGTT / IVGTT。
3. TT4 或其他内分泌混杂因素检查。
4. Lipid panel。
5. Inflammatory / adipokine markers。

---

## 7. 实验设计

### 7.1 总体设计

本研究建议采用随机、平行对照、多剂量、探索性临床前药效设计。研究包括 screening、baseline、给药观察和 follow-up 四个阶段。

### 7.2 分组设计

| Arm | 处理 | 目的 | 当前状态 |
|---|---|---|---|
| G1 | Vehicle/placebo | 背景变化、饮食控制和操作影响 | 推荐 |
| G2 | Low dose | 初步药效信号和安全观察 | 剂量 TBD |
| G3 | High dose | 剂量反应趋势和耐受性观察 | 剂量 TBD |
| G4 | Optional diet-control or comparator | 研究灵敏度或解释性参照 | 可选 |

### 7.3 随机化和盲法

建议按 baseline body weight、BCS/body composition、糖代谢状态、性别/绝育状态和模型批次分层随机。终点评估人员应尽量保持盲态。若给药方式导致操作盲法不可行，应记录偏倚控制措施。

### 7.4 给药周期

给药观察期可将 8-12 周作为讨论窗口。这个窗口用于让体重、体成分、摄食和 fructosamine 等指标有足够观察时间；但最终周期必须由候选物机制、PK/PD、安全性、福利审查和 sponsor 目标共同决定。

---

## 8. 观察和评价

### 8.1 主要终点

1. 给药期末相对 baseline 的体重变化百分比。
2. 给药期末相对 baseline 的体脂或体成分变化，如果测量流程已验证。

若体成分设备、SOP 或评分训练不可确认，体成分应降级为探索终点或 `TBD after SOP/equipment review`。

### 8.2 关键次要终点

| 类别 | 指标 | 解释目的 |
|---|---|---|
| 摄食/行为 | 每日摄食量、剩食、饮水、活动、呕吐/腹泻 | 区分药效、食欲抑制和福利风险 |
| 体况 | BCS、MCS、体围、体成分 | 判断脂肪下降是否伴随肌肉损失 |
| 糖代谢 | Fasting glucose、fructosamine、insulin | 解释代谢改善方向 |
| 脂代谢 | Triglycerides、cholesterol 或其他 lipid panel | 支持代谢解释 |
| 安全性 | CBC、chemistry、urinalysis、胰腺/肝肾相关指标 | 福利和停药 gate |

### 8.3 机制/探索终点

| 终点 | 样本 | 目的 | 边界 |
|---|---|---|---|
| qPCR target expression | 相关组织 | 判断 target engagement | 不能单独证明药效 |
| Protein/pathway marker | 血液或组织 | 机制链支持 | 需 assay validation |
| Adipokine / inflammatory marker | 血液或组织 | 肥胖炎症/脂代谢解释 | 探索性 |
| CGM | 连续读数 | 糖代谢动态 | 设备适配和福利需确认 |
| OGTT / IVGTT | serial blood samples | 糖耐量和动态响应 | 操作负担和采血频率需福利审查 |

### 8.4 Schedule of Activities

| 阶段/时间点 | Screening | Baseline | Week 1 | Week 2 | Week 4 | Week 8 | Week 12 可选 | Follow-up |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 体检/福利评估 | X | X | X | X | X | X | X | X |
| 体重 | X | X | X | X | X | X | X | X |
| BCS/MCS | X | X |  | X | X | X | X | X |
| 摄食/饮水 |  | X | X | X | X | X | X | X |
| CBC/chemistry/UA | X | X |  | Conditional | X | X | X | Conditional |
| Fasting glucose | X | X |  | X | X | X | X | X |
| Fructosamine/insulin |  | X |  |  | X | X | X | X |
| Lipid panel |  | X |  |  | X | X | X | X |
| 体成分 |  | X |  |  | X | X | X | X |
| 给药 |  | X | X | X | X | X | X |  |
| PK/PD 采样 |  | Conditional | Conditional | Conditional | Conditional | Conditional | Conditional |  |
| AE/SAE |  | X | X | X | X | X | X | X |

---

## 9. 样本采集和检测链条

### 9.1 血液和尿液样本

1. Glucose：需固定采血时间、禁食状态和应激控制。
2. Fructosamine：用于近期平均糖代谢状态解释，需结合蛋白代谢和并发病判断。
3. Insulin：需固定空腹状态，解释时结合 glucose 和体况。
4. Chemistry / CBC / urinalysis：用于安全和健康状态判断。
5. Lipid panel：用于代谢改善解释。

### 9.2 组织和机制样本

组织采样必须先确认：

1. 候选物预期作用组织。
2. 是否需要终点安乐死或侵入性采样。
3. 是否有低侵入替代样本。
4. 采样是否改变伦理、福利和方案复杂度。

qPCR/target engagement 的最低质量要求：

1. 组织选择与机制相关。
2. RNA 质量有 QC 指标。
3. 引物/探针需 species-specific validation。
4. 内参基因需在肥胖/给药/组织条件下稳定。
5. ΔCt / ΔΔCt、fold change、outlier handling 规则预先定义。

---

## 10. 动物福利和伦理

### 10.1 日常监测

至少记录：

1. 精神状态、活动、grooming。
2. 摄食、饮水、呕吐、腹泻、便秘。
3. 体重变化速度。
4. 脱水、疼痛、黄疸。
5. 注射或给药部位反应。
6. 低血糖、高血糖、ketosis 或其他代谢异常风险。

### 10.2 Dose hold / withdrawal rules

| 触发 | 建议行动 |
|---|---|
| 持续厌食或显著摄食下降 | 暂停给药，兽医评估，必要时营养/补液支持 |
| 快速体重下降超过福利阈值 | 暂停给药或降剂量，重新评估 |
| 重复呕吐、腹泻或脱水 | 暂停给药，实验室复查 |
| 低血糖或异常糖代谢风险 | 立即复测并启动救援 |
| 肝肾、胰腺或血液学指标达到阈值 | 兽医评估，必要时退出 |

本研究的商业价值不能凌驾动物福利。如果体重下降主要来自严重厌食、不适或脱水，不应解释为理想药效。

---

## 11. 数据分析整理

### 11.1 分析集

1. Safety set：至少接受一次给药的动物。
2. Full analysis set：有 baseline 和至少一次 post-baseline 药效评估的动物。
3. Per-protocol set：无重大方案偏差并完成主要终点评估的动物。

### 11.2 分析方法

连续型主要终点建议使用 ANCOVA 或 mixed-effects model，baseline 值作为协变量。重复测量终点可纳入 time、treatment 和 time-by-treatment interaction。探索性研究应报告 effect size、置信区间和方向性趋势，不只依赖 p 值。

缺失值需按 welfare、technical、assay failure、withdrawal 和 other 分类。不应因结果方向删除异常值。技术异常必须有 assay/QC 依据。

### 11.3 数据整理输出

建议报告表包括：

1. Animal disposition。
2. Baseline comparability。
3. Efficacy endpoints。
4. Safety / welfare events。
5. Assay / QC summary。
6. Protocol deviation listing。
7. Statistical output。
8. Interpretation and limitation。

---

## 12. 主要风险和失败模式

| 风险 | 影响 | 缓解 |
|---|---|---|
| DIO 建模不稳定 | 入组失败或 baseline 差异大 | 内部模型 feasibility package 和 Study Director 审查 |
| 猫 target 活性不足 | 无药效信号 | sponsor package 和 species-fit gate |
| 食欲下降过强 | 难区分药效与不适 | 摄食、GI、MCS、安全和福利监测 |
| 单次血糖噪音 | 误判糖代谢改善 | repeated glucose + fructosamine + insulin / optional dynamic test |
| qPCR 样本质量差 | 机制结论不可用 | RNA QC、species-specific assay validation |
| 体重下降但肌肉流失 | 误判减脂 | BCS/MCS、体成分和摄食同步解释 |
| 样本量不足 | 阴性或不确定结果 | 统计样本量框架，不拍脑袋 |
| 过度承诺糖尿病治疗 | 科学和商务风险 | 明确本研究是肥胖/代谢改善探索 |

---

## 13. 大致时间安排

当前只能给出方案窗口，不能承诺执行 timeline。

| 阶段 | 讨论窗口 | 主要任务 |
|---|---|---|
| Screening | TBD | 动物来源、健康状态、模型和基础指标确认 |
| Baseline | 1-2 周讨论窗口 | 体重、摄食、BCS/MCS、糖代谢和安全实验室稳定性确认 |
| 给药观察 | 8-12 周讨论窗口 | 药效、安全、摄食、体重、糖代谢和机制读数 |
| Follow-up | 2-4 周可选 | 停药后体重、摄食和安全恢复观察 |
| 报告整理 | TBD | assay、数据清理、统计、QA/legal 审阅 |

---

## 14. Sponsor 追问问题

### 14.1 候选物和机制

1. 候选物类型是什么？GLP-1 RA、多肽、小分子、抗体还是其他？
2. 是否已有猫 target 活性、sequence homology、binding 或 functional assay 数据？
3. 预期主要作用组织是什么？
4. Intended claim 是体重管理、体脂改善、糖代谢改善、还是 diabetes treatment？

### 14.2 PK / 安全性

1. 是否已有猫 PK、暴露或耐受性数据？
2. 若只有非猫数据，哪些信息可用于猫 bridge 设计？
3. 已观察到哪些 GI、食欲、体重下降或代谢风险？
4. 给药 route、frequency 和 formulation 是否已确定？

### 14.3 研究设计

1. Sponsor 更关注药效信号、剂量探索还是机制验证？
2. 是否接受 8-12 周药效观察窗口？
3. 是否接受组织采样、CGM、OGTT/IVGTT 或 qPCR？
4. 是否有必须纳入或排除的终点？

---

## 15. Evidence Table

| Evidence | Source | How used | Boundary |
|---|---|---|---|
| 猫肥胖是多因素营养/代谢问题 | `feline-research-os/topics/obesity/mechanism-overview.md`; `src-obesity-001`, `src-obesity-004` | 背景、baseline 变量、日粮/环境控制 | 不证明内部模型可用 |
| 肥胖与胰岛素敏感性下降和糖代谢风险相关 | `feline-research-os/topics/obesity/diabetes-bridge-bilingual.md`; `src-obesity-008` | 支持糖代谢次要/探索终点 | 不支持糖尿病治疗 claim |
| 糖代谢 endpoint 需分层 | `feline-research-os/topics/diabetes/endpoint-handbook.md` | 区分 glycemic、body condition、safety、remission 等终点 | 不用于治疗排名 |
| Literature does not equal CRO feasibility | `knowledge-base-layer-bridge-2026-05-26.md`; `research-os-to-cro-memo-gap-map.md` | 防止把 Wiki 当 SOP/资源证据 | 内部执行需 Class B evidence |

---

## 16. Expert Review Checklist

| Reviewer | 必须回答的问题 |
|---|---|
| Veterinary endocrinology | 肥胖、at-risk diabetes、stable diabetes 边界是否准确？ |
| Nutrition / obesity | 体重、体脂、BCS/MCS、摄食和肌肉保护是否足够？ |
| Pharmacology / PK | 受试物、route、dose、frequency 边界是否保守？ |
| Study Director | DIO 模型、动物来源、采样和操作是否可行？ |
| Assay lead | glucose、fructosamine、insulin、lipid、qPCR/CGM 是否有 SOP/QC？ |
| Statistician | endpoint hierarchy、样本量、随机化、缺失值处理是否合理？ |
| Welfare reviewer | dose hold、withdrawal、rescue 和人道终点是否充分？ |
| QA/legal | 外发语言是否过度承诺？是否混淆 draft 与 execution-ready protocol？ |

---

## 17. Internal Materials Required Before External Use

| Gate | Required material | Missing 时的写法 |
|---|---|---|
| Sponsor package | modality、target、mechanism、intended claim、cat activity、PK/safety、route/formulation | `Sponsor information not provided` |
| DIO feasibility | DIO SOP、动物来源、cohort criteria、baseline phenotype、endpoint variance、welfare thresholds | `DIO is a candidate direction, pending feasibility evidence` |
| Assay chain | Blood sampling SOP、fructosamine/insulin assay、lipid panel、qPCR、RNA QC、CGM/OGTT feasibility | `Assay feasibility not available` |
| Statistics | primary endpoint、effect size、variance、sample size、randomization、missing-data rules | `Sample size requires statistician review` |
| Expert review | real reviewer、date、scope、permission、conclusion | `Role-based review only; real expert review pending` |

---

## 18. 结论

在当前只披露粗需求的条件下，可以生成一份相对完整、可供内部技术评审继续推进的实验方案草案。它的合理定位是：

```text
Early feline obesity / metabolic improvement efficacy and mechanism-readability study draft.
```

它不能被外发为 execution-ready protocol，也不能承诺动物数、剂量、模型资源、SOP、assay QC、timeline 或报价。

下一步不是继续扩写模板，而是补齐 sponsor package、内部模型和 assay feasibility、统计样本量、福利/Study Director/QA/legal 和真人专家审核。只有这些材料齐全后，才能把本 v1.4 草案升级为 execution candidate。
