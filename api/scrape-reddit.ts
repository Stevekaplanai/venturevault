// Vercel Serverless Function: Reddit Idea Scraper
// Endpoint: GET /api/scrape-reddit?subreddit=SideProject&limit=25

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface RedditPost {
  title: string
  selftext: string
  url: string
  permalink: string
  score: number
  num_comments: number
  created_utc: number
  subreddit: string
}

interface ScrapedIdea {
  title: string
  description: string
  source: string
  sourceUrl: string
  upvotes: number
  comments: number
  createdAt: string
}

const SUBREDDITS = [
  'SideProject',
  'startup',
  'SaaS',
  'Entrepreneur',
  'Startups',
  'buildinpublic'
]

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

  try {
    const subreddit = (req.query.subreddit as string) || 'SideProject'
    const limit = Math.min(parseInt(req.query.limit as string) || 25, 100)

    // Validate subreddit
    if (!SUBREDDITS.includes(subreddit)) {
      return res.status(400).json({
        error: 'Invalid subreddit',
        allowedSubreddits: SUBREDDITS
      })
    }

    // Fetch from Reddit JSON API (no auth needed for public data)
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`,
      {
        headers: {
          'User-Agent': 'VentureVault/1.0 (Startup Idea Aggregator)'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status}`)
    }

    const data = await response.json()

    // Filter for posts that look like startup ideas
    const ideas: ScrapedIdea[] = data.data.children
      .map((child: { data: RedditPost }) => child.data)
      .filter((post: RedditPost) => {
        // Skip stickied posts, very short posts, or link-only posts
        if (post.selftext.length < 50) return false
        if (post.title.toLowerCase().includes('weekly') ||
            post.title.toLowerCase().includes('monthly') ||
            post.title.toLowerCase().includes('megathread')) return false
        return true
      })
      .map((post: RedditPost): ScrapedIdea => ({
        title: post.title.substring(0, 200),
        description: post.selftext.substring(0, 2000),
        source: `r/${post.subreddit}`,
        sourceUrl: `https://reddit.com${post.permalink}`,
        upvotes: post.score,
        comments: post.num_comments,
        createdAt: new Date(post.created_utc * 1000).toISOString()
      }))

    return res.status(200).json({
      success: true,
      subreddit,
      count: ideas.length,
      ideas
    })
  } catch (error) {
    console.error('Reddit scrape error:', error)
    return res.status(500).json({
      error: 'Failed to fetch ideas from Reddit',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
