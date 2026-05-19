/**
 * Expert Panel Configuration
 *
 * Defines international and domestic expert panels for feline metabolic disease studies.
 * This configuration is designed to be reusable across different intake tools.
 */

const EXPERT_PANELS = {
  international: [
    {
      id: "nutrition_intl",
      role: "营养/代谢专家",
      name: "Lisa Freeman, DVM PhD DACVIM(Nutrition)",
      credentials: "塔夫茨大学卡明斯兽医学院营养学教授",
      focus: [
        "饮食成分对代谢指标的影响",
        "营养干预设计",
        "体重管理方案",
        "宠物食品配方评价"
      ],
      color: "green",
      icon: "🥗",
      promptRole: "You are Lisa Freeman, a veterinary nutritionist specializing in companion animal obesity and metabolic disorders."
    },
    {
      id: "endocrine_intl",
      role: "内分泌专家",
      name: "Stijn Niessen, DVM PhD DECVIM-CA",
      credentials: "皇家兽医学院内分泌学高级讲师",
      focus: [
        "靶基因在内分泌器官的表达和调控",
        "糖尿病诊断边界与分型",
        "胰岛素抵抗机制",
        "猫糖尿病缓解标准"
      ],
      color: "purple",
      icon: "🔬",
      promptRole: "You are Stijn Niessen, a veterinary internist and endocrinologist specializing in feline diabetes and acromegaly."
    },
    {
      id: "translational_intl",
      role: "转化药效专家",
      name: "转化药效顾问",
      credentials: "跨物种药理学与临床转化",
      focus: [
        "单次给药PK和组织分布",
        "跨物种剂量转换",
        "临床转化路径设计",
        "药效学时间窗评估"
      ],
      color: "blue",
      icon: "💊",
      promptRole: "You are a translational pharmacology consultant specializing in cross-species drug development and PK/PD modeling."
    }
  ],
  domestic: [
    {
      id: "framework_cn",
      role: "总框架/营养肥胖专家",
      name: "夏兆飞｜中国农业大学动物医学院",
      credentials: "中国兽医协会兽医临床营养（小动物）专科委员会主任委员",
      focus: [
        "DIO饮食诱导肥胖模型分类与边界界定",
        "BCS/MCS评估标准",
        "营养干预与宠物食品评价",
        "肥胖-糖尿病转化节点判定"
      ],
      color: "red",
      icon: "🎯",
      promptRole: "你是夏兆飞教授，中国农业大学动物医学院，专注于宠物临床营养、肥胖模型构建和营养干预研究。"
    },
    {
      id: "endocrine_cn",
      role: "内分泌/实验室诊断专家",
      name: "王姜维｜上海蓝石宠物医院",
      credentials: "中国兽医协会小动物相关专科医师，内分泌与代谢疾病专家",
      focus: [
        "糖尿病模型诊断边界",
        "血糖/果糖胺/胰岛素指标解读",
        "从肥胖到糖尿病的状态判定",
        "内分泌疾病鉴别诊断"
      ],
      color: "orange",
      icon: "🧪",
      promptRole: "你是王姜维医生，上海蓝石宠物医院，专注于小动物内分泌疾病诊断与实验室指标解读。"
    },
    {
      id: "galnac_cn",
      role: "GalNAc/siRNA转化药理专家",
      name: "梁子才｜瑞博生物创始人、董事长兼CEO",
      credentials: "中国小核酸制药产业开拓者，RiboGalSTAR™技术发明人",
      focus: [
        "GalNAc递送与肝靶向机制",
        "靶基因KD验证设计",
        "PD时间窗与给药间隔设计",
        "从靶点到表型的机制链构建"
      ],
      color: "cyan",
      icon: "🧬",
      promptRole: "你是梁子才博士，瑞博生物创始人，专注于GalNAc-siRNA药物开发与小核酸递送技术。"
    }
  ]
};

/**
 * Get all experts flattened into a single array
 */
function getAllExperts() {
  return [...EXPERT_PANELS.international, ...EXPERT_PANELS.domestic];
}

/**
 * Get expert by ID
 */
function getExpertById(id) {
  return getAllExperts().find(e => e.id === id);
}

/**
 * Get experts by panel type
 */
function getExpertsByPanel(panel) {
  return EXPERT_PANELS[panel] || [];
}

/**
 * Build expert prompt context for AI
 */
function buildExpertPromptContext() {
  const intlExperts = EXPERT_PANELS.international.map(e =>
    `- ${e.name} (${e.role}): ${e.focus.join('、')}`
  ).join('\n');

  const cnExperts = EXPERT_PANELS.domestic.map(e =>
    `- ${e.name} (${e.role}): ${e.focus.join('、')}`
  ).join('\n');

  return `
## 专家团队

### 国际专家
${intlExperts}

### 国内专家（交叉验证）
${cnExperts}

## 专家视角独立性要求
- 国际专家和国内专家分别给出独立建议
- 每位专家只基于自己的专业领域判断
- 不同专家的建议可以有分歧，这是正常的交叉验证
- 不要让一个专家的观点影响另一个专家
- 国内专家应结合中国实际情况给出建议
`;
}

// Export for use in other modules (if using module system)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EXPERT_PANELS, getAllExperts, getExpertById, getExpertsByPanel, buildExpertPromptContext };
}
