import { Link } from "react-router-dom"
import { Calendar, Clock, ArrowRight, User, ExternalLink } from "lucide-react"
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
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  if (variant === "featured") {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-purple-200 dark:border-purple-800">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2">
          <span className="text-white text-sm font-medium">Featured Article</span>
        </div>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getCategoryColor(post.category)}>
              {getCategoryLabel(post.category)}
            </Badge>
            {post.source && (
              <Badge variant="outline" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                {post.source.name}
              </Badge>
            )}
          </div>
          <Link to={`/blog/${post.slug}`}>
            <CardTitle className="text-xl leading-tight hover:text-purple-600 transition-colors cursor-pointer">
              {post.title}
            </CardTitle>
          </Link>
          <CardDescription className="text-base mt-2">{post.excerpt}</CardDescription>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
        </CardContent>

        <CardFooter>
          <Link to={`/blog/${post.slug}`} className="w-full">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Read Article
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  if (variant === "compact") {
    return (
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="group flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${getCategoryColor(post.category)} text-xs`}>
                {getCategoryLabel(post.category)}
              </Badge>
              <span className="text-xs text-muted-foreground">{post.readTime}</span>
            </div>
            <h4 className="font-medium text-sm leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
              {post.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(post.publishedAt)}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-colors shrink-0 mt-1" />
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryColor(post.category)}>
            {getCategoryLabel(post.category)}
          </Badge>
          {post.source && (
            <a
              href={post.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
              {post.source.name}
            </a>
          )}
        </div>
        <Link to={`/blog/${post.slug}`}>
          <CardTitle className="text-lg leading-tight hover:text-purple-600 transition-colors cursor-pointer line-clamp-2">
            {post.title}
          </CardTitle>
        </Link>
        <CardDescription className="line-clamp-2 mt-2">{post.excerpt}</CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
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
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {post.author}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/blog/${post.slug}`} className="w-full">
          <Button variant="ghost" className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white transition-all">
            Read Article
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
