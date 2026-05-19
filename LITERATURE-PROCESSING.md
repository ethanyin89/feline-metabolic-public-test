# Literature Processing Guide for Feline Diabetes CRO AI

## Overview

This document describes how to process veterinary literature for use in the CRO Study Design tool, following the Karpathy LLM wiki standards.

## Current Status

**24 papers processed** from feline-research-os, stored in:
- Source markdown: `/feline-research-os/raw/papers/src-diabetes-*.md`
- JavaScript database: `./reference-database.js`

## Karpathy LLM Wiki Format

### Source File Structure

Each paper should be processed into a markdown file with:

```markdown
---
id: src-diabetes-XXX
type: source
title: "Paper Title"
source_kind: paper
species: feline
diseases: [diabetes mellitus]
models: []
endpoints: [insulin sensitivity, blood glucose]
jurisdictions: []
evidence_level: review | original-study | meta-analysis
year: 2024
status: deep_extracted
extraction_depth: full
verification_status: deep_extracted
tags: [diabetes, mechanism, treatment]
links:
  doi: "10.xxxx/xxx"
  url: "https://doi.org/10.xxxx/xxx"
evidence_policy:
  quoted_fact:
    - "Direct quote from paper"
  source_supported_conclusion:
    - "Interpretation supported by source"
  llm_inference:
    - "Safe inference LLM can make"
---

# Paper Title

## One-Line Summary

Brief summary of the paper's main contribution.

## Why It Matters For Feline Diabetes

- Key point 1
- Key point 2

## Key Findings

### quoted_fact
- Direct quotes

### source_supported_conclusion
- Interpretations

### llm_inference
- Inferences

## Limits / Caveats

- What this source does NOT support

## Linked Entities

- diseases: diabetes mellitus
- models:
- endpoints:
- mechanisms:
```

### Evidence Policy Rules

**Three-tier evidence system** (critical for preventing hallucination):

1. **quoted_fact**: Direct quotes from the paper. LLM can cite verbatim.
2. **source_supported_conclusion**: Interpretations the author makes or that logically follow. LLM can reference with "this study suggests..."
3. **llm_inference**: Reasonable inferences based on the source. LLM should flag as inference, not fact.

## Reference Database Format

For the web application, papers are stored in `reference-database.js`:

```javascript
{
  id: "src-diabetes-XXX",
  title: "Paper Title",
  doi: "10.xxxx/xxx",
  url: "https://doi.org/10.xxxx/xxx",
  year: 2024,
  evidence_level: "review",
  layer: "treatment",  // mechanism, treatment, epidemiology, etc.
  tier: "A",  // A = high quality, B = moderate, C = supporting
  key_claims: [
    "Direct quote or key claim from paper"
  ],
  use_for: ["topic1", "topic2", "keyword"]  // enables automatic retrieval
}
```

### Layer Categories

- `mechanism`: pathogenesis, disease biology
- `treatment`: insulin, SGLT2, oral agents
- `nutrition`: diet, protein, carbohydrate
- `epidemiology`: prevalence, risk factors
- `complication`: neuropathy, retinopathy
- `remission`: recovery, cure potential
- `endocrine-comorbidity`: acromegaly, hyperadrenocorticism
- `clinical-overview`: general reviews
- `model`: animal models, translational

### Tier Classification

- **Tier A**: High-quality reviews, guidelines, definitive studies (cite first)
- **Tier B**: Good original studies, focused reviews (cite for support)
- **Tier C**: Older studies, limited scope, historical context

## Automatic Reference Retrieval

The `use_for` field enables topic-based retrieval. When processing a sponsor request:

1. Extract keywords from the request
2. Match against `use_for` arrays
3. Retrieve relevant references
4. Prioritize by tier (A > B > C)

### Example

Request: "GalNAc siRNA targeting liver for obesity management"

Keyword extraction:
- "obesity" → matches src-diabetes-005 (use_for: ["obesity", "diet", "management"])
- "liver" → no direct match (flag for expansion)
- "management" → matches src-diabetes-005, src-diabetes-006

## Adding New Literature

### Step 1: Verify DOI
```bash
# Check DOI resolves
curl -I "https://doi.org/10.xxxx/xxx"
```

### Step 2: Extract Metadata
- Title, authors, year, journal
- Abstract
- Key findings

### Step 3: Create Source Markdown
Follow the template above, with careful attention to:
- `evidence_policy` tiers
- Accurate `tags` and `linked entities`

### Step 4: Add to Reference Database
Add entry to `reference-database.js` with:
- Verified DOI and URL
- Appropriate `layer` and `tier`
- Comprehensive `use_for` keywords

### Step 5: Verify Integration
Test that the new reference appears in relevant query results.

## NO FAKE DATA RULE

**Critical**: Only cite from verified sources. Never:
- Generate fictional citations
- Guess DOIs
- Fabricate paper titles
- Invent statistics

If information is needed but not in the database, flag it as a gap requiring additional literature review.

## Future Enhancements

1. **RAG integration**: Vector embeddings of full paper text
2. **Automatic extraction**: LLM-assisted evidence policy extraction
3. **Cross-reference validation**: Check citation chains
4. **Keyword expansion**: Synonym mapping for better retrieval
