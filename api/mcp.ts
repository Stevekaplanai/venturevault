import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Import ideas data - we'll use static data for reliability
const ideas = [
  {
    id: "ai-finance-coach",
    title: "AI-Powered Personal Finance Coach",
    description: "An intelligent app that analyzes spending habits, provides personalized savings recommendations, and automates investment decisions using machine learning.",
    category: "FinTech",
    marketScore: 87,
    competitionLevel: "Medium",
    potentialRevenue: "$50M+",
    trending: true,
    tags: ["AI", "Finance", "B2C", "Mobile App", "Subscription"],
    targetAudience: "Millennials and Gen Z professionals aged 25-40",
    problemSolved: "People struggle to save money and make informed investment decisions without expensive financial advisors",
    marketSize: "$7.3 Billion",
    growthRate: "23.4% CAGR",
    timeToMVP: "3-4 months",
    initialInvestment: "$50,000 - $100,000"
  },
  {
    id: "remote-team-wellness",
    title: "Remote Team Wellness Platform",
    description: "A comprehensive platform helping remote teams stay healthy, connected, and productive through virtual wellness activities, mental health resources, and team building exercises.",
    category: "HR Tech",
    marketScore: 82,
    competitionLevel: "Low",
    potentialRevenue: "$30M+",
    trending: true,
    tags: ["Remote Work", "Wellness", "B2B", "SaaS", "Mental Health"],
    targetAudience: "HR managers and remote-first companies with 50-500 employees",
    problemSolved: "Remote workers experience isolation, burnout, and disconnection from their teams",
    marketSize: "$5.8 Billion",
    growthRate: "18.7% CAGR",
    timeToMVP: "2-3 months",
    initialInvestment: "$30,000 - $60,000"
  },
  {
    id: "sustainable-fashion-marketplace",
    title: "Sustainable Fashion Marketplace",
    description: "A curated marketplace connecting eco-conscious consumers with verified sustainable fashion brands, featuring carbon footprint tracking and circular fashion options.",
    category: "E-Commerce",
    marketScore: 79,
    competitionLevel: "Medium",
    potentialRevenue: "$25M+",
    trending: true,
    tags: ["Sustainability", "Fashion", "Marketplace", "B2C", "E-commerce"],
    targetAudience: "Environmentally conscious millennials and Gen Z consumers",
    problemSolved: "Consumers struggle to find and verify truly sustainable fashion options",
    marketSize: "$8.2 Billion",
    growthRate: "15.2% CAGR",
    timeToMVP: "4-5 months",
    initialInvestment: "$40,000 - $80,000"
  },
  {
    id: "ai-content-repurposer",
    title: "AI Content Repurposing Tool",
    description: "Automatically transforms long-form content into multiple formats - blog posts to social threads, podcasts to articles, videos to short clips with AI-generated captions.",
    category: "Creator Economy",
    marketScore: 91,
    competitionLevel: "Medium",
    potentialRevenue: "$40M+",
    trending: true,
    tags: ["AI", "Content", "Creator Tools", "SaaS", "Automation"],
    targetAudience: "Content creators, marketers, and media companies",
    problemSolved: "Creating content for multiple platforms is time-consuming and requires different skills",
    marketSize: "$15.2 Billion",
    growthRate: "26.8% CAGR",
    timeToMVP: "2-3 months",
    initialInvestment: "$25,000 - $50,000"
  },
  {
    id: "pet-health-ai",
    title: "Pet Health Monitoring App",
    description: "An AI-powered app that tracks pet health metrics, provides early disease detection through photo analysis, and connects pet owners with veterinarians for telehealth consultations.",
    category: "Pet Tech",
    marketScore: 84,
    competitionLevel: "Low",
    potentialRevenue: "$35M+",
    trending: false,
    tags: ["AI", "Pets", "Healthcare", "B2C", "Mobile App"],
    targetAudience: "Pet owners aged 25-55 who treat pets as family members",
    problemSolved: "Pet owners often miss early signs of illness and face expensive emergency vet visits",
    marketSize: "$6.4 Billion",
    growthRate: "19.3% CAGR",
    timeToMVP: "4-5 months",
    initialInvestment: "$60,000 - $120,000"
  },
  {
    id: "micro-learning-platform",
    title: "Micro-Learning Career Platform",
    description: "Bite-sized skill courses (5-10 minutes) designed for busy professionals, featuring AI-personalized learning paths and verified micro-credentials recognized by employers.",
    category: "EdTech",
    marketScore: 88,
    competitionLevel: "High",
    potentialRevenue: "$60M+",
    trending: true,
    tags: ["Education", "Career", "AI", "B2C", "B2B", "Subscription"],
    targetAudience: "Working professionals aged 25-45 looking to upskill",
    problemSolved: "Traditional courses are too long and don't fit into busy work schedules",
    marketSize: "$18.5 Billion",
    growthRate: "21.4% CAGR",
    timeToMVP: "3-4 months",
    initialInvestment: "$45,000 - $90,000"
  },
  {
    id: "local-services-ai",
    title: "AI Local Services Concierge",
    description: "An AI assistant that helps users find, compare, and book local services (plumbers, cleaners, tutors) with real-time availability, transparent pricing, and verified reviews.",
    category: "Local Services",
    marketScore: 76,
    competitionLevel: "High",
    potentialRevenue: "$45M+",
    trending: false,
    tags: ["AI", "Local", "Marketplace", "B2C", "Services"],
    targetAudience: "Homeowners and renters aged 30-55 in urban/suburban areas",
    problemSolved: "Finding reliable local service providers is frustrating and time-consuming",
    marketSize: "$22.1 Billion",
    growthRate: "12.8% CAGR",
    timeToMVP: "4-6 months",
    initialInvestment: "$70,000 - $140,000"
  },
  {
    id: "creator-collab-platform",
    title: "Creator Collaboration Hub",
    description: "A platform matching content creators for collaborations based on audience overlap, content style, and goals, with built-in project management and revenue sharing tools.",
    category: "Creator Economy",
    marketScore: 83,
    competitionLevel: "Low",
    potentialRevenue: "$28M+",
    trending: true,
    tags: ["Creators", "Collaboration", "SaaS", "B2B", "Social"],
    targetAudience: "Content creators with 10K-1M followers looking to grow",
    problemSolved: "Finding the right collaboration partners is difficult and managing collabs is messy",
    marketSize: "$4.7 Billion",
    growthRate: "24.6% CAGR",
    timeToMVP: "3-4 months",
    initialInvestment: "$35,000 - $70,000"
  }
]

