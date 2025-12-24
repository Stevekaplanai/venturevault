import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Linkedin, Copy, Check, Lightbulb, Target, TrendingUp, Rocket, Info, CheckCircle2, AlertCircle, BookOpen, Zap } from "lucide-react"
import React, { useState, useEffect, useRef } from "react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { BlogCard } from "../components/BlogCard"
import { NewsletterSignup } from "../components/NewsletterSignup"
import { getBlogPostBySlug, getRelatedPosts } from "../data/blog-posts"

// Inline CTA Component for mid-article signups
function InlineNewsletterCTA({ variant = "default" }: { variant?: "default" | "tip" | "minimal" }) {
  if (variant === "minimal") {
    return (
      <div className="my-8 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-sm shrink-0">
            <Rocket className="h-5 w-5 text-purple-500" />
            <span className="font-medium">Get ideas like this daily</span>
          </div>
          <div className="flex-1 w-full">
            <NewsletterSignup variant="compact" source="blog-inline-minimal" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === "tip") {
    return (
      <div className="my-10 relative">
        <div className="absolute -top-4 left-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 z-10">
          <Zap className="h-3 w-3" />
          Pro Tip
        </div>
        <div className="p-6 pt-8 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border-2 border-purple-200 dark:border-purple-800">
          <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Want More Startup Ideas?
          </h4>
          <p className="text-muted-foreground mb-4 text-sm">
            Join 1,000+ founders getting curated startup ideas with market analysis, customer personas, and 90-day playbooks delivered daily.
          </p>
          <NewsletterSignup variant="compact" source="blog-inline-tip" />
        </div>
      </div>
    )
  }

  return (
    <div className="my-10 p-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Ready to Find Your Next Big Idea?
          </h4>
          <p className="text-purple-100 text-sm">
            Get validated startup ideas delivered to your inbox every morning. Free forever.
          </p>
        </div>
        <div className="w-full md:w-auto md:min-w-[300px]">
          <NewsletterSignup variant="inline" source="blog-inline-default" />
        </div>
      </div>
    </div>
  )
}

// Visual callout components
function KeyTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-l-4 border-green-500">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-green-700 dark:text-green-300 text-sm uppercase tracking-wide">Key Takeaway</span>
          <div className="mt-1 text-green-800 dark:text-green-200">{children}</div>
        </div>
      </div>
    </div>
  )
}

