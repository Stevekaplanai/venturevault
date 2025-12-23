// Vercel Serverless Function: Batch Import Ideas to Supabase
// Endpoint: POST /api/import-ideas
// Imports enhanced ideas into the database

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

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
  customerPersonas: unknown[]
  playbook: unknown
  unitEconomics: unknown
  landingPageCopy: unknown
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Simple auth check (use a secret key for imports)
  const authHeader = req.headers.authorization
  const IMPORT_SECRET = process.env.IMPORT_SECRET

  if (IMPORT_SECRET && authHeader !== `Bearer ${IMPORT_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  try {
    const { ideas } = req.body as { ideas: EnhancedIdea[] }

    if (!ideas || !Array.isArray(ideas) || ideas.length === 0) {
      return res.status(400).json({ error: 'ideas array is required' })
    }

    // Transform ideas for database storage
    const dbIdeas = ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      full_description: idea.fullDescription,
      category: idea.category,
      market_score: idea.marketScore,
      competition_level: idea.competitionLevel,
      potential_revenue: idea.potentialRevenue,
      trending: idea.trending,
      tags: idea.tags,
      target_audience: idea.targetAudience,
      problem_solved: idea.problemSolved,
      monetization_model: idea.monetizationModel,
      market_size: idea.marketSize,
      growth_rate: idea.growthRate,
      key_competitors: idea.keyCompetitors,
      mvp_features: idea.mvpFeatures,
      tech_stack: idea.techStack,
      time_to_mvp: idea.timeToMVP,
      initial_investment: idea.initialInvestment,
      created_at: idea.createdAt,
      customer_personas: idea.customerPersonas,
      playbook: idea.playbook,
      unit_economics: idea.unitEconomics,
      landing_page_copy: idea.landingPageCopy
    }))

    // Upsert ideas (insert or update if exists)
    const { data, error } = await supabase
      .from('ideas')
      .upsert(dbIdeas, { onConflict: 'id' })
      .select('id')

    if (error) {
      throw error
    }

    return res.status(200).json({
      success: true,
      imported: data?.length || ideas.length,
      message: `Successfully imported ${ideas.length} ideas`
    })
  } catch (error) {
    console.error('Import ideas error:', error)
    return res.status(500).json({
      error: 'Failed to import ideas',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
