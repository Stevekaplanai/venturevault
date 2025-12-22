// Vercel Serverless Function: Google Trends via SerpAPI
// Endpoint: /api/trends

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface SerpAPITrend {
  query: string
  search_volume?: number
  increase_percentage?: number
  categories?: { id: number; name: string }[]
  trend_breakdown?: string[]
}

interface TrendingTopic {
  term: string
  traffic: string
  category: string
  relatedQueries: string[]
  articles: { title: string; url: string }[]
}

function formatTraffic(volume?: number): string {
  if (!volume) return '100K+ searches'
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(0)}M+ searches`
  if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K+ searches`
  return `${volume}+ searches`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const SERPAPI_KEY = process.env.SERPAPI_KEY

  if (!SERPAPI_KEY) {
    return res.status(500).json({ error: 'SerpAPI key not configured' })
  }

  try {
    // Fetch trending searches from SerpAPI (new endpoint format)
    const response = await fetch(
      `https://serpapi.com/search.json?engine=google_trends_trending_now&geo=US&api_key=${SERPAPI_KEY}`
    )

    if (!response.ok) {
      throw new Error(`SerpAPI returned ${response.status}`)
    }

    const data = await response.json()

    // Transform the new API format to our format
    const trendingTopics: TrendingTopic[] = (data.trending_searches || [])
      .slice(0, 15)
      .map((item: SerpAPITrend) => ({
        term: item.query,
        traffic: formatTraffic(item.search_volume),
        category: item.categories?.[0]?.name || categorizeQuery(item.query),
        relatedQueries: (item.trend_breakdown || []).slice(0, 5),
        articles: []
      }))

    return res.status(200).json({
      success: true,
      data: trendingTopics,
      source: 'serpapi',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('SerpAPI Error:', error)

    // Return fallback data if API fails
    return res.status(200).json({
      success: true,
      data: getFallbackTrends(),
      source: 'fallback',
      timestamp: new Date().toISOString()
    })
  }
}

// Categorize queries into startup-relevant categories
function categorizeQuery(query: string): string {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes('ai') || lowerQuery.includes('gpt') || lowerQuery.includes('claude') || lowerQuery.includes('machine learning')) {
    return 'AI/ML'
  }
  if (lowerQuery.includes('crypto') || lowerQuery.includes('bitcoin') || lowerQuery.includes('fintech') || lowerQuery.includes('payment')) {
    return 'FinTech'
  }
  if (lowerQuery.includes('health') || lowerQuery.includes('medical') || lowerQuery.includes('fitness')) {
    return 'HealthTech'
  }
  if (lowerQuery.includes('saas') || lowerQuery.includes('software') || lowerQuery.includes('app')) {
    return 'SaaS'
  }
  if (lowerQuery.includes('ecommerce') || lowerQuery.includes('shop') || lowerQuery.includes('retail')) {
    return 'E-commerce'
  }
  if (lowerQuery.includes('education') || lowerQuery.includes('learn') || lowerQuery.includes('course')) {
    return 'EdTech'
  }

  return 'General'
}

// Fallback trends if API fails
function getFallbackTrends(): TrendingTopic[] {
  return [
    { term: 'AI Agents', traffic: '1M+ searches', category: 'AI/ML', relatedQueries: ['AI agent frameworks', 'autonomous AI'], articles: [] },
    { term: 'Claude AI', traffic: '500K+ searches', category: 'AI/ML', relatedQueries: ['Anthropic Claude', 'Claude API'], articles: [] },
    { term: 'Vibe Coding', traffic: '200K+ searches', category: 'Developer Tools', relatedQueries: ['AI coding assistant'], articles: [] },
    { term: 'MCP Protocol', traffic: '100K+ searches', category: 'AI/ML', relatedQueries: ['Model Context Protocol'], articles: [] },
    { term: 'AI Voice Cloning', traffic: '300K+ searches', category: 'AI/ML', relatedQueries: ['voice synthesis'], articles: [] },
  ]
}