const categories = ["All", "FinTech", "HR Tech", "E-Commerce", "Creator Economy", "Pet Tech", "EdTech", "Local Services", "HealthTech", "PropTech", "FoodTech"]

// Validate OAuth access token
async function validateToken(authHeader: string | undefined): Promise<{ valid: boolean; userId?: string; error?: string }> {
  if (!authHeader) {
    return { valid: false, error: 'No authorization header' }
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return { valid: false, error: 'Invalid authorization format. Use: Bearer <token>' }
  }

  const token = parts[1]

  try {
    // Check if token exists and is not expired
    const { data, error } = await supabase
      .from('oauth_access_tokens')
      .select('user_id, expires_at')
      .eq('access_token', token)
      .single()

    if (error || !data) {
      return { valid: false, error: 'Invalid or expired token' }
    }

    // Check if token is expired
    if (new Date(data.expires_at) < new Date()) {
      return { valid: false, error: 'Token expired' }
    }

    return { valid: true, userId: data.user_id }
  } catch (err) {
    console.error('Token validation error:', err)
    return { valid: false, error: 'Token validation failed' }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for ChatGPT
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const action = (req.query.action as string) || 'list'
  const category = req.query.category as string
  const query = req.query.q as string
  const id = req.query.id as string
  const limit = parseInt(req.query.limit as string) || 10

  // Check for OAuth token (optional - allows both authenticated and unauthenticated access)
  const authHeader = req.headers.authorization
  let userId: string | undefined
  let isAuthenticated = false

  if (authHeader) {
    const tokenResult = await validateToken(authHeader)
    if (tokenResult.valid) {
      userId = tokenResult.userId
      isAuthenticated = true
    } else {
      // Return error for invalid tokens
      return res.status(401).json({
        success: false,
        error: 'unauthorized',
        error_description: tokenResult.error
      })
    }
  }

  try {
    // Return OpenAPI spec
    if (action === 'spec') {
      return res.status(200).json(getOpenApiSpec())
    }

    // Return categories
    if (action === 'categories') {
      return res.status(200).json({
        success: true,
        authenticated: isAuthenticated,
        categories: categories.filter(c => c !== 'All')
      })
    }

    // Get specific idea by ID
    if (action === 'get' && id) {
      const idea = ideas.find(i => i.id === id)
      if (!idea) {
        return res.status(404).json({
          success: false,
          error: 'Idea not found'
        })
      }
      return res.status(200).json({
        success: true,
        authenticated: isAuthenticated,
        idea
      })
    }

    // Get trending ideas
    if (action === 'trending') {
      const trendingIdeas = ideas.filter(i => i.trending).slice(0, limit)
      return res.status(200).json({
        success: true,
        authenticated: isAuthenticated,
        count: trendingIdeas.length,
        ideas: trendingIdeas
      })
    }

    // Get random idea
    if (action === 'random') {
      const randomIdea = ideas[Math.floor(Math.random() * ideas.length)]
      return res.status(200).json({
        success: true,
        authenticated: isAuthenticated,
        idea: randomIdea
      })
    }

    // Get saved ideas (requires authentication)
    if (action === 'saved') {
      if (!isAuthenticated || !userId) {
        return res.status(401).json({
          success: false,
          error: 'unauthorized',
          error_description: 'Authentication required to view saved ideas'
        })
      }

      const { data: savedIdeas } = await supabase
        .from('saved_ideas')
        .select('idea_id')
        .eq('user_id', userId)

      const savedIdeaIds = savedIdeas?.map(s => s.idea_id) || []
      const userSavedIdeas = ideas.filter(i => savedIdeaIds.includes(i.id))

      return res.status(200).json({
        success: true,
        authenticated: true,
        count: userSavedIdeas.length,
        ideas: userSavedIdeas
      })
    }

    // Search ideas
    if (action === 'search' && query) {
      const searchQuery = query.toLowerCase()
      const results = ideas.filter(idea =>
        idea.title.toLowerCase().includes(searchQuery) ||
        idea.description.toLowerCase().includes(searchQuery) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
        idea.category.toLowerCase().includes(searchQuery)
      ).slice(0, limit)

      return res.status(200).json({
        success: true,
        authenticated: isAuthenticated,
        query,
        count: results.length,
        ideas: results
      })
    }

    // List all ideas (with optional category filter)
    let filteredIdeas = ideas

    if (category && category !== 'All') {
      filteredIdeas = ideas.filter(i =>
        i.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Sort by market score (highest first)
    filteredIdeas = [...filteredIdeas].sort((a, b) => b.marketScore - a.marketScore)
    filteredIdeas = filteredIdeas.slice(0, limit)

    return res.status(200).json({
      success: true,
      authenticated: isAuthenticated,
      count: filteredIdeas.length,
      total: ideas.length,
      categories: categories.filter(c => c !== 'All'),
      ideas: filteredIdeas
    })

  } catch (error) {
    console.error('MCP API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

function getOpenApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: "VentureVault Startup Ideas API",
      description: "Access curated startup ideas with AI-powered market analysis. Use this API to search, filter, and explore validated startup opportunities.",
      version: "1.0.0",
      contact: {
        name: "VentureVault",
        url: "https://venturevault.space"
      }
    },
    servers: [
      {
        url: "https://venturevault.space/api",
        description: "Production server"
      }
    ],
    components: {
      securitySchemes: {
        oauth2: {
          type: "oauth2",
          flows: {
            authorizationCode: {
              authorizationUrl: "https://venturevault.space/api/oauth/authorize",
              tokenUrl: "https://venturevault.space/api/oauth/token",
              scopes: {
                read: "Read access to startup ideas",
                saved: "Access to saved ideas"
              }
            }
          }
        }
      }
    },
    security: [
      { oauth2: ["read"] }
    ],
    paths: {
      "/mcp": {
        get: {
          operationId: "getIdeas",
          summary: "Get startup ideas",
          description: "Retrieve startup ideas with optional filtering by category, search query, trending status, or specific ID.",
          security: [{ oauth2: ["read"] }],
          parameters: [
            {
              name: "action",
              in: "query",
              description: "The action to perform",
              required: false,
              schema: { type: "string", enum: ["list", "search", "get", "categories", "trending", "random", "saved", "spec"], default: "list" }
            },
            {
              name: "category",
              in: "query",
              description: "Filter by category (e.g., 'FinTech', 'EdTech', 'Creator Economy')",
              required: false,
              schema: { type: "string" }
            },
            {
              name: "q",
              in: "query",
              description: "Search query to find ideas by title, description, or tags",
              required: false,
              schema: { type: "string" }
            },
            {
              name: "id",
              in: "query",
              description: "Specific idea ID to retrieve",
              required: false,
              schema: { type: "string" }
            },
            {
              name: "limit",
              in: "query",
              description: "Maximum number of ideas to return (default: 10)",
              required: false,
              schema: { type: "integer", default: 10 }
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      authenticated: { type: "boolean" },
                      count: { type: "integer" },
                      ideas: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            title: { type: "string" },
                            description: { type: "string" },
                            category: { type: "string" },
                            marketScore: { type: "integer" },
                            competitionLevel: { type: "string" },
                            potentialRevenue: { type: "string" },
                            trending: { type: "boolean" },
                            tags: { type: "array", items: { type: "string" } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              description: "Unauthorized - Invalid or missing token"
            }
          }
        }
      }
    }
  }
}
