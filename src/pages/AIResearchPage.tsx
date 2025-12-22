import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Brain, Search, BarChart3, FileText, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

const features = [
  {
    icon: Search,
    title: "Market Research",
    description: "Get comprehensive market analysis including TAM, SAM, and SOM calculations with real data sources.",
    prompt: "Analyze the market size and opportunity for ",
    placeholder: "e.g., AI-powered legal tech solutions",
  },
  {
    icon: BarChart3,
    title: "Competitor Analysis",
    description: "Identify key competitors, analyze their strengths and weaknesses, and find market gaps.",
    prompt: "Compare and analyze competitors in the ",
    placeholder: "e.g., project management software space",
  },
  {
    icon: Brain,
    title: "Trend Prediction",
    description: "AI-powered forecasting to understand where your market is heading in 2-5 years.",
    prompt: "Predict trends and future outlook for ",
    placeholder: "e.g., sustainable fashion marketplace",
  },
  {
    icon: FileText,
    title: "Business Model Canvas",
    description: "Auto-generated business model with revenue streams, cost structure, and key metrics.",
    prompt: "Generate a business model canvas for ",
    placeholder: "e.g., B2B SaaS analytics platform",
  },
]

const exampleQueries = [
  "Analyze the market for AI-powered legal tech solutions",
  "Compare Notion vs Coda vs Roam for knowledge management",
  "What's the TAM for remote team collaboration tools?",
  "Find gaps in the sustainable fashion marketplace",
]

export function AIResearchPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  // Pre-fill query from URL parameter (e.g., from "Start Building This" button)
  useEffect(() => {
    const ideaParam = searchParams.get("idea")
    if (ideaParam) {
      setQuery(`How do I build a startup for: ${ideaParam}`)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setResult(null)

    try {
      // Use the Vercel serverless function endpoint
      const apiUrl = import.meta.env.PROD
        ? '/api/ai-research'
        : 'http://localhost:3000/api/ai-research'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to generate analysis')
      }

      const data = await response.json()

      if (data.success && data.data?.analysis) {
        setResult(data.data.analysis)
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (error) {
      console.error('AI Research Error:', error)
      // Fallback to demo analysis if API fails
      setResult(`## Market Analysis: ${query}

### Market Overview
Based on our AI analysis, this market shows strong growth potential with an estimated CAGR of 24.5% through 2028.

### Key Findings
- **Total Addressable Market (TAM):** $8.5 Billion
- **Serviceable Available Market (SAM):** $2.1 Billion
- **Serviceable Obtainable Market (SOM):** $210 Million

### Competitive Landscape
We identified 12 major players in this space, with the top 3 controlling approximately 45% of market share.

### Growth Drivers
1. Increasing demand for automation solutions
2. Rising adoption of AI technologies
3. Growing need for cost optimization
4. Remote work acceleration

### Recommendations
Focus on underserved segments with high growth potential. Consider a freemium model to capture market share quickly.

*Note: This is fallback demo data. The AI service will be fully functional after deployment.*`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm mb-6">
              <Brain className="h-4 w-4 text-purple-500" />
              <span>AI-Powered Research</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Deep Market Research in{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Seconds
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8">
              Our AI Research Agent analyzes thousands of data points to give you
              actionable insights for your startup idea. No more weeks of manual research.
            </p>
          </div>

          <div className="hidden lg:block">
            <img
              src="/images/ai-research.png"
              alt="AI Research Analytics"
              className="w-full max-w-md mx-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Search Form Section */}
        <div className="text-center mb-12">

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Describe your startup idea or market to research..."
                  className="pl-10 h-12"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
                    Research
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Example Queries */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="text-sm text-muted-foreground">Try:</span>
            {exampleQueries.map((example) => (
              <Badge
                key={example}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
                onClick={() => setQuery(example)}
              >
                {example}
              </Badge>
            ))}
          </div>
        </div>

        {/* Result */}
        {result && (
          <Card className="max-w-3xl mx-auto mb-12 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                AI Research Results
              </CardTitle>
              <CardDescription>Analysis completed in 2.3 seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br>').replace(/##/g, '<h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features - Clickable Research Types */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer"
              onClick={() => {
                setQuery(feature.prompt)
                window.scrollTo({ top: 0, behavior: 'smooth' })
                // Focus the input after scrolling
                setTimeout(() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement
                  if (input) {
                    input.focus()
                    input.setSelectionRange(input.value.length, input.value.length)
                  }
                }, 300)
              }}
            >
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors group-hover:scale-110">
                  <feature.icon className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-base group-hover:text-purple-600 transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
                <p className="text-xs text-purple-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to try → {feature.placeholder}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-2xl p-12">
          <h2 className="text-2xl font-bold mb-4">Ready for Unlimited Research?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Get unlimited AI-powered market research, competitor analysis, and business insights.
            All completely free on VentureVault.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Free Research
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setQuery("Analyze the market opportunity for AI-powered productivity tools")
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              View Sample Report
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
