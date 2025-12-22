import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { TrendingUp, Users, DollarSign, Zap, ArrowRight, Bookmark, BookmarkCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { saveIdea, unsaveIdea, isIdeaSaved, getCurrentUser } from "../lib/supabase"

interface IdeaCardProps {
  id: string
  title: string
  description: string
  category: string
  marketScore: number
  competitionLevel: "Low" | "Medium" | "High"
  potentialRevenue: string
  trending?: boolean
  tags: string[]
  showBookmark?: boolean
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-yellow-600"
  return "text-orange-600"
}

function getCompetitionColor(level: string) {
  if (level === "Low") return "success"
  if (level === "Medium") return "warning"
  return "destructive"
}

export function IdeaCard({
  id,
  title,
  description,
  category,
  marketScore,
  competitionLevel,
  potentialRevenue,
  trending = false,
  tags,
  showBookmark = true,
}: IdeaCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function checkStatus() {
      const { user } = await getCurrentUser()
      setIsLoggedIn(!!user)
      if (user) {
        const saved = await isIdeaSaved(id)
        setIsSaved(saved)
      }
    }
    if (showBookmark) {
      checkStatus()
    }
  }, [id, showBookmark])

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn || isLoading) return

    setIsLoading(true)
    if (isSaved) {
      await unsaveIdea(id)
      setIsSaved(false)
    } else {
      await saveIdea(id)
      setIsSaved(true)
    }
    setIsLoading(false)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Link to={`/browse?category=${encodeURIComponent(category)}`}>
            <Badge variant="secondary" className="text-xs hover:bg-secondary/80 cursor-pointer">
              {category}
            </Badge>
          </Link>
          <div className="flex items-center gap-2">
            {trending && (
              <Badge variant="default" className="gap-1 bg-gradient-to-r from-purple-500 to-pink-500">
                <Zap className="h-3 w-3" />
                Trending
              </Badge>
            )}
            {showBookmark && isLoggedIn && (
              <button
                onClick={handleBookmark}
                disabled={isLoading}
                className={`p-1.5 rounded-full transition-colors ${
                  isSaved
                    ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
                    : 'text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save idea'}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
        <Link to={`/idea/${id}`}>
          <CardTitle className="text-lg leading-tight mt-2 hover:text-purple-600 transition-colors cursor-pointer">
            {title}
          </CardTitle>
        </Link>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <TrendingUp className="h-4 w-4 mb-1 text-muted-foreground" />
            <span className={`text-lg font-bold ${getScoreColor(marketScore)}`}>
              {marketScore}
            </span>
            <span className="text-xs text-muted-foreground">Score</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <Users className="h-4 w-4 mb-1 text-muted-foreground" />
            <Badge variant={getCompetitionColor(competitionLevel) as any} className="text-xs px-1.5">
              {competitionLevel}
            </Badge>
            <span className="text-xs text-muted-foreground mt-1">Competition</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <DollarSign className="h-4 w-4 mb-1 text-muted-foreground" />
            <span className="text-sm font-semibold">{potentialRevenue}</span>
            <span className="text-xs text-muted-foreground">Revenue</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/idea/${id}`} className="w-full">
          <Button variant="ghost" className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white transition-all">
            View Analysis
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
