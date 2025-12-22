import { Link } from "react-router-dom"
import { Brain, Search, BarChart3, FileText, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const features = [
  {
    icon: Search,
    title: "Market Research",
    description: "Get comprehensive market analysis including TAM, SAM, and SOM calculations with real data.",
  },
  {
    icon: BarChart3,
    title: "Competitor Analysis",
    description: "Identify key competitors, their strengths, weaknesses, and market positioning.",
  },
  {
    icon: Brain,
    title: "Trend Prediction",
    description: "AI-powered forecasting to understand where your market is heading in 2-5 years.",
  },
  {
    icon: FileText,
    title: "Business Model Canvas",
    description: "Auto-generated business model with revenue streams, cost structure, and key metrics.",
  },
]

export function AIResearch() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-purple-50/50 dark:via-purple-950/20 to-background" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm mb-6">
              <Brain className="h-4 w-4 text-purple-500" />
              <span>AI Research Agent</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Deep Market Research in{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Seconds, Not Weeks
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              Our AI Research Agent analyzes thousands of data points from market reports,
              competitor websites, social media, and industry publications to give you
              actionable insights for your startup idea.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/ai-research">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Sparkles className="h-5 w-5" />
                  Try AI Research Free
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline" className="gap-2">
                  Browse Ideas
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-md transition-all duration-300 bg-background/80 backdrop-blur">
                <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                    <feature.icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
