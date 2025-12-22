import { Link } from "react-router-dom"
import { Calendar, Clock, ArrowRight, User, ExternalLink, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import type { BlogPost } from "../data/blog-posts"

interface BlogCardProps {
  post: BlogPost
  variant?: "default" | "featured" | "compact"
}

function getCategoryColor(category: string) {
  switch (category) {
    case "roadmap":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
    case "news":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
    case "ideas":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
    case "tips":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800"
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
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  if (variant === "featured") {
    return (
      <Card className="group relative overflow-hidden border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-white animate-pulse" />
          <span className="text-white text-sm font-medium">Featured Article</span>
        </div>

        <CardHeader className="pb-3 relative">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${getCategoryColor(post.category)} border transition-transform duration-300 group-hover:scale-105`}>
              {getCategoryLabel(post.category)}
            </Badge>
            {post.source && (
              <Badge variant="outline" className="gap-1 transition-colors duration-300 group-hover:border-purple-400">
                <ExternalLink className="h-3 w-3" />
                {post.source.name}
              </Badge>
            )}
          </div>
          <Link to={`/blog/${post.slug}`}>
            <CardTitle className="text-xl leading-tight hover:text-purple-600 transition-colors duration-300 cursor-pointer">
              {post.title}
            </CardTitle>
          </Link>
          <CardDescription className="text-base mt-2">{post.excerpt}</CardDescription>
        </CardHeader>

        <CardContent className="pb-3 relative">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 4).map((tag, index) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs transition-all duration-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-foreground">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-foreground">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </div>
          </div>
        </CardContent>

        <CardFooter className="relative">
          <Link to={`/blog/${post.slug}`} className="w-full">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]">
              Read Article
              <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  if (variant === "compact") {
    return (
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="group flex gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-950/30 dark:hover:to-indigo-950/30 transition-all duration-300">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${getCategoryColor(post.category)} text-xs border`}>
                {getCategoryLabel(post.category)}
              </Badge>
              <span className="text-xs text-muted-foreground">{post.readTime}</span>
            </div>
            <h4 className="font-medium text-sm leading-tight group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
              {post.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(post.publishedAt)}
            </p>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-all duration-300 shrink-0">
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-all duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-300 dark:hover:border-purple-700">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between mb-2">
          <Badge className={`${getCategoryColor(post.category)} border transition-all duration-300 group-hover:scale-105`}>
            {getCategoryLabel(post.category)}
          </Badge>
          {post.source && (
            <a
              href={post.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-purple-600 transition-colors duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
              {post.source.name}
            </a>
          )}
        </div>
        <Link to={`/blog/${post.slug}`}>
          <CardTitle className="text-lg leading-tight hover:text-purple-600 transition-colors duration-300 cursor-pointer line-clamp-2">
            {post.title}
          </CardTitle>
        </Link>
        <CardDescription className="line-clamp-2 mt-2">{post.excerpt}</CardDescription>
      </CardHeader>

      <CardContent className="pb-3 relative">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs transition-all duration-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-300"
            >
              {tag}
            </Badge>
          ))}
          {post.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{post.tags.length - 3}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 transition-colors duration-300 group-hover:text-foreground">
            <User className="h-3 w-3" />
            {post.author}
          </div>
          <div className="flex items-center gap-1 transition-colors duration-300 group-hover:text-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center gap-1 transition-colors duration-300 group-hover:text-foreground">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative">
        <Link to={`/blog/${post.slug}`} className="w-full">
          <Button
            variant="ghost"
            className="w-full transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-500/20"
          >
            Read Article
            <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
