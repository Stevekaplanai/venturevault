// RSS Feed Service for VentureVault
// Fetches startup news via our Edge Function

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

// Fallback RSS data when API is unavailable
function getFallbackRSSItems(): RSSItem[] {
  return [
    {
      title: 'Latest AI Trends Reshaping Startup Landscape',
      link: '#',
      pubDate: new Date().toISOString(),
      source: 'VentureVault',
      description: 'Discover the latest trends in AI and how they are creating new startup opportunities.',
      category: 'Tech News'
    },
    {
      title: 'Top 10 SaaS Ideas for 2025',
      link: '#',
      pubDate: new Date().toISOString(),
      source: 'VentureVault',
      description: 'Explore the most promising SaaS business ideas that are gaining traction.',
      category: 'Product Launch'
    },
  ]
}

export async function fetchAllRSSFeeds(): Promise<RSSItem[]> {
  try {
    // Use our Vercel Edge Function
    const apiUrl = import.meta.env.PROD
      ? '/api/rss'
      : 'http://localhost:3000/api/rss'

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error('Failed to fetch RSS feeds')
    }

    const result = await response.json()

    if (result.success && result.data) {
      return result.data
    }

    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Error fetching RSS feeds:', error)
    return getFallbackRSSItems()
  }
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
