// Vercel Serverless Function: Fetch Ideas from Supabase
// Endpoint: GET /api/ideas
// Query params: ?category=AI/ML&search=keyword&trending=true

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  try {
    const { category, search, trending, limit, offset } = req.query

    let query = supabase
      .from('ideas')
      .select('*')
      .order('market_score', { ascending: false })

    // Filter by category
    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    // Filter by trending
    if (trending === 'true') {
      query = query.eq('trending', true)
    }

    // Search in title/description
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Pagination
    if (limit) {
      query = query.limit(parseInt(limit as string))
    }
    if (offset) {
      query = query.range(
        parseInt(offset as string),
        parseInt(offset as string) + (parseInt(limit as string) || 50) - 1
      )
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Transform from snake_case to camelCase for frontend
    const ideas = (data || []).map(idea => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      fullDescription: idea.full_description,
      category: idea.category,
      marketScore: idea.market_score,
      competitionLevel: idea.competition_level,
      potentialRevenue: idea.potential_revenue,
      trending: idea.trending,
      tags: idea.tags,
      targetAudience: idea.target_audience,
      problemSolved: idea.problem_solved,
      monetizationModel: idea.monetization_model,
      marketSize: idea.market_size,
      growthRate: idea.growth_rate,
      keyCompetitors: idea.key_competitors,
      mvpFeatures: idea.mvp_features,
      techStack: idea.tech_stack,
      timeToMVP: idea.time_to_mvp,
      initialInvestment: idea.initial_investment,
      createdAt: idea.created_at,
      customerPersonas: idea.customer_personas || [],
      playbook: idea.playbook || { week1to4: [], week5to8: [], week9to12: [] },
      unitEconomics: idea.unit_economics || {},
      landingPageCopy: idea.landing_page_copy || {}
    }))

    return res.status(200).json({
      success: true,
      ideas,
      count: ideas.length
    })
  } catch (error) {
    console.error('Fetch ideas error:', error)
    return res.status(500).json({
      error: 'Failed to fetch ideas',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