// Reserved for future use - can be triggered by special markdown patterns
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _ProTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 p-5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-l-4 border-amber-500">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-amber-700 dark:text-amber-300 text-sm uppercase tracking-wide">Pro Tip</span>
          <div className="mt-1 text-amber-800 dark:text-amber-200">{children}</div>
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-l-4 border-blue-500">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-blue-800 dark:text-blue-200">{children}</div>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 p-5 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-l-4 border-red-500">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-red-700 dark:text-red-300 text-sm uppercase tracking-wide">Important</span>
          <div className="mt-1 text-red-800 dark:text-red-200">{children}</div>
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _StatCard({ stat, label }: { stat: string, label: string }) {
  return (
    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800">
      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{stat}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

function getCategoryColor(category: string) {
  switch (category) {
    case "roadmap":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    case "news":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    case "ideas":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
    case "tips":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
  }
}

function getCategoryLabel(category: string) {
  switch (category) {
    case "roadmap":
      return "Roadmap"
    case "news":
      return "News"
    case "ideas":
      return "Ideas"
    case "tips":
      return "Tips & Guides"
    default:
      return category
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  })
}

// Enhanced markdown renderer with better formatting, tables, blockquotes, and inline CTAs
function renderMarkdown(content: string, _slug: string) {
  const lines = content.split('\n')
  const elements: React.ReactElement[] = []
  let currentList: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let currentTable: string[][] = []
  let inTable = false
  let key = 0
  let h2Count = 0 // Track h2 headings for CTA insertion
  let blockquoteLines: string[] = []

  const flushBlockquote = () => {
    if (blockquoteLines.length > 0) {
      elements.push(
        <blockquote key={key++} className="my-6 pl-6 border-l-4 border-purple-400 italic text-muted-foreground bg-purple-50/50 dark:bg-purple-950/20 py-4 pr-4 rounded-r-lg">
          {blockquoteLines.map((line, i) => (
            <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: processInline(line) }} />
          ))}
        </blockquote>
      )
      blockquoteLines = []
    }
  }

  const flushList = () => {
    if (currentList.length > 0 && listType) {
      if (listType === 'ul') {
        elements.push(
          <ul key={key++} className="my-6 space-y-3 text-muted-foreground">
            {currentList.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: processInline(item) }} />
              </li>
            ))}
          </ul>
        )
      } else {
        elements.push(
          <ol key={key++} className="my-6 space-y-3 text-muted-foreground counter-reset-item">
            {currentList.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold shrink-0">{i + 1}</span>
                <span className="pt-0.5" dangerouslySetInnerHTML={{ __html: processInline(item) }} />
              </li>
            ))}
          </ol>
        )
      }
      currentList = []
      listType = null
    }
  }

  const flushTable = () => {
    if (currentTable.length > 1) {
      const headers = currentTable[0]
      const rows = currentTable.slice(1).filter(row => !row.every(cell => cell.match(/^[-|:]+$/)))

      elements.push(
        <div key={key++} className="my-8 overflow-x-auto rounded-xl border border-purple-200 dark:border-purple-800">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50">
              <tr>
                {headers.map((header, i) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold text-purple-900 dark:text-purple-100 border-b border-purple-200 dark:border-purple-800">
                    {header.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 dark:divide-purple-900">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-muted-foreground" dangerouslySetInnerHTML={{ __html: processInline(cell.trim()) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      currentTable = []
      inTable = false
    }
  }

  const processInline = (text: string) => {
    return text
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-600 hover:text-purple-700 underline underline-offset-2 transition-colors">$1</a>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-mono">$1</code>')
      // Market size pattern
      .replace(/\*\*Market Size\*\*:\s*(\$[\d.]+[BMK])/g, '<span class="inline-flex items-center gap-1"><strong class="font-semibold text-foreground">Market Size</strong>: <span class="font-bold text-green-600 dark:text-green-400">$1</span></span>')
  }

  // Insert newsletter CTA helper
  const maybeInsertCTA = () => {
    if (h2Count === 2) {
      elements.push(<InlineNewsletterCTA key={`cta-${key++}`} variant="tip" />)
    } else if (h2Count === 4) {
      elements.push(<InlineNewsletterCTA key={`cta-${key++}`} variant="default" />)
    } else if (h2Count === 6) {
      elements.push(<InlineNewsletterCTA key={`cta-${key++}`} variant="minimal" />)
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Blockquote
    if (line.startsWith('> ')) {
      flushList()
      flushTable()
      blockquoteLines.push(line.slice(2))
      continue
    } else if (blockquoteLines.length > 0) {
      flushBlockquote()
    }

    // Table detection
    if (line.includes('|') && line.trim().startsWith('|')) {
      flushList()
      const cells = line.split('|').slice(1, -1)
      if (!inTable) {
        inTable = true
      }
      currentTable.push(cells)
      continue
    } else if (inTable) {
      flushTable()
    }

    // Headers
    if (line.startsWith('# ')) {
      flushList()
      elements.push(
        <h1 key={key++} className="text-3xl md:text-4xl font-bold mt-10 mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{line.slice(2)}</h1>
      )
    } else if (line.startsWith('## ')) {
      flushList()
      h2Count++
      maybeInsertCTA()

      elements.push(
        <div key={key++} className="mt-12 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-purple-500 to-indigo-500" />
            <h2 className="text-2xl font-bold">{line.slice(3)}</h2>
          </div>
          <div className="h-px bg-gradient-to-r from-purple-200 via-indigo-200 to-transparent dark:from-purple-800 dark:via-indigo-800" />
        </div>
      )
    } else if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={key++} className="text-xl font-semibold mt-8 mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-500" />
          {line.slice(4)}
        </h3>
      )
    }
    // Unordered list
    else if (line.startsWith('- ')) {
      if (listType !== 'ul') flushList()
      listType = 'ul'
      currentList.push(line.slice(2))
    }
    // Ordered list
    else if (/^\d+\.\s/.test(line)) {
      if (listType !== 'ol') flushList()
      listType = 'ol'
      currentList.push(line.replace(/^\d+\.\s/, ''))
    }
    // Horizontal rule
    else if (line.match(/^[-*_]{3,}$/)) {
      flushList()
      elements.push(
        <div key={key++} className="my-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-purple-700" />
          <TrendingUp className="h-5 w-5 text-purple-400" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-purple-700" />
        </div>
      )
    }
    // Empty line
    else if (line.trim() === '') {
      flushList()
    }
    // Regular paragraph
    else {
      flushList()

      // Check for special patterns
      const marketSizeMatch = line.match(/^\*\*Market Size\*\*:\s*(.+)/)
      if (marketSizeMatch) {
        elements.push(
          <div key={key++} className="my-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-700 dark:text-green-300">Market Size:</span>
            <span className="font-bold text-green-600 dark:text-green-400">{marketSizeMatch[1]}</span>
          </div>
        )
        continue
      }

      // Check for "Remember:" or "Note:" patterns
      if (line.startsWith('**Remember**:') || line.startsWith('Remember:')) {
        elements.push(
          <KeyTakeaway key={key++}>
            <span dangerouslySetInnerHTML={{ __html: processInline(line.replace(/^\*\*Remember\*\*:|^Remember:/, '').trim()) }} />
          </KeyTakeaway>
        )
        continue
      }

      elements.push(
        <p
          key={key++}
          className="text-muted-foreground my-4 leading-relaxed text-base md:text-lg"
          dangerouslySetInnerHTML={{ __html: processInline(line) }}
        />
      )
    }
  }

  flushList()
  flushTable()
  flushBlockquote()

  return elements
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const articleRef = useRef<HTMLElement>(null)

  const post = slug ? getBlogPostBySlug(slug) : undefined
  const relatedPosts = slug ? getRelatedPosts(slug, 3) : []

  // Reading progress tracking
  useEffect(() => {
    const updateProgress = () => {
      if (!articleRef.current) return

      const articleTop = articleRef.current.offsetTop
      const articleHeight = articleRef.current.offsetHeight
      const windowHeight = window.innerHeight
      const scrollTop = window.scrollY

      // Calculate progress based on how much of the article has been scrolled through
      const progress = Math.min(
        Math.max(
          ((scrollTop - articleTop + windowHeight * 0.3) / articleHeight) * 100,
          0
        ),
        100
      )

      setReadingProgress(progress)
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress() // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress)
  }, [post])

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The article you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate("/blog")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
      </div>
    )
  }

  const shareUrl = `https://venturevault.space/blog/${post.slug}`
  const shareText = `${post.title} - VentureVault`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error("Failed to copy")
    }
  }

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    )
  }

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    )
  }

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Featured Image Header */}
      {post.featuredImage && (
        <section className="relative">
          <div className="aspect-[21/9] md:aspect-[3/1] overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        </section>
      )}

      {/* Article Header */}
      <section className={`bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background ${post.featuredImage ? 'py-8 -mt-20 relative z-10' : 'py-12'}`}>
        <div className="container mx-auto px-4">
          <div className={`max-w-3xl mx-auto ${post.featuredImage ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl' : ''}`}>
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6 -ml-2"
              onClick={() => navigate("/blog")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>

            {/* Category & Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className={getCategoryColor(post.category)}>
                {getCategoryLabel(post.category)}
              </Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                <Share2 className="h-4 w-4 inline mr-1" />
                Share:
              </span>
              <Button variant="outline" size="sm" onClick={handleShareTwitter}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareLinkedIn}>
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article ref={articleRef} className="lg:col-span-2">
            <div className="max-w-none">
              {renderMarkdown(post.content, post.slug)}
            </div>

            {/* CTA Section */}
            <Card className="mt-12 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">Ready to Build Your Startup?</h3>
                <p className="text-muted-foreground mb-6">
                  Browse validated startup ideas with market analysis, customer personas, and 90-day playbooks.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/browse">
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      Browse Ideas
                    </Button>
                  </Link>
                  <Link to="/ai-research">
                    <Button variant="outline">Try AI Research</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter CTA */}
            <div className="mt-8">
              <NewsletterSignup variant="hero" source={`blog-${post.slug}`} />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1">
                    {relatedPosts.map((relatedPost) => (
                      <BlogCard key={relatedPost.id} post={relatedPost} variant="compact" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Explore VentureVault</CardTitle>
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
                    to="/trending"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">Trending Ideas</span>
                    <Badge variant="outline">Hot</Badge>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Sidebar */}
            <NewsletterSignup variant="card" source="blog-post-sidebar" />
          </aside>
        </div>
      </div>
    </div>
  )
}
