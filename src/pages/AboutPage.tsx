import { Link } from "react-router-dom"
import { Vault, Target, Users, Zap, Heart, Globe, Sparkles } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

const values = [
  {
    icon: Heart,
    title: "Free Forever",
    description: "We believe startup validation tools should be accessible to everyone, not just those who can afford expensive subscriptions."
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "Leverage cutting-edge AI to analyze markets, competitors, and opportunities in seconds instead of weeks."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built by entrepreneurs, for entrepreneurs. Our community contributes ideas and insights to help everyone succeed."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Ideas from around the world, analyzed with global market data to help you find opportunities anywhere."
  },
]

const stats = [
  { value: "50+", label: "Validated Ideas" },
  { value: "1000+", label: "Entrepreneurs" },
  { value: "100%", label: "Free" },
  { value: "24/7", label: "AI Research" },
]

export function AboutPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm mb-6">
            <Vault className="h-4 w-4 text-purple-500" />
            <span>About VentureVault</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Democratizing{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Startup Discovery
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            VentureVault was created with a simple mission: make startup idea validation
            accessible to everyone, everywhere, for free.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              We started VentureVault because we saw a problem: aspiring entrepreneurs were
              spending weeks or months researching ideas, only to find out they weren't viable.
              Meanwhile, expensive market research tools were out of reach for most people.
            </p>
            <p className="text-muted-foreground mb-4">
              Our solution? Build a comprehensive startup idea database with AI-powered
              research tools - and make it completely free. No credit card required, no
              premium tiers, no hidden fees. Just pure value for entrepreneurs.
            </p>
            <p className="text-muted-foreground">
              We believe the next great startup could come from anywhere - a college dorm,
              a coffee shop, or a small town. VentureVault is here to help that founder
              validate their idea and take the leap.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl p-8 flex items-center justify-center">
            <div className="text-center">
              <Vault className="h-24 w-24 text-purple-600 mx-auto mb-4" />
              <p className="text-2xl font-bold">VentureVault.space</p>
              <p className="text-muted-foreground">Free Forever</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-2xl p-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Find Your Next Big Idea?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of entrepreneurs using VentureVault to discover and validate
            startup ideas. 100% free, forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Browse Ideas
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
