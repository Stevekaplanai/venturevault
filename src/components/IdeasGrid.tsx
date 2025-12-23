import { useState } from "react"
import { Link } from "react-router-dom"
import { Filter, SortAsc, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { IdeaCard } from "./IdeaCard"
import { ideas, categories } from "../data/ideas"

export function IdeasGrid() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [sortBy, setSortBy] = useState<"score" | "trending">("score")

  const filteredIdeas = ideas
    .filter((idea) => activeCategory === "All" || idea.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "trending") {
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0)
      }
      return b.marketScore - a.marketScore
    })
    .slice(0, 6) // Show only 6 on homepage

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Explore Startup Ideas</h2>
            <p className="text-muted-foreground">
              Browse validated ideas with AI-powered market analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={sortBy === "score" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("score")}
            >
              <SortAsc className="h-4 w-4 mr-1" />
              Top Rated
            </Button>
            <Button
              variant={sortBy === "trending" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("trending")}
            >
              <Filter className="h-4 w-4 mr-1" />
              Trending
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <IdeaCard key={idea.id} {...idea} />
          ))}
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <Link to="/browse">
            <Button variant="outline" size="lg" className="gap-2">
              View All Ideas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
