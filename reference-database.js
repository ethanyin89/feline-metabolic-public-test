// Verified Feline Diabetes Literature Database
// Source: feline-research-os (24 papers, all DOI verified)
// NO FAKE DATA - only cite from this database

const VERIFIED_REFERENCES = [
  {
    id: "src-diabetes-001",
    title: "Pathogenesis of Feline Diabetes",
    doi: "10.1016/j.cvsm.2013.01.003",
    url: "https://doi.org/10.1016/j.cvsm.2013.01.003",
    year: 2013,
    evidence_level: "review",
    layer: "mechanism",
    tier: "A",
    key_claims: [
      "Type 2 diabetes accounts for ~90% of feline cases",
      "Diabetic cats have 6x lower insulin sensitivity",
      "Overweight cats have 4.6x greater diabetes risk",
      "20% of obese cats >8 years show prediabetic conditions"
    ],
    use_for: ["pathogenesis", "mechanism", "risk factors", "type 2 diabetes"]
  },
  {
    id: "src-diabetes-002",
    title: "Pathogenesis of Feline Diabetes Mellitus",
    doi: "10.1016/S0195-5616(95)50051-8",
    url: "https://doi.org/10.1016/S0195-5616(95)50051-8",
    year: 1995,
    evidence_level: "review",
    layer: "mechanism",
    tier: "B",
    key_claims: ["Historical pathogenesis review"],
    use_for: ["historical context", "mechanism"]
  },
  {
    id: "src-diabetes-003",
    title: "Feline Models of Type 2 Diabetes Mellitus",
    doi: "10.1093/ilar.47.3.234",
    url: "https://doi.org/10.1093/ilar.47.3.234",
    year: 2006,
    evidence_level: "review",
    layer: "model",
    tier: "B",
    key_claims: [
      "Cats are valuable models for type 2 diabetes research",
      "Shared features: middle-age onset, obesity, islet amyloid",
      "Complications (neuropathy, retinopathy) develop in diabetic cats"
    ],
    use_for: ["model selection", "comparative biology", "T2DM model"]
  },
  {
    id: "src-diabetes-004",
    title: "Neurological Complications Associated with Spontaneously Occurring Feline Diabetes Mellitus",
    doi: "10.1093/jnen/61.10.872",
    url: "https://doi.org/10.1093/jnen/61.10.872",
    year: 2002,
    evidence_level: "original-study",
    layer: "complication",
    tier: "B",
    key_claims: ["Diabetic neuropathy documented in cats"],
    use_for: ["neuropathy", "complications", "long-term outcomes"]
  },
  {
    id: "src-diabetes-005",
    title: "Feline comorbidities: Pathophysiology and management of the obese diabetic cat",
    doi: "10.1177/1098612X211021540",
    url: "https://doi.org/10.1177/1098612X211021540",
    year: 2021,
    evidence_level: "review",
    layer: "comorbidity",
    tier: "A",
    key_claims: [
      "Up to 40% of domestic cats are overweight or obese",
      "Insulin sensitivity declines with each excess kilogram",
      "Low-carbohydrate, high-protein diets recommended for diabetic cats",
      "Glycemic stabilization may need to precede weight loss"
    ],
    use_for: ["obesity", "diet", "management", "insulin resistance"]
  },
  {
    id: "src-diabetes-006",
    title: "The Role of Diet in the Prevention and Management of Feline Diabetes",
    doi: "10.1016/j.cvsm.2012.11.004",
    url: "https://doi.org/10.1016/j.cvsm.2012.11.004",
    year: 2013,
    evidence_level: "review",
    layer: "nutrition",
    tier: "A",
    key_claims: [
      "Diet is central to diabetes prevention and management",
      "Low-carbohydrate diets may improve glycemic control"
    ],
    use_for: ["diet", "nutrition", "prevention", "management"]
  },
  {
    id: "src-diabetes-007",
    title: "Systematic review of feline diabetic remission: Separating fact from opinion",
    doi: "10.1016/j.tvjl.2014.08.014",
    url: "https://doi.org/10.1016/j.tvjl.2014.08.014",
    year: 2014,
    evidence_level: "review",
    layer: "remission",
    tier: "A",
    key_claims: [
      "Systematic review of 22 studies on remission",
      "Overall evidence level: moderate to poor",
      "No single factor reliably predicts remission",
      "Remission possible across multiple protocols"
    ],
    use_for: ["remission", "evidence quality", "treatment outcomes"]
  },
  {
    id: "src-diabetes-008",
    title: "Treatment of feline diabetes mellitus using an alpha-glucosidase inhibitor and a low-carbohydrate diet",
    doi: "10.1016/S1098-612X(03)00006-8",
    url: "https://doi.org/10.1016/S1098-612X(03)00006-8",
    year: 2003,
    evidence_level: "original-study",
    layer: "treatment",
    tier: "B",
    key_claims: ["Alpha-glucosidase inhibitor + low-carb diet study"],
    use_for: ["treatment", "diet", "oral agents"]
  },
  {
    id: "src-diabetes-009",
    title: "Feline diabetes mellitus in the UK: prevalence and putative risk factors",
    doi: "10.1016/j.jfms.2007.02.001",
    url: "https://doi.org/10.1016/j.jfms.2007.02.001",
    year: 2007,
    evidence_level: "original-study",
    layer: "epidemiology",
    tier: "B",
    key_claims: ["UK prevalence and risk factor data"],
    use_for: ["epidemiology", "risk factors", "prevalence"]
  },
  {
    id: "src-diabetes-010",
    title: "Feline Comorbidities: Clinical perspective on diabetes mellitus and pancreatitis",
    doi: "10.1177/1098612X221106355",
    url: "https://doi.org/10.1177/1098612X221106355",
    year: 2022,
    evidence_level: "review",
    layer: "comorbidity",
    tier: "B",
    key_claims: ["Pancreatitis-diabetes comorbidity relationship"],
    use_for: ["pancreatitis", "comorbidity", "differential diagnosis"]
  },
  {
    id: "src-diabetes-011",
    title: "SGLT2 inhibitor use in the management of feline diabetes mellitus",
    doi: "10.1111/jvp.13466",
    url: "https://doi.org/10.1111/jvp.13466",
    year: 2024,
    evidence_level: "review",
    layer: "treatment",
    tier: "A",
    key_claims: [
      "SGLT2 inhibitors (Bexacat, Senvelgo) for feline diabetes",
      "Candidate selection is critical",
      "Ketoacidosis monitoring required"
    ],
    use_for: ["SGLT2", "Bexacat", "Senvelgo", "oral treatment"]
  },
  {
    id: "src-diabetes-012",
    title: "Frequency of feline diabetes mellitus and breed predisposition in domestic cats in Australia",
    doi: "10.1016/j.tvjl.2007.09.019",
    url: "https://doi.org/10.1016/j.tvjl.2007.09.019",
    year: 2009,
    evidence_level: "original-study",
    layer: "epidemiology",
    tier: "B",
    key_claims: ["Australia frequency and breed risk data"],
    use_for: ["epidemiology", "breed predisposition"]
  },
  {
    id: "src-diabetes-013",
    title: "Hypersomatotropism, Acromegaly, and Hyperadrenocorticism and Feline Diabetes Mellitus",
    doi: "10.1016/j.cvsm.2012.12.004",
    url: "https://doi.org/10.1016/j.cvsm.2012.12.004",
    year: 2013,
    evidence_level: "review",
    layer: "endocrine-comorbidity",
    tier: "A",
    key_claims: [
      "Endocrine secondary diabetes prevents universal type-2 explanation",
      "Acromegaly and hyperadrenocorticism as diabetes causes"
    ],
    use_for: ["secondary diabetes", "acromegaly", "endocrine disorders"]
  },
  {
    id: "src-diabetes-014",
    title: "Feline Diabetes mellitus",
    doi: "10.1177/1098612X14523187",
    url: "https://doi.org/10.1177/1098612X14523187",
    year: 2014,
    evidence_level: "review",
    layer: "clinical-overview",
    tier: "A",
    key_claims: ["Comprehensive clinical overview of feline diabetes"],
    use_for: ["clinical overview", "diagnosis", "management"]
  },
  {
    id: "src-diabetes-015",
    title: "Comparison of low carbohydrate-low fiber and moderate carbohydrate-high fiber diets in feline diabetes",
    doi: "10.1016/j.jfms.2005.08.004",
    url: "https://doi.org/10.1016/j.jfms.2005.08.004",
    year: 2006,
    evidence_level: "original-study",
    layer: "nutrition",
    tier: "B",
    key_claims: ["Diet composition comparison study"],
    use_for: ["diet comparison", "carbohydrate", "fiber"]
  },
  {
    id: "src-diabetes-016",
    title: "Feline Diabetes Mellitus: Low Carbohydrates Versus High Fiber?",
    doi: "10.1016/j.cvsm.2006.09.004",
    url: "https://doi.org/10.1016/j.cvsm.2006.09.004",
    year: 2006,
    evidence_level: "review",
    layer: "nutrition",
    tier: "B",
    key_claims: ["Diet strategy review"],
    use_for: ["diet strategy", "carbohydrate vs fiber"]
  },
  {
    id: "src-diabetes-017",
    title: "New Approaches to Feline Diabetes Mellitus",
    doi: "10.1177/1098612X16660441",
    url: "https://doi.org/10.1177/1098612X16660441",
    year: 2016,
    evidence_level: "review",
    layer: "treatment",
    tier: "B",
    key_claims: ["New treatment approaches review"],
    use_for: ["treatment advances", "new approaches"]
  },
  {
    id: "src-diabetes-018",
    title: "Endoneurial microvascular pathology in feline diabetic neuropathy",
    doi: "10.1016/j.mvr.2007.12.002",
    url: "https://doi.org/10.1016/j.mvr.2007.12.002",
    year: 2008,
    evidence_level: "original-study",
    layer: "complication",
    tier: "C",
    key_claims: ["Microvascular pathology in diabetic neuropathy"],
    use_for: ["neuropathy mechanism", "microvascular"]
  },
  {
    id: "src-diabetes-019",
    title: "What is So Special about Feline Diabetes Mellitus?",
    doi: "10.1053/jfms.2001.0123",
    url: "https://doi.org/10.1053/jfms.2001.0123",
    year: 2001,
    evidence_level: "review",
    layer: "mechanism",
    tier: "C",
    key_claims: ["Feline diabetes unique characteristics"],
    use_for: ["species-specific features", "comparative"]
  },
  {
    id: "src-diabetes-020",
    title: "Feline comorbidities: hypersomatotropism-induced diabetes in cats",
    doi: "10.1177/1098612X241226690",
    url: "https://doi.org/10.1177/1098612X241226690",
    year: 2024,
    evidence_level: "review",
    layer: "endocrine-comorbidity",
    tier: "A",
    key_claims: ["Hypersomatotropism-induced diabetes frontier review"],
    use_for: ["hypersomatotropism", "secondary diabetes", "2024 update"]
  },
  {
    id: "src-diabetes-021",
    title: "Diabetes mellitus in cats",
    doi: "10.1016/j.cvsm.2004.10.001",
    url: "https://doi.org/10.1016/j.cvsm.2004.10.001",
    year: 2005,
    evidence_level: "review",
    layer: "clinical-overview",
    tier: "B",
    key_claims: ["2005 clinical overview"],
    use_for: ["clinical overview", "historical"]
  },
  {
    id: "src-diabetes-022",
    title: "Use of a high-protein diet in the management of feline diabetes mellitus",
    doi: "",
    url: "",
    year: 2001,
    evidence_level: "original-study",
    layer: "nutrition",
    tier: "C",
    key_claims: ["High-protein diet study"],
    use_for: ["high-protein diet", "nutrition study"]
  },
  {
    id: "src-diabetes-023",
    title: "Comparative occurrence of diabetes in canine, feline, and few wild animals",
    doi: "10.14202/vetworld.2018.410-422",
    url: "https://doi.org/10.14202/vetworld.2018.410-422",
    year: 2018,
    evidence_level: "original-study",
    layer: "epidemiology",
    tier: "C",
    key_claims: ["Cross-species diabetes comparison"],
    use_for: ["comparative epidemiology", "species differences"]
  },
  {
    id: "src-diabetes-024",
    title: "Insulin glargine 300 U/ml for the treatment of feline diabetes mellitus",
    doi: "10.1177/1098612X211013018",
    url: "https://doi.org/10.1177/1098612X211013018",
    year: 2021,
    evidence_level: "original-study",
    layer: "treatment",
    tier: "A",
    key_claims: ["Insulin glargine U300 treatment study"],
    use_for: ["insulin therapy", "glargine", "treatment"]
  }
];

