// Vercel Serverless Function: AI Market Research via Gemini
// Endpoint: /api/ai-research

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface ResearchRequest {
  query: string
}

interface ResearchResponse {
  success: boolean
  data: {
    query: string
    analysis: string
    marketSize?: string
    competitors?: string[]
    opportunities?: string[]
    risks?: string[]
    recommendations?: string[]
  }
  model: string
  timestamp: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' })
  }

  const { query } = req.body as ResearchRequest

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: 'Query is required' })
  }

  try {
    const prompt = `You are a world-class startup market research analyst with access to comprehensive market data. Conduct DEEP, THOROUGH research on the following query. This is NOT surface-level analysis - provide the depth of a $50,000 consulting report.

Query: "${query}"

## RESEARCH METHODOLOGY
Think step-by-step. First identify what industry this falls under, then analyze each aspect comprehensively. Use specific numbers, cite realistic market data, and provide actionable insights.

Provide your analysis in this detailed format:

## Executive Summary
[3-4 sentences capturing the key opportunity, main challenge, and verdict]

## Market Deep Dive

### Total Addressable Market (TAM)
- **Global market size:** [specific number with year, e.g., "$47.2B in 2024"]
- **Calculation methodology:** [explain how you arrived at this - top-down or bottom-up]
- **Primary market segments:** [break down by segment with percentages]

### Serviceable Available Market (SAM)
- **Regional focus:** [specific markets and their sizes]
- **Target segment value:** [realistic number]
- **Penetration assumptions:** [what % of TAM is actually serviceable]

### Serviceable Obtainable Market (SOM)
- **Year 1 realistic target:** [specific number]
- **Year 3 target:** [growth projection]
- **Market share assumption:** [realistic % for new entrant]

### Market Growth Analysis
- **Historical CAGR (2019-2024):** [percentage]
- **Projected CAGR (2024-2030):** [percentage]
- **Key inflection points:** [what events could accelerate/decelerate growth]

## Competitive Intelligence

### Tier 1 Competitors (Market Leaders)
For each competitor, provide:
| Competitor | Est. Revenue | Market Share | Key Strength | Key Weakness | Pricing |
|------------|--------------|--------------|--------------|--------------|---------|
[Fill with 3-4 major players]

### Tier 2 Competitors (Emerging/Niche)
[3-4 smaller players or startups to watch]

### Competitive Moat Analysis
- **Barriers to entry:** [High/Medium/Low with explanation]
- **Switching costs:** [for customers]
- **Network effects potential:** [if applicable]
- **Defensibility strategies:** [what can protect market position]

## Customer Analysis

### Primary Customer Persona
- **Title/Role:** [specific job title]
- **Company size:** [employee count/revenue]
- **Pain intensity:** [1-10 scale with justification]
- **Budget authority:** [typical budget range]
- **Buying cycle:** [days/weeks/months]

### Secondary Customer Persona
[Same format]

### Customer Acquisition
- **Primary channels:** [ranked by effectiveness]
- **Estimated CAC by channel:** [specific ranges]
- **Time to first customer:** [realistic timeline]

## Financial Analysis

### Unit Economics Model
- **Average Contract Value (ACV):** [range]
- **Customer Acquisition Cost (CAC):** [range with channel breakdown]
- **Lifetime Value (LTV):** [calculation with assumptions]
- **LTV:CAC Ratio:** [target and benchmark]
- **Payback Period:** [months]
- **Gross Margin:** [percentage]

### Funding Landscape
- **Recent funding rounds in space:** [2-3 examples with amounts]
- **Active investors:** [VCs investing in this category]
- **Typical seed round:** [range for this market]
- **Path to profitability:** [bootstrappable or requires funding]

## Risk Assessment

### Critical Risks (could kill the business)
1. **[Risk name]:** [Description] | **Mitigation:** [Strategy]
2. **[Risk name]:** [Description] | **Mitigation:** [Strategy]

### Moderate Risks (significant but manageable)
1. **[Risk name]:** [Description] | **Mitigation:** [Strategy]
2. **[Risk name]:** [Description] | **Mitigation:** [Strategy]

### Market Timing
- **Why now?** [What's changed that makes this timely]
- **Window of opportunity:** [How long before market matures]

## Strategic Recommendations

### Go-to-Market Strategy
1. **Beachhead market:** [Specific niche to start]
2. **Initial positioning:** [One-sentence positioning statement]
3. **First 100 customers:** [Specific acquisition strategy]
4. **Pricing strategy:** [Recommended model with reasoning]

### Differentiation Playbook
- **Positioning against leaders:** [How to compete without competing head-on]
- **Unique value proposition:** [What can you own that others can't]
- **Feature priorities for MVP:** [Top 3-5 features]

### 90-Day Action Plan
- **Days 1-30:** [Validation activities]
- **Days 31-60:** [MVP development]
- **Days 61-90:** [Launch activities]

## Verdict

### Opportunity Score: [X/100]
- Market Attractiveness: [X/25]
- Competition Level: [X/25] (higher = less competition = better)
- Execution Feasibility: [X/25]
- Timing: [X/25]

### Final Recommendation
[GO / CONDITIONAL GO / RECONSIDER / PASS]

[2-3 sentences with your honest assessment of whether this is worth pursuing and why]

---
*Analysis generated with market data through 2024. Estimates based on available public information and industry benchmarks.*`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 64,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API Error:', errorData)
      throw new Error(`Gemini API returned ${response.status}`)
    }

    const data = await response.json()
    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate analysis'

    const result: ResearchResponse = {
      success: true,
      data: {
        query,
        analysis,
      },
      model: 'gemini-2.0-flash-exp',
      timestamp: new Date().toISOString()
    }

    return res.status(200).json(result)

  } catch (error) {
    console.error('AI Research Error:', error)

    // Return a helpful error message
    return res.status(500).json({
      success: false,
      error: 'Failed to generate analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
