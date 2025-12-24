import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { Rss, RefreshCw, ExternalLink, Filter, Newspaper, Map, Lightbulb, BookOpen, Search, X, TrendingUp, Clock, Users } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { BlogCard } from "../components/BlogCard"
import { NewsletterSignup } from "../components/NewsletterSignup"
import { blogPosts, blogCategories, getBlogPostsByCategory } from "../data/blog-posts"

interface RSSItem {
  title: string
  link: string
  pubDate: string
  source: string
  description: string
  category: string
}

function getSourceColor(source: string) {
  switch (source) {
    case "TechCrunch":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    case "Product Hunt":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
    case "Hacker News":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
    case "VentureBeat":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    case "Wired":
      return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return "Just now"
}

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [rssItems, setRssItems] = useState<RSSItem[]>([])
  const [isLoadingRSS, setIsLoadingRSS] = useState(true)
  const [rssError, setRssError] = useState<string | null>(null)

  // Filter posts by category and search
  const filteredPosts = useMemo(() => {
    let posts = getBlogPostsByCategory(activeCategory)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.content.toLowerCase().includes(query)
      )
    }

    // Sort by date (newest first)
    return posts.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  }, [activeCategory, searchQuery])

  const featuredPost = blogPosts[0] // Most recent post as featured
  const totalPosts = blogPosts.length

  useEffect(() => {
    fetchRSSFeeds()
  }, [])

  async function fetchRSSFeeds() {
    setIsLoadingRSS(true)
    setRssError(null)
    try {
      const response = await fetch("/api/rss")
      const data = await response.json()
      if (data.success) {
        setRssItems(data.data.slice(0, 12)) // Get top 12 items
      } else {
        setRssError("Failed to load RSS feeds")
      }
    } catch {
      setRssError("Failed to connect to RSS service")
    } finally {
      setIsLoadingRSS(false)
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "roadmap":
        return <Map className="h-4 w-4" />
      case "news":
        return <Newspaper className="h-4 w-4" />
      case "ideas":
        return <Lightbulb className="h-4 w-4" />
      case "tips":
        return <BookOpen className="h-4 w-4" />
      default:
        return <Filter className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              VentureVault Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Insights, Ideas & Updates
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Stay updated with startup trends, product roadmap, and actionable tips for founders.
            </p>

            {/* Blog Stats */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span><strong className="text-foreground">{totalPosts}</strong> Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span><strong className="text-foreground">Weekly</strong> Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span><strong className="text-foreground">1000+</strong> Readers</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles, tips, guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-10 h-12 text-base rounded-full border-2 focus:border-purple-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup variant="hero" source="blog" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Post */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Featured Article</h2>
              <BlogCard post={featuredPost} variant="featured" />
            </section>

            {/* Category Filter Tabs */}
            <section>
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">All Articles</h2>
                  <TabsList className="bg-muted">
                    {blogCategories.map((cat) => (
                      <TabsTrigger key={cat.id} value={cat.id} className="gap-1.5">
                        {getCategoryIcon(cat.id)}
                        <span className="hidden sm:inline">{cat.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {blogCategories.map((cat) => (
                  <TabsContent key={cat.id} value={cat.id} className="mt-0">
                    {filteredPosts.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          {searchQuery ? (
                            <>
                              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                              <p className="text-lg font-medium mb-2">No results for "{searchQuery}"</p>
                              <p className="text-muted-foreground mb-4">Try a different search term or browse by category.</p>
                              <Button variant="outline" onClick={() => setSearchQuery("")}>
                                Clear Search
                              </Button>
                            </>
                          ) : (
                            <p className="text-muted-foreground">No articles in this category yet.</p>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPosts.map((post) => (
                          <BlogCard key={post.id} post={post} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live RSS Feed */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Rss className="h-5 w-5 text-orange-500" />
                    Live Tech News
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchRSSFeeds}
                    disabled={isLoadingRSS}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoadingRSS ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {rssError ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">{rssError}</p>
                    <Button variant="outline" size="sm" onClick={fetchRSSFeeds}>
                      Try Again
                    </Button>
                  </div>
                ) : isLoadingRSS ? (
                  <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-3 bg-muted rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-full mb-1"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {rssItems.map((item, index) => (
                      <a
                        key={`${item.link}-${index}`}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <div className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${getSourceColor(item.source)} text-xs`}>
                              {item.source}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(item.pubDate)}
                            </span>
                          </div>
                          <h4 className="font-medium text-sm leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground group-hover:text-purple-600">
                            <ExternalLink className="h-3 w-3" />
                            Read more
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Link
                    to="/browse"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">Browse Ideas</span>
                    <Badge variant="secondary">Free</Badge>
                  </Link>
                  <Link
                    to="/ai-research"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">AI Research Tool</span>
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      New
                    </Badge>
                  </Link>
                  <Link
                    to="/roadmap"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">Product Roadmap</span>
                    <Badge variant="outline">2025</Badge>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Card */}
            <NewsletterSignup variant="card" source="blog-sidebar" />
          </div>
        </div>
      </div>
    </div>
  )
}
