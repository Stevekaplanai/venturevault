import { useState, useEffect } from "react"
import { Rss, TrendingUp, Sparkles, ExternalLink, RefreshCw, Search, Filter, Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import {
  fetchAllRSSFeeds,
  fetchTrendingTopics,
  formatDate,
  type RSSItem,
  type TrendingTopic
} from "../services/rssService"

export function DiscoverPage() {
  const [rssItems, setRssItems] = useState<RSSItem[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSource, setSelectedSource] = useState<string | null>(null)

  const sources = [...new Set(rssItems.map(item => item.source))]

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const [feeds, trends] = await Promise.all([
        fetchAllRSSFeeds(),
        fetchTrendingTopics()
      ])
      setRssItems(feeds)
      setTrendingTopics(trends)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true)
    await loadData()
    setIsRefreshing(false)
  }

  const filteredItems = rssItems.filter(item => {
    const matchesSearch = searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = selectedSource === null || item.source === selectedSource
    return matchesSearch && matchesSource
  })

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm mb-6">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Real-Time Discovery</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                What's Trending
              </span>
            </h1>

            <p className="text-lg text-muted-foreground">
              Stay ahead of the curve with real-time RSS feeds from top tech sources
              and trending startup topics powered by search data.
            </p>
          </div>
          <div className="hidden md:flex justify-center">
            <img
              src="/images/discover.png"
              alt="Discover trending topics and news"
              className="w-full max-w-md rounded-2xl shadow-lg"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* RSS Feeds - Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rss className="h-5 w-5 text-orange-500" />
                    <CardTitle>Live RSS Feeds</CardTitle>
                    <Badge variant="outline">{filteredItems.length} articles</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                <CardDescription>
                  Aggregated news from TechCrunch, Product Hunt, Hacker News, and more
                </CardDescription>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search articles..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={selectedSource === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSource(null)}
                    >
                      All
                    </Button>
                    {sources.map(source => (
                      <Button
                        key={source}
                        variant={selectedSource === source ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSource(source)}
                      >
                        {source}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    <span className="ml-3 text-muted-foreground">Loading feeds...</span>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No articles found. Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredItems.slice(0, 20).map((item, index) => (
                      <a
                        key={`${item.source}-${index}`}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.source}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(item.pubDate)}
                              </span>
                            </div>
                            <h3 className="font-medium group-hover:text-purple-600 transition-colors">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Trending Topics Sidebar */}
          <div className="space-y-6">
            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <CardTitle>Trending Topics</CardTitle>
                </div>
                <CardDescription>
                  Hot startup topics based on search trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trendingTopics.map((topic, index) => (
                      <div
                        key={topic.term}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-purple-500">
                            #{index + 1}
                          </span>
                          <span className="font-medium">{topic.term}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Badge variant="outline" className="text-xs">
                            {topic.category}
                          </Badge>
                          <span>{topic.traffic}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {topic.relatedQueries.slice(0, 3).map(query => (
                            <Badge key={query} variant="secondary" className="text-xs">
                              {query}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Ideas from Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Startup Ideas from Trends</CardTitle>
                <CardDescription>
                  AI-suggested ideas based on current trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-dashed border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/20">
                    <p className="text-sm font-medium">AI Agent Marketplace</p>
                    <p className="text-xs text-muted-foreground">
                      Platform to discover, compare, and deploy AI agents
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-dashed border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/20">
                    <p className="text-sm font-medium">MCP Server Directory</p>
                    <p className="text-xs text-muted-foreground">
                      Central hub for Model Context Protocol servers
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-dashed border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/20">
                    <p className="text-sm font-medium">Voice Clone SaaS</p>
                    <p className="text-xs text-muted-foreground">
                      B2B voice cloning for podcasters and content creators
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
