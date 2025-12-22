import { useParams, Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft, TrendingUp, Users, DollarSign, Target, Clock,
  Zap, CheckCircle2, Code2, Building2, BarChart3, Lightbulb,
  Share2, Bookmark
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { getIdeaById, ideas } from "../data/ideas"
import { IdeaCard } from "../components/IdeaCard"

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

export function IdeaDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const idea = getIdeaById(id || "")

  if (!idea) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Idea Not Found</h1>
        <p className="text-muted-foreground mb-6">The idea you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/browse")}>Browse All Ideas</Button>
      </div>
    )
  }

  // Get related ideas (same category, excluding current)
  const relatedIdeas = ideas
    .filter((i) => i.category === idea.category && i.id !== idea.id)
    .slice(0, 3)

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Link to={`/browse?category=${encodeURIComponent(idea.category)}`}>
                <Badge variant="secondary" className="hover:bg-secondary/80">
                  {idea.category}
                </Badge>
              </Link>
              {idea.trending && (
                <Badge className="gap-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  <Zap className="h-3 w-3" />
                  Trending
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{idea.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{idea.fullDescription}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {idea.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Lightbulb className="h-4 w-4 mr-2" />
                Start Building This
              </Button>
              <Button variant="outline">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Score Card */}
          <Card className="lg:w-80 shrink-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Market Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <span>Market Score</span>
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(idea.marketScore)}`}>
                  {idea.marketScore}/100
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Competition</span>
                </div>
                <Badge variant={getCompetitionColor(idea.competitionLevel) as any}>
                  {idea.competitionLevel}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <span>Revenue Potential</span>
                </div>
                <span className="font-semibold">{idea.potentialRevenue}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <span>Market Size</span>
                </div>
                <span className="font-semibold">{idea.marketSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <span>Growth Rate</span>
                </div>
                <span className="font-semibold text-green-600">{idea.growthRate}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Problem & Solution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-purple-500" />
                Problem Solved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{idea.problemSolved}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-blue-500" />
                Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{idea.targetAudience}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-5 w-5 text-green-500" />
                Monetization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {idea.monetizationModel.map((model, i) => (
                  <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {model}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-5 w-5 text-orange-500" />
                Key Competitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {idea.keyCompetitors.map((competitor) => (
                  <Badge key={competitor} variant="outline">
                    {competitor}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                MVP Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {idea.mvpFeatures.map((feature, i) => (
                  <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Code2 className="h-5 w-5 text-cyan-500" />
                Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {idea.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment & Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                Time to MVP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{idea.timeToMVP}</p>
              <p className="text-muted-foreground mt-2">With a focused development team</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Initial Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{idea.initialInvestment}</p>
              <p className="text-muted-foreground mt-2">For MVP development and initial launch</p>
            </CardContent>
          </Card>
        </div>

        {/* Related Ideas */}
        {relatedIdeas.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Ideas in {idea.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedIdeas.map((relatedIdea) => (
                <IdeaCard key={relatedIdea.id} {...relatedIdea} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