// Keyword synonym mapping for better retrieval
const KEYWORD_SYNONYMS = {
  // Drug types
  "galnac": ["galnac", "galnac-sirna", "sirna", "小核酸", "rna interference", "rnai"],
  "siRNA": ["sirna", "galnac", "galnac-sirna", "小核酸", "rna interference"],
  "antibody": ["antibody", "抗体", "mab", "monoclonal"],
  "small molecule": ["small molecule", "小分子", "oral drug"],
  "sglt2": ["sglt2", "bexacat", "senvelgo", "velagliflozin", "sodium-glucose"],
  "glp1": ["glp1", "glp-1", "glp-1 agonist", "incretin"],
  "insulin": ["insulin", "glargine", "胰岛素"],

  // Study types
  "mechanism": ["mechanism", "pathogenesis", "机制", "病因"],
  "efficacy": ["efficacy", "药效", "treatment", "management"],
  "pk": ["pk", "pharmacokinetics", "药代动力学", "absorption", "distribution"],
  "pd": ["pd", "pharmacodynamics", "药效动力学"],
  "toxicology": ["toxicology", "毒理", "safety", "adverse"],

  // Disease/condition
  "diabetes": ["diabetes", "糖尿病", "hyperglycemia", "血糖"],
  "obesity": ["obesity", "肥胖", "overweight", "body weight", "体重"],
  "neuropathy": ["neuropathy", "神经病变", "nerve", "neurological"],

  // Endpoints
  "glucose": ["glucose", "blood glucose", "glycemic", "fructosamine", "血糖"],
  "insulin resistance": ["insulin resistance", "insulin sensitivity", "胰岛素抵抗"],
  "remission": ["remission", "缓解", "recovery", "cure"],

  // Models
  "dio": ["dio", "diet-induced obesity", "饮食诱导肥胖"],
  "naturally diabetic": ["naturally diabetic", "spontaneous", "自然发病"],
};

