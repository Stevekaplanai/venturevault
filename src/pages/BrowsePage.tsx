import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, Filter, SortAsc, Grid, List } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { IdeaCard } from "../components/IdeaCard"
import { ideas, categories, searchIdeas } from "../data/ideas"

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get("category") || "All"
  const initialQuery = searchParams.get("q") || ""

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [sortBy, setSortBy] = useState<"score" | "trending" | "recent">("score")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredIdeas = useMemo(() => {
    let result = ideas

    // Filter by search query
    if (searchQuery) {
      result = searchIdeas(searchQuery)
    }

    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter((idea) => idea.category === activeCategory)
    }

    // Sort
    return [...result].sort((a, b) => {
      if (sortBy === "trending") {
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0)
      }
      if (sortBy === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return b.marketScore - a.marketScore
    })
  }, [activeCategory, searchQuery, sortBy])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    if (category === "All") {
      searchParams.delete("category")
    } else {
      searchParams.set("category", category)
    }
    setSearchParams(searchParams)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      searchParams.set("q", searchQuery)
    } else {
      searchParams.delete("q")
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Startup Ideas</h1>
          <p className="text-muted-foreground">
            Explore {ideas.length} validated startup ideas with AI-powered market analysis
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search ideas, tags, or keywords..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="flex gap-2">
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
            <Button
              variant={sortBy === "recent" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("recent")}
            >
              Recent
            </Button>
            <div className="hidden md:flex border-l pl-2 gap-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
              {category !== "All" && (
                <span className="ml-1 text-xs opacity-70">
                  ({ideas.filter((i) => i.category === category).length})
                </span>
              )}
            </Badge>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredIdeas.length} of {ideas.length} ideas
          {searchQuery && <span> for "{searchQuery}"</span>}
          {activeCategory !== "All" && <span> in {activeCategory}</span>}
        </div>

        {/* Ideas Grid */}
        {filteredIdeas.length > 0 ? (
          <div className={viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
          }>
            {filteredIdeas.map((idea) => (
              <IdeaCard key={idea.id} {...idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">No ideas found</p>
            <Button onClick={() => {
              setSearchQuery("")
              setActiveCategory("All")
              setSearchParams({})
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
