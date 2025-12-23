// Vercel Serverless Function: Get Single Idea by ID
// Endpoint: GET /api/idea/[id]

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

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Idea ID is required' })
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Idea not found' })
    }

    // Transform from snake_case to camelCase
    const idea = {
      id: data.id,
      title: data.title,
      description: data.description,
      fullDescription: data.full_description,
      category: data.category,
      marketScore: data.market_score,
      competitionLevel: data.competition_level,
      potentialRevenue: data.potential_revenue,
      trending: data.trending,
      tags: data.tags,
      targetAudience: data.target_audience,
      problemSolved: data.problem_solved,
      monetizationModel: data.monetization_model,
      marketSize: data.market_size,
      growthRate: data.growth_rate,
      keyCompetitors: data.key_competitors,
      mvpFeatures: data.mvp_features,
      techStack: data.tech_stack,
      timeToMVP: data.time_to_mvp,
      initialInvestment: data.initial_investment,
      createdAt: data.created_at,
      customerPersonas: data.customer_personas || [],
      playbook: data.playbook || { week1to4: [], week5to8: [], week9to12: [] },
      unitEconomics: data.unit_economics || {},
      landingPageCopy: data.landing_page_copy || {}
    }

    // Get related ideas (same category, excluding current)
    const { data: relatedData } = await supabase
      .from('ideas')
      .select('*')
      .eq('category', data.category)
      .neq('id', id)
      .order('market_score', { ascending: false })
      .limit(3)

    const relatedIdeas = (relatedData || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      fullDescription: item.full_description,
      category: item.category,
      marketScore: item.market_score,
      competitionLevel: item.competition_level,
      potentialRevenue: item.potential_revenue,
      trending: item.trending,
      tags: item.tags,
      targetAudience: item.target_audience,
      problemSolved: item.problem_solved,
      monetizationModel: item.monetization_model,
      marketSize: item.market_size,
      growthRate: item.growth_rate,
      keyCompetitors: item.key_competitors,
      mvpFeatures: item.mvp_features,
      techStack: item.tech_stack,
      timeToMVP: item.time_to_mvp,
      initialInvestment: item.initial_investment,
      createdAt: item.created_at,
      customerPersonas: item.customer_personas || [],
      playbook: item.playbook || { week1to4: [], week5to8: [], week9to12: [] },
      unitEconomics: item.unit_economics || {},
      landingPageCopy: item.landing_page_copy || {}
    }))

    return res.status(200).json({
      success: true,
      idea,
      relatedIdeas
    })
  } catch (error) {
    console.error('Fetch idea error:', error)
    return res.status(500).json({
      error: 'Failed to fetch idea',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
