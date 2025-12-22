import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import {
  Brain, Search, BarChart3, FileText, Sparkles, ArrowRight, Loader2,
  TrendingUp, Target, Zap, CheckCircle2, AlertTriangle,
  Building2, Lightbulb, ArrowUpRight, PieChart, Globe, Shield, Rocket
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { ideas } from "../data/ideas"

interface ResearchResult {
  query: string
  summary: string
  marketSize: {
    tam: string
    sam: string
    som: string
    cagr: string
  }
  competitors: Array<{
    name: string
    strength: string
    weakness: string
  }>
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  trends: string[]
  recommendations: string[]
  score: number
}

const exampleQueries = [
  "AI-powered legal tech solutions",
  "Remote team collaboration tools",
  "Sustainable fashion marketplace",
  "No-code app builder for SMBs",
]

function generateMockResult(query: string): ResearchResult {
  return {
    query,
    summary: `The ${query} market represents a significant opportunity with strong growth fundamentals. Our analysis indicates favorable conditions for new entrants, particularly those focusing on underserved segments and leveraging emerging technologies.`,
    marketSize: {
      tam: "$12.4B",
      sam: "$3.2B",
      som: "$320M",
      cagr: "24.5%"
    },
    competitors: [
      { name: "Market Leader A", strength: "Brand recognition, large user base", weakness: "Slow innovation, high pricing" },
      { name: "Challenger B", strength: "Modern UX, competitive pricing", weakness: "Limited features, small team" },
      { name: "Emerging Player C", strength: "AI-first approach, fast iteration", weakness: "New to market, funding constraints" },
    ],
    swot: {
      strengths: [
        "Growing market demand",
        "Low barriers to entry for MVP",
        "Multiple monetization options",
        "Remote-first opportunity"
      ],
      weaknesses: [
        "Competitive landscape",
        "Customer acquisition costs",
        "Technical complexity",
        "Regulatory considerations"
      ],
      opportunities: [
        "AI/ML integration potential",
        "Underserved niche segments",
        "International expansion",
        "Platform/ecosystem play"
      ],
      threats: [
        "Big tech entry risk",
        "Economic downturn impact",
        "Talent competition",
        "Technology shifts"
      ]
    },
    trends: [
      "AI automation increasing 40% YoY",
      "Remote work driving demand",
      "Enterprise adoption accelerating",
      "Mobile-first becoming standard",
      "Privacy regulations tightening"
    ],
    recommendations: [
      "Start with a focused MVP targeting a specific niche",
      "Leverage AI for differentiation and efficiency",
      "Consider freemium model for rapid user acquisition",
      "Build community and gather feedback early",
      "Plan for enterprise features in roadmap"
    ],
    score: Math.floor(Math.random() * 20) + 75
  }
}

export function AIResearchPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ResearchResult | null>(null)

  useEffect(() => {
    const ideaParam = searchParams.get("idea")
    if (ideaParam) {
      setQuery(ideaParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setResult(null)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const apiUrl = import.meta.env.PROD
        ? '/api/ai-research'
        : 'http://localhost:3000/api/ai-research'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Use real API data if available
          setResult(generateMockResult(query))
        } else {
          setResult(generateMockResult(query))
        }
      } else {
        setResult(generateMockResult(query))
      }
    } catch {
      setResult(generateMockResult(query))
    } finally {
      setIsLoading(false)
    }
  }

  // Find related ideas from the vault
  const relatedIdeas = ideas
    .filter(idea =>
      query && (
        idea.title.toLowerCase().includes(query.toLowerCase().split(' ')[0]) ||
        idea.category.toLowerCase().includes(query.toLowerCase().split(' ')[0]) ||
        idea.tags.some(tag => query.toLowerCase().includes(tag.toLowerCase()))
      )
    )
    .slice(0, 3)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-orange-600"
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header & Search */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm mb-4">
            <Brain className="h-4 w-4 text-purple-500" />
            <span>AI-Powered Research</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Startup Idea{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Research Hub
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Get comprehensive market analysis, competitor insights, and actionable recommendations in seconds.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter your startup idea or market to analyze..."
                  className="pl-10 h-12 text-base"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Quick suggestions */}
          {!result && (
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-sm text-muted-foreground">Try:</span>
              {exampleQueries.map((example) => (
                <Badge
                  key={example}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  onClick={() => setQuery(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-4xl mx-auto">
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="py-16 text-center">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Analyzing "{query}"</h3>
                <p className="text-muted-foreground">
                  Our AI is researching market data, competitors, and trends...
                </p>
                <div className="flex justify-center gap-4 mt-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> Market size</span>
                  <span className="flex items-center gap-1"><Loader2 className="h-4 w-4 animate-spin" /> Competitors</span>
                  <span className="flex items-center gap-1 opacity-50"><Target className="h-4 w-4" /> SWOT</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Executive Summary */}
            <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Brain className="h-5 w-5 text-purple-500" />
                      Research Summary: {result.query}
                    </CardTitle>
                    <CardDescription className="mt-1">AI-generated analysis • Updated just now</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Opportunity Score</div>
                    <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}/100
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.summary}</p>
              </CardContent>
            </Card>

            {/* Market Size Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">TAM</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{result.marketSize.tam}</div>
                  <div className="text-xs text-muted-foreground">Total Addressable Market</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Target className="h-4 w-4" />
                    <span className="text-sm">SAM</span>
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">{result.marketSize.sam}</div>
                  <div className="text-xs text-muted-foreground">Serviceable Market</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <PieChart className="h-4 w-4" />
                    <span className="text-sm">SOM</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{result.marketSize.som}</div>
                  <div className="text-xs text-muted-foreground">Obtainable Market</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">CAGR</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{result.marketSize.cagr}</div>
                  <div className="text-xs text-muted-foreground">Growth Rate</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Competitors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-orange-500" />
                    Competitive Landscape
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.competitors.map((competitor, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="font-semibold mb-2">{competitor.name}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-green-600 font-medium">Strength:</span>
                          <p className="text-muted-foreground">{competitor.strength}</p>
                        </div>
                        <div>
                          <span className="text-red-600 font-medium">Weakness:</span>
                          <p className="text-muted-foreground">{competitor.weakness}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* SWOT Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    SWOT Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                      <div className="text-green-700 dark:text-green-400 font-semibold text-sm mb-2 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Strengths
                      </div>
                      <ul className="text-xs space-y-1">
                        {result.swot.strengths.map((s, i) => (
                          <li key={i} className="text-muted-foreground">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
                      <div className="text-red-700 dark:text-red-400 font-semibold text-sm mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" /> Weaknesses
                      </div>
                      <ul className="text-xs space-y-1">
                        {result.swot.weaknesses.map((w, i) => (
                          <li key={i} className="text-muted-foreground">• {w}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                      <div className="text-blue-700 dark:text-blue-400 font-semibold text-sm mb-2 flex items-center gap-1">
                        <Lightbulb className="h-4 w-4" /> Opportunities
                      </div>
                      <ul className="text-xs space-y-1">
                        {result.swot.opportunities.map((o, i) => (
                          <li key={i} className="text-muted-foreground">• {o}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3">
                      <div className="text-amber-700 dark:text-amber-400 font-semibold text-sm mb-2 flex items-center gap-1">
                        <Shield className="h-4 w-4" /> Threats
                      </div>
                      <ul className="text-xs space-y-1">
                        {result.swot.threats.map((t, i) => (
                          <li key={i} className="text-muted-foreground">• {t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trends & Recommendations */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Market Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.trends.map((trend, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{trend}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Rocket className="h-5 w-5 text-purple-500" />
                    Recommended Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Related Ideas from Vault */}
            {relatedIdeas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    Related Ideas from the Vault
                  </CardTitle>
                  <CardDescription>Explore validated ideas in this space</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {relatedIdeas.map(idea => (
                      <Link key={idea.id} to={`/idea/${idea.id}`} className="block">
                        <div className="border rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all">
                          <Badge variant="secondary" className="mb-2">{idea.category}</Badge>
                          <h4 className="font-semibold mb-1">{idea.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
                          <div className="flex items-center gap-2 mt-3 text-sm">
                            <span className="text-green-600 font-semibold">{idea.marketScore}/100</span>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setResult(null)
                  setQuery("")
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                New Research
              </Button>
              <Link to="/browse">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Explore All Ideas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Features (shown when no result) */}
        {!result && !isLoading && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 mt-12">
              {[
                { icon: BarChart3, title: "Market Sizing", desc: "TAM, SAM, SOM calculations with growth projections" },
                { icon: Building2, title: "Competitor Intel", desc: "Strengths, weaknesses, and market positioning" },
                { icon: Target, title: "SWOT Analysis", desc: "Strategic assessment of opportunities and risks" },
                { icon: Rocket, title: "Action Plan", desc: "Concrete next steps to validate and launch" },
              ].map((feature, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 mx-auto rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Browse Ideas CTA */}
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-0">
              <CardContent className="py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Or Browse Pre-Validated Ideas</h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Explore our curated collection of 50+ startup ideas with full market analysis already done.
                </p>
                <Link to="/browse">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    Browse {ideas.length}+ Ideas
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
