// RSS Feed Service for VentureVault
// Fetches startup news from various sources

export interface RSSItem {
  title: string
  link: string
  pubDate: string
  source: string
  description?: string
  category?: string
}

export interface TrendingTopic {
  term: string
  traffic: string
  category: string
  relatedQueries: string[]
}

// Popular RSS feeds for startup/tech news
const RSS_FEEDS = [
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'Tech News' },
  { url: 'https://www.producthunt.com/feed', source: 'Product Hunt', category: 'Product Launch' },
  { url: 'https://news.ycombinator.com/rss', source: 'Hacker News', category: 'Tech Community' },
  { url: 'https://feeds.feedburner.com/venturebeat/SZYF', source: 'VentureBeat', category: 'Tech News' },
  { url: 'https://www.wired.com/feed/rss', source: 'Wired', category: 'Tech & Culture' },
]

// CORS proxy for client-side RSS fetching
const CORS_PROXY = 'https://api.allorigins.win/raw?url='

export async function fetchRSSFeed(feedUrl: string, source: string, category: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(feedUrl)}`)
    if (!response.ok) throw new Error('Failed to fetch RSS feed')

    const text = await response.text()
    const parser = new DOMParser()
    const xml = parser.parseFromString(text, 'text/xml')

    const items = xml.querySelectorAll('item')
    const rssFeed: RSSItem[] = []

    items.forEach((item, index) => {
      if (index < 10) { // Limit to 10 items per feed
        rssFeed.push({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          description: item.querySelector('description')?.textContent?.replace(/<[^>]*>/g, '').slice(0, 200) || '',
          source,
          category,
        })
      }
    })

    return rssFeed
  } catch (error) {
    console.error(`Error fetching RSS from ${source}:`, error)
    return []
  }
}

export async function fetchAllRSSFeeds(): Promise<RSSItem[]> {
  const feedPromises = RSS_FEEDS.map(feed =>
    fetchRSSFeed(feed.url, feed.source, feed.category)
  )

  const allFeeds = await Promise.all(feedPromises)
  const combined = allFeeds.flat()

  // Sort by date (most recent first)
  return combined.sort((a, b) =>
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )
}

// Fetch real Google Trends data via our API (SerpAPI backend)
export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    // Use the Vercel serverless function endpoint
    const apiUrl = import.meta.env.PROD
      ? '/api/trends'
      : 'http://localhost:3000/api/trends'

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error('Failed to fetch trends')
    }

    const result = await response.json()

    if (result.success && result.data) {
      return result.data
    }

    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Error fetching trends:', error)
    // Return fallback data if API fails
    return getFallbackTrends()
  }
}

// Fallback trends data when API is unavailable
function getFallbackTrends(): TrendingTopic[] {
  return [
    {
      term: 'AI Agents',
      traffic: '1M+ searches',
      category: 'AI/ML',
      relatedQueries: ['AI agent frameworks', 'autonomous AI', 'AI automation']
    },
    {
      term: 'Claude AI',
      traffic: '500K+ searches',
      category: 'AI/ML',
      relatedQueries: ['Anthropic Claude', 'Claude API', 'Claude vs GPT']
    },
    {
      term: 'Vibe Coding',
      traffic: '200K+ searches',
      category: 'Developer Tools',
      relatedQueries: ['AI coding assistant', 'coding with AI', 'vibes based development']
    },
    {
      term: 'MCP Protocol',
      traffic: '100K+ searches',
      category: 'AI/ML',
      relatedQueries: ['Model Context Protocol', 'AI tool integration', 'MCP servers']
    },
    {
      term: 'Agentic Workflows',
      traffic: '150K+ searches',
      category: 'Automation',
      relatedQueries: ['AI workflows', 'autonomous systems', 'agent orchestration']
    },
    {
      term: 'AI Voice Cloning',
      traffic: '300K+ searches',
      category: 'AI/ML',
      relatedQueries: ['voice synthesis', 'AI voice generator', 'text to speech AI']
    },
    {
      term: 'No-Code AI',
      traffic: '250K+ searches',
      category: 'SaaS',
      relatedQueries: ['AI builders', 'no code automation', 'visual AI tools']
    },
    {
      term: 'AI Video Generation',
      traffic: '400K+ searches',
      category: 'AI/ML',
      relatedQueries: ['Sora', 'AI video creator', 'text to video AI']
    },
  ]
}

// Helper to format date
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return date.toLocaleDateString()
  } catch {
    return dateString
  }
}
