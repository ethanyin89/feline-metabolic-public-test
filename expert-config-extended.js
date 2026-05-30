/**
 * Extended Expert Pool Configuration
 *
 * Predefined expert pool for the Expert-Driven Protocol Generator.
 * MVP: metabolism domain only.
 *
 * Each expert has:
 * - id: Unique identifier
 * - name: Display name
 * - specialty: Array of specialties (for matching)
 * - region: "CN" (domestic) or "INTL" (international)
 * - credentials: Professional credentials
 * - promptRole: Role prompt for LLM
 * - focus: Key focus areas
 */

const EXPERT_POOL = {
  metabolism: {
    name: "代谢/营养领域",
    description: "肥胖、糖尿病、GLP-1、营养干预相关研究",
    keywords: ["GLP-1", "肥胖", "减重", "糖尿病", "代谢", "营养", "胰岛素", "血糖", "DIO"],
    experts: [
      // International experts
      {
        id: "lisa-freeman",
        name: "Lisa Freeman",
        fullName: "Lisa Freeman, DVM PhD DACVIM(Nutrition)",
        specialty: ["兽医营养学", "肥胖管理", "体重控制"],
        region: "INTL",
        credentials: "塔夫茨大学卡明斯兽医学院营养学教授",
        promptRole: "You are Lisa Freeman, a veterinary nutritionist specializing in companion animal obesity and metabolic disorders. You have extensive experience in diet-induced obesity models and nutritional interventions.",
        focus: [
          "饮食成分对代谢指标的影响",
          "营养干预设计",
          "体重管理方案",
          "DIO模型饮食配方"
        ]
      },
      {
        id: "margarethe-hoenig",
        name: "Margarethe Hoenig",
        fullName: "Margarethe Hoenig, Dr.med.vet. PhD",
        specialty: ["猫糖尿病", "胰岛素抵抗", "内分泌学"],
        region: "INTL",
        credentials: "伊利诺伊大学兽医学院内分泌学教授",
        promptRole: "You are Margarethe Hoenig, a veterinary endocrinologist specializing in feline diabetes and insulin resistance. You have published extensively on the pathophysiology of feline obesity and its progression to diabetes.",
        focus: [
          "猫胰岛素抵抗机制",
          "肥胖-糖尿病进展",
          "血糖稳态调控",
          "糖尿病动物模型"
        ]
      },
      {
        id: "translational-advisor",
        name: "转化药效顾问",
        fullName: "Translational Pharmacology Advisor",
        specialty: ["跨物种药理学", "临床转化", "PK/PD"],
        region: "INTL",
        credentials: "跨物种药理学与临床转化专家",
        promptRole: "You are a translational pharmacology consultant specializing in cross-species drug development and PK/PD modeling. Focus on bridging preclinical findings to clinical applications.",
        focus: [
          "单次给药PK和组织分布",
          "跨物种剂量转换",
          "临床转化路径设计",
          "药效学时间窗评估"
        ]
      },
      // Domestic experts (CN)
      {
        id: "xia-zhaofei",
        name: "夏兆飞",
        fullName: "夏兆飞｜中国农业大学动物医学院",
        specialty: ["猫代谢病", "临床前药效", "GLP-1", "营养学"],
        region: "CN",
        credentials: "中国兽医协会兽医临床营养（小动物）专科委员会主任委员",
        promptRole: "你是夏兆飞教授，中国农业大学动物医学院，专注于宠物临床营养、肥胖模型构建和营养干预研究。你在猫代谢疾病和临床前药效评价方面有丰富经验。",
        focus: [
          "DIO饮食诱导肥胖模型分类与边界界定",
          "BCS/MCS评估标准",
          "营养干预与宠物食品评价",
          "肥胖-糖尿病转化节点判定"
        ]
      },
      {
        id: "wang-jiangwei",
        name: "王姜维",
        fullName: "王姜维｜上海蓝石宠物医院",
        specialty: ["内分泌诊断", "糖尿病", "实验室诊断"],
        region: "CN",
        credentials: "中国兽医协会小动物相关专科医师，内分泌与代谢疾病专家",
        promptRole: "你是王姜维医生，上海蓝石宠物医院，专注于小动物内分泌疾病诊断与实验室指标解读。",
        focus: [
          "糖尿病模型诊断边界",
          "血糖/果糖胺/胰岛素指标解读",
          "从肥胖到糖尿病的状态判定",
          "内分泌疾病鉴别诊断"
        ]
      },
      {
        id: "chen-jie",
        name: "陈杰",
        fullName: "陈杰｜瑞鹏宠物医院",
        specialty: ["小动物临床", "内科学", "药效评价"],
        region: "CN",
        credentials: "瑞鹏宠物医院高级兽医师",
        promptRole: "你是陈杰医生，瑞鹏宠物医院高级兽医师，专注于小动物内科疾病的临床诊断与治疗。",
        focus: [
          "临床症状观察与记录",
          "体征评估方法",
          "药效临床评价标准",
          "不良反应监测"
        ]
      }
    ]
  }
};

/**
 * Get experts by domain
 */
function getExpertsByDomain(domain) {
  return EXPERT_POOL[domain]?.experts || [];
}

/**
 * Get expert by ID (across all domains)
 */
function getExpertById(id) {
  for (const domain of Object.values(EXPERT_POOL)) {
    const expert = domain.experts?.find(e => e.id === id);
    if (expert) return expert;
  }
  return null;
}

/**
 * Match domain by keywords in query
 */
function matchDomain(query) {
  for (const [domainKey, domain] of Object.entries(EXPERT_POOL)) {
    for (const keyword of domain.keywords) {
      if (query.includes(keyword)) {
        return domainKey;
      }
    }
  }
  return 'metabolism'; // Default
}

/**
 * Select experts for a given query
 * Returns 2-3 experts (mix of INTL and CN)
 */
function selectExperts(query) {
  const domain = matchDomain(query);
  const experts = getExpertsByDomain(domain);

  if (experts.length === 0) return [];

  // Select 1-2 INTL + 1-2 CN experts
  const intl = experts.filter(e => e.region === 'INTL');
  const cn = experts.filter(e => e.region === 'CN');

  const selected = [];

  // Add international experts (up to 2)
  selected.push(...intl.slice(0, 2));

  // Add domestic experts (up to 2)
  selected.push(...cn.slice(0, 2));

  return selected;
}

/**
 * Build expert selection prompt
 */
function buildExpertSelectionPrompt(query) {
  const experts = selectExperts(query);

  let prompt = `## 专家团队\n\n`;

  const intlExperts = experts.filter(e => e.region === 'INTL');
  const cnExperts = experts.filter(e => e.region === 'CN');

  if (intlExperts.length > 0) {
    prompt += `### 国际专家\n`;
    for (const e of intlExperts) {
      prompt += `- **${e.fullName}**\n`;
      prompt += `  专长: ${e.specialty.join('、')}\n`;
      prompt += `  关注点: ${e.focus.join('、')}\n\n`;
    }
  }

  if (cnExperts.length > 0) {
    prompt += `### 国内专家（交叉验证）\n`;
    for (const e of cnExperts) {
      prompt += `- **${e.fullName}**\n`;
      prompt += `  专长: ${e.specialty.join('、')}\n`;
      prompt += `  关注点: ${e.focus.join('、')}\n\n`;
    }
  }

  return prompt;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EXPERT_POOL,
    getExpertsByDomain,
    getExpertById,
    matchDomain,
    selectExperts,
    buildExpertSelectionPrompt
  };
}
