// Vercel Serverless Function: RSS Feed Proxy
// Endpoint: /api/rss

import type { VercelRequest, VercelResponse } from '@vercel/node'

interface RSSFeed {
  url: string
  source: string
  category: string
}

interface RSSItem {
  title: string
  link: string
  pubDate: string
  source: string
  description: string
  category: string
}

const RSS_FEEDS: RSSFeed[] = [
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'Tech News' },
  { url: 'https://www.producthunt.com/feed', source: 'Product Hunt', category: 'Product Launch' },
  { url: 'https://news.ycombinator.com/rss', source: 'Hacker News', category: 'Tech Community' },
  { url: 'https://feeds.feedburner.com/venturebeat/SZYF', source: 'VentureBeat', category: 'Tech News' },
  { url: 'https://www.wired.com/feed/rss', source: 'Wired', category: 'Tech & Culture' },
]

function parseRSSItem(itemText: string, source: string, category: string): RSSItem | null {
  try {
    const getTagContent = (tag: string): string => {
      const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
      const match = itemText.match(regex)
      return (match?.[1] || match?.[2] || '').trim()
    }

    const title = getTagContent('title')
    const link = getTagContent('link')
    const pubDate = getTagContent('pubDate')
    const description = getTagContent('description')
      .replace(/<[^>]*>/g, '') // Strip HTML tags
      .slice(0, 200)

    if (!title || !link) return null

    return {
      title,
      link,
      pubDate,
      source,
      description,
      category,
    }
  } catch {
    return null
  }
}

async function fetchSingleFeed(feed: RSSFeed): Promise<RSSItem[]> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5s timeout

    const response = await fetch(feed.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'VentureVault/1.0 RSS Reader',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const text = await response.text()

    // Parse items from RSS
    const items: RSSItem[] = []
    const itemMatches = text.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || []

    for (const itemText of itemMatches.slice(0, 10)) {
      const parsed = parseRSSItem(itemText, feed.source, feed.category)
      if (parsed) items.push(parsed)
    }

    return items
  } catch (error) {
    console.error(`Error fetching ${feed.source}:`, error)
    return []
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600') // Cache for 5min

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // Fetch all feeds in parallel
    const feedPromises = RSS_FEEDS.map(feed => fetchSingleFeed(feed))
    const allFeeds = await Promise.all(feedPromises)

    // Combine and sort by date
    const combined = allFeeds
      .flat()
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    return res.status(200).json({
      success: true,
      data: combined,
      count: combined.length,
      sources: RSS_FEEDS.map(f => f.source),
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('RSS Fetch Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch RSS feeds',
      data: [],
    })
  }
}
