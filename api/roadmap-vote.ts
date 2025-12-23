// Vercel Serverless Function: Roadmap Voting
// Endpoint: POST /api/roadmap-vote

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

interface VoteRequest {
  featureId: string
  visitorId: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // GET - Fetch all vote counts
  if (req.method === 'GET') {
    try {
      const { data: votes, error } = await supabase
        .from('roadmap_votes')
        .select('feature_id')

      if (error) throw error

      // Count votes per feature
      const voteCounts: Record<string, number> = {}
      votes?.forEach(v => {
        voteCounts[v.feature_id] = (voteCounts[v.feature_id] || 0) + 1
      })

      return res.status(200).json({ success: true, votes: voteCounts })
    } catch (error) {
      console.error('Error fetching votes:', error)
      return res.status(500).json({ error: 'Failed to fetch votes' })
    }
  }

  // POST - Submit a vote
  if (req.method === 'POST') {
    const { featureId, visitorId } = req.body as VoteRequest

    if (!featureId || !visitorId) {
      return res.status(400).json({ error: 'featureId and visitorId are required' })
    }

    try {
      // Check if already voted
      const { data: existing } = await supabase
        .from('roadmap_votes')
        .select('id')
        .eq('feature_id', featureId)
        .eq('visitor_id', visitorId)
        .single()

      if (existing) {
        return res.status(400).json({ error: 'Already voted for this feature' })
      }

      // Insert vote
      const { error: insertError } = await supabase
        .from('roadmap_votes')
        .insert({
          feature_id: featureId,
          visitor_id: visitorId,
          voted_at: new Date().toISOString()
        })

      if (insertError) throw insertError

      // Get updated count
      const { data: votes } = await supabase
        .from('roadmap_votes')
        .select('feature_id')
        .eq('feature_id', featureId)

      return res.status(200).json({
        success: true,
        featureId,
        voteCount: votes?.length || 1
      })
    } catch (error) {
      console.error('Error voting:', error)
      return res.status(500).json({ error: 'Failed to submit vote' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
