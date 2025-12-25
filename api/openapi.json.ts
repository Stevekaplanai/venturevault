import type { VercelRequest, VercelResponse } from '@vercel/node'

const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "VentureVault Startup Ideas API",
    description: "Access curated startup ideas with AI-powered market analysis. Search, filter, and explore validated startup opportunities for entrepreneurs, investors, and innovators. Authenticate via OAuth to access saved ideas.",
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
        description: "OAuth 2.0 authorization code flow for accessing VentureVault API",
        flows: {
          authorizationCode: {
            authorizationUrl: "https://venturevault.space/api/oauth/authorize",
            tokenUrl: "https://venturevault.space/api/oauth/token",
            scopes: {
              read: "Read access to startup ideas and market analysis",
              saved: "Access to user's saved ideas"
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
        operationId: "getStartupIdeas",
        summary: "Get startup ideas with filtering options",
        description: "Retrieve curated startup ideas with AI-powered market analysis. Filter by category, search by keywords, get trending ideas, or explore random opportunities. Use action=saved to get authenticated user's saved ideas.",
        security: [{ oauth2: ["read"] }],
        parameters: [
          {
            name: "action",
            in: "query",
            description: "The action to perform",
            required: false,
            schema: {
              type: "string",
              enum: ["list", "search", "get", "categories", "trending", "random", "saved"],
              default: "list"
            }
          },
          {
            name: "category",
            in: "query",
            description: "Filter by category (FinTech, EdTech, HR Tech, Creator Economy, Pet Tech, E-Commerce, Local Services, HealthTech, PropTech, FoodTech)",
            required: false,
            schema: { type: "string" }
          },
          {
            name: "q",
            in: "query",
            description: "Search query to find ideas by title, description, tags, or category",
            required: false,
            schema: { type: "string" }
          },
          {
            name: "id",
            in: "query",
            description: "Specific idea ID to retrieve (use with action=get)",
            required: false,
            schema: { type: "string" }
          },
          {
            name: "limit",
            in: "query",
            description: "Maximum number of ideas to return",
            required: false,
            schema: { type: "integer", default: 10, maximum: 50 }
          }
        ],
        responses: {
          "200": {
            description: "Successful response with startup ideas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", description: "Whether the request was successful" },
                    authenticated: { type: "boolean", description: "Whether the request is authenticated" },
                    count: { type: "integer", description: "Number of ideas returned" },
                    total: { type: "integer", description: "Total number of ideas available" },
                    categories: {
                      type: "array",
                      items: { type: "string" },
                      description: "Available categories"
                    },
                    ideas: {
                      type: "array",
                      description: "List of startup ideas",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "Unique identifier for the idea" },
                          title: { type: "string", description: "Name of the startup idea" },
                          description: { type: "string", description: "Brief description of the idea" },
                          category: { type: "string", description: "Business category" },
                          marketScore: {
                            type: "integer",
                            description: "AI-calculated market viability score (0-100)",
                            minimum: 0,
                            maximum: 100
                          },
                          competitionLevel: {
                            type: "string",
                            enum: ["Low", "Medium", "High"],
                            description: "Level of market competition"
                          },
                          potentialRevenue: { type: "string", description: "Estimated revenue potential" },
                          trending: { type: "boolean", description: "Whether the idea is currently trending" },
                          tags: {
                            type: "array",
                            items: { type: "string" },
                            description: "Relevant tags for the idea"
                          },
                          targetAudience: { type: "string", description: "Primary target market" },
                          problemSolved: { type: "string", description: "The problem this idea addresses" },
                          marketSize: { type: "string", description: "Total addressable market size" },
                          growthRate: { type: "string", description: "Market growth rate (CAGR)" },
                          timeToMVP: { type: "string", description: "Estimated time to build MVP" },
                          initialInvestment: { type: "string", description: "Estimated initial investment needed" }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            description: "Unauthorized - Invalid or missing token",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    error: { type: "string" },
                    error_description: { type: "string" }
                  }
                }
              }
            }
          },
          "404": {
            description: "Idea not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    error: { type: "string" }
                  }
                }
              }
            }
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Content-Type', 'application/json')

  return res.status(200).json(openApiSpec)
}
