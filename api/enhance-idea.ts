// Vercel Serverless Function: AI Idea Enhancer
// Endpoint: POST /api/enhance-idea
// Uses Gemini to transform raw ideas into fully-analyzed startup ideas

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface RawIdea {
  title: string
  description: string
  source?: string
  sourceUrl?: string
}

interface EnhancedIdea {
  id: string
  title: string
  description: string
  fullDescription: string
  category: string
  marketScore: number
  competitionLevel: 'Low' | 'Medium' | 'High'
  potentialRevenue: string
  trending: boolean
  tags: string[]
  targetAudience: string
  problemSolved: string
  monetizationModel: string[]
  marketSize: string
  growthRate: string
  keyCompetitors: string[]
  mvpFeatures: string[]
  techStack: string[]
  timeToMVP: string
  initialInvestment: string
  createdAt: string
  customerPersonas: Array<{
    name: string
    role: string
    demographics: string
    painPoints: string[]
    goals: string[]
    channels: string[]
  }>
  playbook: {
    week1to4: string[]
    week5to8: string[]
    week9to12: string[]
  }
  unitEconomics: {
    cacEstimate: string
    ltvEstimate: string
    paybackPeriod: string
    grossMargin: string
  }
  landingPageCopy: {
    headlines: string[]
    valueProps: string[]
    ctaOptions: string[]
  }
}

const CATEGORIES = [
  'AI/ML', 'FinTech', 'HealthTech', 'EdTech', 'SaaS', 'E-commerce',
  'DevTools', 'MarTech', 'HR/Recruiting', 'Productivity', 'Social',
  'Marketplace', 'CleanTech', 'PropTech', 'FoodTech', 'Gaming'
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' })
  }

  try {
    const { title, description, source, sourceUrl } = req.body as RawIdea

    if (!title || !description) {
      return res.status(400).json({ error: 'title and description are required' })
    }

    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are a startup analyst. Analyze this startup idea and provide comprehensive details.

RAW IDEA:
Title: ${title}
Description: ${description}
${source ? `Source: ${source}` : ''}

Respond with a valid JSON object (no markdown, no code blocks) with this exact structure:

{
  "title": "Refined, catchy title (5-8 words max)",
  "description": "Clear 1-2 sentence description (max 200 chars)",
  "fullDescription": "Detailed 3-4 paragraph description explaining the concept, market opportunity, and execution approach",
  "category": "One of: ${CATEGORIES.join(', ')}",
  "marketScore": <number 60-95 based on market potential>,
  "competitionLevel": "Low" | "Medium" | "High",
  "potentialRevenue": "e.g. $10M+, $50M+, $100M+",
  "trending": <true if related to current tech trends>,
  "tags": ["5-7 relevant tags"],
  "targetAudience": "Specific target demographic description",
  "problemSolved": "Clear problem statement",
  "monetizationModel": ["2-4 monetization strategies"],
  "marketSize": "TAM estimate with source reasoning",
  "growthRate": "Market CAGR percentage",
  "keyCompetitors": ["3-5 competitors or 'First mover' if none"],
  "mvpFeatures": ["5-7 core MVP features"],
  "techStack": ["5-7 recommended technologies"],
  "timeToMVP": "e.g. 2-3 months",
  "initialInvestment": "e.g. $20,000 - $50,000",
  "customerPersonas": [
    {
      "name": "Persona name",
      "role": "Job title/role",
      "demographics": "Age, income, location details",
      "painPoints": ["3 specific pain points"],
      "goals": ["3 goals this product helps achieve"],
      "channels": ["4 marketing channels to reach them"]
    },
    {
      "name": "Second persona",
      "role": "Different role",
      "demographics": "Different demographic",
      "painPoints": ["3 different pain points"],
      "goals": ["3 different goals"],
      "channels": ["4 different channels"]
    }
  ],
  "playbook": {
    "week1to4": ["4-5 tasks for first month - validation & setup"],
    "week5to8": ["4-5 tasks for second month - build MVP"],
    "week9to12": ["4-5 tasks for third month - launch & iterate"]
  },
  "unitEconomics": {
    "cacEstimate": "e.g. $25-50 per customer",
    "ltvEstimate": "e.g. $300-500 per customer",
    "paybackPeriod": "e.g. 3-6 months",
    "grossMargin": "e.g. 70-80%"
  },
  "landingPageCopy": {
    "headlines": ["3 compelling headline options"],
    "valueProps": ["4 value propositions for landing page"],
    "ctaOptions": ["3 CTA button text options"]
  }
}

Be realistic and thorough. Provide actionable, specific insights.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Clean the response (remove markdown code blocks if present)
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const enhancedData = JSON.parse(cleanedResponse)

    const enhancedIdea: EnhancedIdea = {
      id: generateSlug(enhancedData.title || title),
      title: enhancedData.title || title,
      description: enhancedData.description || description.substring(0, 200),
      fullDescription: enhancedData.fullDescription || description,
      category: CATEGORIES.includes(enhancedData.category) ? enhancedData.category : 'SaaS',
      marketScore: Math.min(95, Math.max(60, enhancedData.marketScore || 75)),
      competitionLevel: enhancedData.competitionLevel || 'Medium',
      potentialRevenue: enhancedData.potentialRevenue || '$10M+',
      trending: enhancedData.trending ?? false,
      tags: enhancedData.tags || [],
      targetAudience: enhancedData.targetAudience || 'Tech-savvy professionals',
      problemSolved: enhancedData.problemSolved || 'Various pain points',
      monetizationModel: enhancedData.monetizationModel || ['Subscription'],
      marketSize: enhancedData.marketSize || 'TBD',
      growthRate: enhancedData.growthRate || '15% CAGR',
      keyCompetitors: enhancedData.keyCompetitors || ['First mover'],
      mvpFeatures: enhancedData.mvpFeatures || [],
      techStack: enhancedData.techStack || ['React', 'Node.js', 'PostgreSQL'],
      timeToMVP: enhancedData.timeToMVP || '2-3 months',
      initialInvestment: enhancedData.initialInvestment || '$20,000 - $50,000',
      createdAt: new Date().toISOString().split('T')[0],
      customerPersonas: enhancedData.customerPersonas || [],
      playbook: enhancedData.playbook || { week1to4: [], week5to8: [], week9to12: [] },
      unitEconomics: enhancedData.unitEconomics || {
        cacEstimate: 'TBD',
        ltvEstimate: 'TBD',
        paybackPeriod: 'TBD',
        grossMargin: 'TBD'
      },
      landingPageCopy: enhancedData.landingPageCopy || {
        headlines: [],
        valueProps: [],
        ctaOptions: []
      }
    }

    return res.status(200).json({
      success: true,
      idea: enhancedIdea,
      source: source || 'manual',
      sourceUrl
    })
  } catch (error) {
    console.error('Enhance idea error:', error)
    return res.status(500).json({
      error: 'Failed to enhance idea',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
