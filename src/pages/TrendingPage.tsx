import { Zap, TrendingUp, Flame } from "lucide-react"
import { Badge } from "../components/ui/badge"
import { IdeaCard } from "../components/IdeaCard"
import { getTrendingIdeas, getTopRatedIdeas } from "../data/ideas"

export function TrendingPage() {
  const trendingIdeas = getTrendingIdeas()
  const topRatedIdeas = getTopRatedIdeas(6)

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-4 py-1.5 text-sm mb-4">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>Updated Daily</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Trending Startup Ideas</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Discover the hottest startup ideas that are gaining traction in the market right now.
              These ideas are seeing increased interest and have strong growth potential.
            </p>
          </div>
          <div className="hidden lg:block">
            <img
              src="/images/trending.png"
              alt="Trending Ideas - Growth, Momentum, Innovation"
              className="w-full max-w-md mx-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Trending Ideas */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Hot Right Now</h2>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
              {trendingIdeas.length} Trending
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingIdeas.map((idea) => (
              <IdeaCard key={idea.id} {...idea} />
            ))}
          </div>
        </section>

        {/* Top Rated */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-bold">Highest Rated Ideas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRatedIdeas.map((idea) => (
              <IdeaCard key={idea.id} {...idea} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
