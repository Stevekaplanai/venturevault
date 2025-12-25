import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft, TrendingUp, Users, DollarSign, Target, Clock,
  Zap, CheckCircle2, Code2, Building2, BarChart3, Lightbulb,
  Share2, Bookmark, Check, User, Calendar, FileText, Loader2
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ideas as staticIdeas } from "../data/ideas"
import type { Idea } from "../data/ideas"
import { IdeaCard } from "../components/IdeaCard"
import { CustomerPersonas } from "../components/idea-detail/CustomerPersonas"
import { ExecutionPlan } from "../components/idea-detail/ExecutionPlan"
import { UnitEconomics } from "../components/idea-detail/UnitEconomics"
import { LandingPageCopy } from "../components/idea-detail/LandingPageCopy"

const API_BASE = import.meta.env.PROD
  ? ''
  : 'https://venturevaultspace.vercel.app'

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
  const [idea, setIdea] = useState<Idea | null>(null)
  const [relatedIdeas, setRelatedIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(() => {
    const savedIdeas = JSON.parse(localStorage.getItem("venturevault-saved") || "[]")
    return savedIdeas.includes(id)
  })

  // Fetch idea from API with fallback to static data
  useEffect(() => {
    async function fetchIdea() {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE}/api/get-idea?id=${encodeURIComponent(id)}`)
        if (!response.ok) {
          throw new Error('Failed to fetch idea')
        }
        const data = await response.json()
        if (data.idea) {
          setIdea(data.idea)
          setRelatedIdeas(data.relatedIdeas || [])
        } else {
          throw new Error('No idea in response')
        }
      } catch (err) {
        console.error('Error fetching idea, using static data:', err)
        // Fallback to static data
        const staticIdea = staticIdeas.find(i => i.id === id)
        if (staticIdea) {
          setIdea(staticIdea)
          // Get related ideas from same category
          const related = staticIdeas
            .filter(i => i.category === staticIdea.category && i.id !== id)
            .slice(0, 3)
          setRelatedIdeas(related)
        } else {
          setError('Idea not found')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchIdea()
  }, [id])

  const handleShare = async () => {
    const shareUrl = window.location.href
    const shareData = {
      title: idea?.title || "VentureVault Idea",
      text: idea?.description || "Check out this startup idea on VentureVault",
      url: shareUrl,
    }

    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        // User cancelled or error, fall back to clipboard
      }
    }

    // Fall back to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSave = () => {
    const savedIdeas = JSON.parse(localStorage.getItem("venturevault-saved") || "[]")
    if (saved) {
      const updated = savedIdeas.filter((savedId: string) => savedId !== id)
      localStorage.setItem("venturevault-saved", JSON.stringify(updated))
    } else {
      savedIdeas.push(id)
      localStorage.setItem("venturevault-saved", JSON.stringify(savedIdeas))
    }
    setSaved(!saved)
  }

  const handleBuild = () => {
    // Navigate to AI Research with the idea pre-filled
    navigate(`/ai-research?idea=${encodeURIComponent(idea?.title || "")}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading idea...</p>
      </div>
    )
  }

  if (error || !idea) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Idea Not Found</h1>
        <p className="text-muted-foreground mb-6">{error || "The idea you're looking for doesn't exist."}</p>
        <Button onClick={() => navigate("/browse")}>Browse All Ideas</Button>
      </div>
    )
  }

  // Check if enhanced data exists
  const hasEnhancedData = idea.customerPersonas || idea.playbook || idea.unitEconomics || idea.landingPageCopy

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
              {hasEnhancedData && (
                <Badge className="gap-1 bg-gradient-to-r from-green-500 to-emerald-500">
                  <Lightbulb className="h-3 w-3" />
                  Enhanced Analysis
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{idea.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{idea.fullDescription}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {idea.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={handleBuild}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Start Building This
              </Button>
              <Button variant={saved ? "secondary" : "outline"} onClick={handleSave}>
                {saved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
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

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="gap-2 py-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="gap-2 py-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Customers</span>
            </TabsTrigger>
            <TabsTrigger value="execution" className="gap-2 py-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">90-Day Plan</span>
            </TabsTrigger>
            <TabsTrigger value="financials" className="gap-2 py-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Financials</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="gap-2 py-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Marketing</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                    {idea.monetizationModel.map((model: string, i: number) => (
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
                    {idea.keyCompetitors.map((competitor: string) => (
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
                    {idea.mvpFeatures.map((feature: string, i: number) => (
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
                    {idea.techStack.map((tech: string) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Investment & Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="mt-6">
            <CustomerPersonas personas={idea.customerPersonas || []} />
          </TabsContent>

          {/* Execution Tab */}
          <TabsContent value="execution" className="mt-6">
            <ExecutionPlan playbook={idea.playbook!} timeToMVP={idea.timeToMVP} />
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="mt-6">
            <UnitEconomics
              unitEconomics={idea.unitEconomics!}
              potentialRevenue={idea.potentialRevenue}
              initialInvestment={idea.initialInvestment}
            />
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing" className="mt-6">
            <LandingPageCopy landingPageCopy={idea.landingPageCopy!} title={idea.title} />
          </TabsContent>
        </Tabs>

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