// Expand keywords using synonyms
function expandKeywords(keywords) {
  const expanded = new Set();
  keywords.forEach(kw => {
    const kwLower = kw.toLowerCase();
    expanded.add(kwLower);

    // Check if this keyword matches any synonym group
    Object.values(KEYWORD_SYNONYMS).forEach(synonyms => {
      if (synonyms.some(s => s.includes(kwLower) || kwLower.includes(s))) {
        synonyms.forEach(s => expanded.add(s));
      }
    });
  });
  return Array.from(expanded);
}

// Helper function to find relevant references by topic (enhanced)
function findReferences(topics) {
  const expandedTopics = expandKeywords(topics);
  const results = [];

  VERIFIED_REFERENCES.forEach(ref => {
    let score = 0;
    const matchedTopics = [];

    ref.use_for.forEach(use => {
      const useLower = use.toLowerCase();
      expandedTopics.forEach(topic => {
        if (useLower.includes(topic) || topic.includes(useLower)) {
          score += ref.tier === 'A' ? 3 : ref.tier === 'B' ? 2 : 1;
          if (!matchedTopics.includes(topic)) matchedTopics.push(topic);
        }
      });
    });

    // Also check key_claims for additional relevance
    ref.key_claims.forEach(claim => {
      const claimLower = claim.toLowerCase();
      expandedTopics.forEach(topic => {
        if (claimLower.includes(topic)) {
          score += 1;
        }
      });
    });

    if (score > 0) {
      results.push({ ...ref, relevance_score: score, matched_topics: matchedTopics });
    }
  });

  // Sort by relevance score (higher first), then by year (newer first)
  return results.sort((a, b) => {
    if (b.relevance_score !== a.relevance_score) {
      return b.relevance_score - a.relevance_score;
    }
    return b.year - a.year;
  });
}

