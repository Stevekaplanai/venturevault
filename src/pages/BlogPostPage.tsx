import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Linkedin, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { BlogCard } from "../components/BlogCard"
import { NewsletterSignup } from "../components/NewsletterSignup"
import { getBlogPostBySlug, getRelatedPosts, type BlogPost } from "../data/blog-posts"

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

// Simple markdown renderer for headings, lists, bold, etc.
function renderMarkdown(content: string) {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let currentList: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let key = 0

  const flushList = () => {
    if (currentList.length > 0 && listType) {
      if (listType === 'ul') {
        elements.push(
          <ul key={key++} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
            {currentList.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        )
      } else {
        elements.push(
          <ol key={key++} className="list-decimal list-inside space-y-2 my-4 text-muted-foreground">
            {currentList.map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        )
      }
      currentList = []
      listType = null
    }
  }

  const processInline = (text: string) => {
    // Process bold and links
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-600 hover:underline">$1</a>')
  }

  for (const line of lines) {
    // Headers
    if (line.startsWith('# ')) {
      flushList()
      elements.push(
        <h1 key={key++} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>
      )
    } else if (line.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={key++} className="text-2xl font-bold mt-8 mb-4">{line.slice(3)}</h2>
      )
    } else if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={key++} className="text-xl font-semibold mt-6 mb-3">{line.slice(4)}</h3>
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
    // Empty line
    else if (line.trim() === '') {
      flushList()
    }
    // Regular paragraph
    else {
      flushList()
      elements.push(
        <p
          key={key++}
          className="text-muted-foreground my-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: processInline(line) }}
        />
      )
    }
  }

  flushList()
  return elements
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const post = slug ? getBlogPostBySlug(slug) : undefined
  const relatedPosts = slug ? getRelatedPosts(slug, 3) : []

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
      {/* Article Header */}
      <section className="bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
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
          <article className="lg:col-span-2">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {renderMarkdown(post.content)}
            </div>

            {/* CTA Section */}
            <Card className="mt-12 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">Ready to Build Your Startup?</h3>
                <p className="text-muted-foreground mb-6">
                  Browse 65+ validated startup ideas with market analysis, customer personas, and 90-day playbooks.
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
                    <span className="font-medium">Browse 65+ Ideas</span>
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
