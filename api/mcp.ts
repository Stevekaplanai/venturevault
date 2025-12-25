import type { VercelRequest, VercelResponse } from '@vercel/node'

// Startup ideas data
const ideas = [
  {
    id: "ai-finance-coach",
    title: "AI-Powered Personal Finance Coach",
    description: "An intelligent app that analyzes spending habits and automates investment decisions using ML.",
    category: "FinTech",
    marketScore: 87,
    competitionLevel: "Medium",
    potentialRevenue: "$50M+",
    trending: true,
    tags: ["AI", "Finance", "B2C", "Mobile App"],
    marketSize: "$7.3 Billion",
    timeToMVP: "3-4 months"
  },
  {
    id: "remote-team-wellness",
    title: "Remote Team Wellness Platform",
    description: "Platform helping remote teams stay healthy through virtual wellness activities and mental health resources.",
    category: "HR Tech",
    marketScore: 82,
    competitionLevel: "Low",
    potentialRevenue: "$30M+",
    trending: true,
    tags: ["Remote Work", "Wellness", "B2B", "SaaS"],
    marketSize: "$5.8 Billion",
    timeToMVP: "2-3 months"
  },
  {
    id: "ai-content-repurposer",
    title: "AI Content Repurposing Tool",
    description: "Automatically transforms long-form content into multiple formats - blogs to social threads, videos to clips.",
    category: "Creator Economy",
    marketScore: 91,
    competitionLevel: "Medium",
    potentialRevenue: "$40M+",
    trending: true,
    tags: ["AI", "Content", "Creator Tools", "SaaS"],
    marketSize: "$15.2 Billion",
    timeToMVP: "2-3 months"
  },
  {
    id: "micro-learning-platform",
    title: "Micro-Learning Career Platform",
    description: "Bite-sized skill courses (5-10 min) with AI-personalized learning paths and verified micro-credentials.",
    category: "EdTech",
    marketScore: 88,
    competitionLevel: "High",
    potentialRevenue: "$60M+",
    trending: true,
    tags: ["Education", "Career", "AI", "Subscription"],
    marketSize: "$18.5 Billion",
    timeToMVP: "3-4 months"
  },
  {
    id: "pet-health-ai",
    title: "Pet Health Monitoring App",
    description: "AI-powered app that tracks pet health metrics and provides early disease detection through photo analysis.",
    category: "Pet Tech",
    marketScore: 84,
    competitionLevel: "Low",
    potentialRevenue: "$35M+",
    trending: false,
    tags: ["AI", "Pets", "Healthcare", "Mobile App"],
    marketSize: "$6.4 Billion",
    timeToMVP: "4-5 months"
  }
]

const categories = ["FinTech", "HR Tech", "E-Commerce", "Creator Economy", "Pet Tech", "EdTech", "HealthTech"]

// MCP Tool definitions
const mcpTools = [
  {
    name: "list_startup_ideas",
    description: "List all available startup ideas with market analysis. Returns ideas sorted by market score.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by category (FinTech, EdTech, HR Tech, Creator Economy, Pet Tech, etc.)"
        },
        limit: {
          type: "number",
          description: "Maximum number of ideas to return (default: 10)"
        },
        trending_only: {
          type: "boolean",
          description: "Only return trending ideas"
        }
      }
    }
  },
  {
    name: "search_startup_ideas",
    description: "Search for startup ideas by keyword in title, description, or tags.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query"
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default: 5)"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "get_startup_idea",
    description: "Get detailed information about a specific startup idea by ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The startup idea ID"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "get_random_idea",
    description: "Get a random startup idea for inspiration.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "list_categories",
    description: "List all available startup idea categories.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
]

// Handle MCP tool calls
function handleToolCall(name: string, args: Record<string, unknown>) {
  switch (name) {
    case "list_startup_ideas": {
      let result = [...ideas]
      if (args.category) {
        result = result.filter(i => i.category.toLowerCase() === (args.category as string).toLowerCase())
      }
      if (args.trending_only) {
        result = result.filter(i => i.trending)
      }
      result.sort((a, b) => b.marketScore - a.marketScore)
      const limit = (args.limit as number) || 10
      return result.slice(0, limit)
    }
    case "search_startup_ideas": {
      const query = ((args.query as string) || "").toLowerCase()
      const limit = (args.limit as number) || 5
      const results = ideas.filter(i =>
        i.title.toLowerCase().includes(query) ||
        i.description.toLowerCase().includes(query) ||
        i.tags.some(t => t.toLowerCase().includes(query))
      )
      return results.slice(0, limit)
    }
    case "get_startup_idea": {
      const idea = ideas.find(i => i.id === args.id)
      return idea || { error: "Idea not found" }
    }
    case "get_random_idea": {
      return ideas[Math.floor(Math.random() * ideas.length)]
    }
    case "list_categories": {
      return { categories }
    }
    default:
      return { error: "Unknown tool" }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Handle MCP JSON-RPC requests (POST)
  if (req.method === 'POST') {
    const body = req.body

    // Handle JSON-RPC format
    if (body.jsonrpc === "2.0") {
      const { id, method, params } = body

      switch (method) {
        case "initialize":
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            result: {
              protocolVersion: "2024-11-05",
              serverInfo: {
                name: "venturevault",
                version: "1.0.0"
              },
              capabilities: {
                tools: {}
              }
            }
          })

        case "tools/list":
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            result: {
              tools: mcpTools
            }
          })

        case "tools/call":
          const { name, arguments: args } = params || {}
          const result = handleToolCall(name, args || {})
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2)
                }
              ]
            }
          })

        default:
          return res.status(200).json({
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: "Method not found"
            }
          })
      }
    }

    // Handle simple tool call format
    if (body.name || body.tool) {
      const name = body.name || body.tool
      const args = body.arguments || body.args || body.input || {}
      const result = handleToolCall(name, args)
      return res.status(200).json({ result })
    }
  }

  // Handle REST API requests (GET) - for backwards compatibility
  const action = (req.query.action as string) || 'list'
  const category = req.query.category as string
  const query = req.query.q as string
  const id = req.query.id as string
  const limit = parseInt(req.query.limit as string) || 10

  if (action === 'categories') {
    return res.status(200).json({ success: true, categories })
  }

  if (action === 'get' && id) {
    const idea = ideas.find(i => i.id === id)
    if (!idea) return res.status(404).json({ success: false, error: 'Not found' })
    return res.status(200).json({ success: true, idea })
  }

  if (action === 'trending') {
    return res.status(200).json({
      success: true,
      ideas: ideas.filter(i => i.trending).slice(0, limit)
    })
  }

  if (action === 'random') {
    return res.status(200).json({
      success: true,
      idea: ideas[Math.floor(Math.random() * ideas.length)]
    })
  }

  if (action === 'search' && query) {
    const q = query.toLowerCase()
    const results = ideas.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q))
    )
    return res.status(200).json({ success: true, ideas: results.slice(0, limit) })
  }

  // Default: list all
  let result = [...ideas]
  if (category) {
    result = result.filter(i => i.category.toLowerCase() === category.toLowerCase())
  }
  result.sort((a, b) => b.marketScore - a.marketScore)

  return res.status(200).json({
    success: true,
    count: result.length,
    ideas: result.slice(0, limit)
  })
}
