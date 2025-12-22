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
    const prompt = `You are a startup market research analyst. Analyze the following startup idea or market query and provide a comprehensive analysis.

Query: "${query}"

Please provide your analysis in the following markdown format:

## Market Overview
[Provide a brief overview of the market opportunity]

## Market Size
- **TAM (Total Addressable Market):** [estimate with reasoning]
- **SAM (Serviceable Available Market):** [estimate]
- **SOM (Serviceable Obtainable Market):** [realistic target]

## Competitive Landscape
[List 3-5 main competitors and their market position]

## Key Opportunities
1. [Opportunity 1]
2. [Opportunity 2]
3. [Opportunity 3]

## Potential Risks
1. [Risk 1]
2. [Risk 2]
3. [Risk 3]

## Growth Drivers
[What factors are driving growth in this market?]

## Recommendations
[Strategic recommendations for entering this market]

## Startup Idea Score
[Rate this idea from 1-100 based on market potential, competition, and feasibility]

Be specific with numbers and data where possible. If you're estimating, clearly indicate it.`

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
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
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
