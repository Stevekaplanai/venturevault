import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Sparkles, TrendingUp, Search, Brain, Zap } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/browse')
    }
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.15),transparent)]" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>100% Free • No Credit Card Required</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Your Vault of{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Million-Dollar Ideas
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Discover validated startup ideas with AI-powered market analysis.
            Browse, research, and launch your next venture with confidence.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-3 mx-auto max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search startup ideas, markets, or keywords..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Explore Ideas
            </Button>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <span><strong>1000+</strong> Curated Ideas</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span><strong>AI-Powered</strong> Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span><strong>Free Forever</strong></span>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-sm">
            <span className="text-muted-foreground">Popular:</span>
            <Link to="/browse?category=AI/ML" className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              AI/ML
            </Link>
            <Link to="/browse?category=SaaS" className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              SaaS
            </Link>
            <Link to="/browse?category=FinTech" className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              FinTech
            </Link>
            <Link to="/trending" className="px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              Trending
            </Link>
          </div>
          </div>

          {/* Right side - Hero image */}
          <div className="hidden lg:block">
            <img
              src="/images/hero.png"
              alt="VentureVault - Unlock Your Next Big Idea"
              className="w-full max-w-lg mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