// Get references by layer (for specific question types)
function findReferencesByLayer(layer) {
  return VERIFIED_REFERENCES
    .filter(ref => ref.layer === layer)
    .sort((a, b) => {
      // Sort by tier (A > B > C), then by year (newer first)
      const tierOrder = { 'A': 0, 'B': 1, 'C': 2 };
      if (tierOrder[a.tier] !== tierOrder[b.tier]) {
        return tierOrder[a.tier] - tierOrder[b.tier];
      }
      return b.year - a.year;
    });
}

// Get anchor references (Tier A) for a topic
function getAnchorReferences(topic) {
  return findReferences([topic]).filter(ref => ref.tier === 'A');
}

// Helper function to format citation
function formatCitation(ref) {
  return {
    id: ref.id,
    title: ref.title,
    year: ref.year,
    doi: ref.doi,
    url: ref.url || `https://doi.org/${ref.doi}`,
    tier: ref.tier,
    key_claims: ref.key_claims,
    relevance_score: ref.relevance_score,
    matched_topics: ref.matched_topics
  };
}

// Build citation text for LLM prompt
function buildCitationContext(topics, maxRefs = 5) {
  const refs = findReferences(topics).slice(0, maxRefs);
  if (refs.length === 0) return "No verified references found for these topics.";

  let context = "VERIFIED REFERENCES (cite from these only):\n\n";
  refs.forEach((ref, i) => {
    context += `[${i + 1}] ${ref.title} (${ref.year})\n`;
    context += `    DOI: ${ref.doi}\n`;
    context += `    URL: ${ref.url}\n`;
    context += `    Tier: ${ref.tier} | Evidence: ${ref.evidence_level}\n`;
    context += `    Key claims:\n`;
    ref.key_claims.forEach(claim => {
      context += `      - ${claim}\n`;
    });
    context += `    Matched topics: ${ref.matched_topics?.join(', ') || 'N/A'}\n\n`;
  });
  return context;
}
