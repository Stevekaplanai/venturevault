import { useState, useEffect, useCallback } from "react"
import {
  Rocket, CheckCircle2, Clock, Sparkles, ThumbsUp,
  MessageSquare, Calendar, Users, Zap, Target,
  ChevronUp, BarChart3, Brain, Globe, Shield, Loader2, PartyPopper
} from "lucide-react"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Textarea } from "../components/ui/textarea"

// Generate or retrieve a unique visitor ID
function getVisitorId(): string {
  const key = "venturevault-visitor-id"
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

// Mini confetti burst for voting
function triggerVoteConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#7c3aed', '#4f46e5', '#a855f7', '#10b981']
  })
}

interface Feature {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "planned" | "considering"
  category: string
  votes: number
  icon: typeof Rocket
}

const initialFeatures: Feature[] = [
  // Completed
  {
    id: "og-tags",
    title: "Social Media Sharing",
    description: "OG tags and social preview images for sharing ideas on Twitter, LinkedIn, and Facebook",
    status: "completed",
    category: "Marketing",
    votes: 45,
    icon: Globe
  },
  {
    id: "ai-research",
    title: "AI Research Agent",
    description: "Deep market research powered by Gemini AI with real-time data analysis",
    status: "completed",
    category: "AI Features",
    votes: 89,
    icon: Brain
  },
  {
    id: "live-trends",
    title: "Live Google Trends",
    description: "Real-time trending topics from Google Trends via SerpAPI integration",
    status: "completed",
    category: "Data",
    votes: 67,
    icon: BarChart3
  },
  {
    id: "rss-feeds",
    title: "Live RSS Feeds",
    description: "Aggregated tech news from TechCrunch, Hacker News, Wired, and VentureBeat",
    status: "completed",
    category: "Data",
    votes: 52,
    icon: Zap
  },
  // In Progress
  {
    id: "roadmap-voting",
    title: "Feature Voting System",
    description: "Let users vote on features they want built next",
    status: "in-progress",
    category: "Community",
    votes: 34,
    icon: ThumbsUp
  },
  // Planned
  {
    id: "idea-generator",
    title: "AI Idea Generator",
    description: "Generate new startup ideas based on trends, skills, and market gaps",
    status: "in-progress",
    category: "AI Features",
    votes: 156,
    icon: Sparkles
  },
  {
    id: "competitor-tracker",
    title: "Competitor Tracking",
    description: "Monitor competitors' updates, funding rounds, and product changes",
    status: "planned",
    category: "Research",
    votes: 98,
    icon: Target
  },
  {
    id: "team-collaboration",
    title: "Team Workspaces",
    description: "Collaborate with co-founders on idea research and validation",
    status: "planned",
    category: "Collaboration",
    votes: 87,
    icon: Users
  },
  {
    id: "pitch-deck-gen",
    title: "Pitch Deck Generator",
    description: "Auto-generate investor pitch decks from idea analysis",
    status: "planned",
    category: "AI Features",
    votes: 134,
    icon: Rocket
  },
  // Considering
  {
    id: "mobile-app",
    title: "Mobile App (iOS/Android)",
    description: "Native mobile apps for on-the-go idea discovery",
    status: "considering",
    category: "Platform",
    votes: 76,
    icon: Zap
  },
  {
    id: "api-access",
    title: "Public API",
    description: "API access for developers to build on VentureVault data",
    status: "considering",
    category: "Developer",
    votes: 45,
    icon: Shield
  },
  {
    id: "founder-matching",
    title: "Co-Founder Matching",
    description: "Find co-founders based on complementary skills and shared interests",
    status: "considering",
    category: "Community",
    votes: 112,
    icon: Users
  },
]

const statusConfig = {
  "completed": { label: "Shipped", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50 dark:bg-green-950/20" },
  "in-progress": { label: "Building", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50 dark:bg-blue-950/20" },
  "planned": { label: "Planned", color: "bg-purple-500", textColor: "text-purple-700", bgColor: "bg-purple-50 dark:bg-purple-950/20" },
  "considering": { label: "Considering", color: "bg-amber-500", textColor: "text-amber-700", bgColor: "bg-amber-50 dark:bg-amber-950/20" },
}

export function RoadmapPage() {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures)
  const [votedFeatures, setVotedFeatures] = useState<Set<string>>(new Set())
  const [votingFeature, setVotingFeature] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch votes from API on mount
  const fetchVotes = useCallback(async () => {
    try {
      const response = await fetch("/api/roadmap-vote")
      if (response.ok) {
        const data = await response.json()
        if (data.votes) {
          setFeatures(prev => prev.map(f => ({
            ...f,
            votes: f.votes + (data.votes[f.id] || 0)
          })))
        }
      }
    } catch (error) {
      console.error("Failed to fetch votes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Load local voted features (to prevent re-voting)
    const savedVotes = localStorage.getItem("venturevault-votes")
    if (savedVotes) {
      setVotedFeatures(new Set(JSON.parse(savedVotes)))
    }
    // Fetch votes from server
    fetchVotes()
  }, [fetchVotes])

  const handleVote = async (featureId: string) => {
    if (votedFeatures.has(featureId) || votingFeature) return

    setVotingFeature(featureId)

    try {
      const visitorId = getVisitorId()
      const response = await fetch("/api/roadmap-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId, visitorId })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === "Already voted for this feature") {
          // Already voted - just update local state
          const newVotedFeatures = new Set(votedFeatures)
          newVotedFeatures.add(featureId)
          setVotedFeatures(newVotedFeatures)
          localStorage.setItem("venturevault-votes", JSON.stringify([...newVotedFeatures]))
          toast.info("You've already voted for this feature!")
        } else {
          throw new Error(data.error)
        }
        return
      }

      // Success!
      const newVotedFeatures = new Set(votedFeatures)
      newVotedFeatures.add(featureId)
      setVotedFeatures(newVotedFeatures)
      localStorage.setItem("venturevault-votes", JSON.stringify([...newVotedFeatures]))

      setFeatures(prev => prev.map(f =>
        f.id === featureId ? { ...f, votes: data.voteCount || f.votes + 1 } : f
      ))

      triggerVoteConfetti()
      toast.success("Vote recorded!", {
        description: "Thanks for helping shape VentureVault!",
        icon: <PartyPopper className="h-5 w-5 text-purple-500" />
      })
    } catch (error) {
      console.error("Vote failed:", error)
      toast.error("Failed to record vote", {
        description: "Please try again in a moment."
      })
    } finally {
      setVotingFeature(null)
    }
  }

  const handleSuggestion = () => {
    if (!suggestion.trim()) return
    // In a real app, this would send to a backend
    console.log("Feature suggestion:", suggestion)
    setSuggestion("")
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const groupedFeatures = {
    "completed": features.filter(f => f.status === "completed"),
    "in-progress": features.filter(f => f.status === "in-progress"),
    "planned": features.filter(f => f.status === "planned").sort((a, b) => b.votes - a.votes),
    "considering": features.filter(f => f.status === "considering").sort((a, b) => b.votes - a.votes),
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-indigo-500">
            <Rocket className="h-3 w-3 mr-1" />
            Public Roadmap
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What We're{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Building
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what's coming to VentureVault and vote for the features you want most.
            Your votes directly influence our priorities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{groupedFeatures.completed.length}</p>
              <p className="text-sm text-muted-foreground">Shipped</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{groupedFeatures["in-progress"].length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{groupedFeatures.planned.length}</p>
              <p className="text-sm text-muted-foreground">Planned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-bold">{groupedFeatures.considering.length}</p>
              <p className="text-sm text-muted-foreground">Considering</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Sections */}
        <div className="space-y-12">
          {(["in-progress", "planned", "considering", "completed"] as const).map(status => (
            <div key={status}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`h-3 w-3 rounded-full ${statusConfig[status].color}`} />
                <h2 className="text-2xl font-bold">{statusConfig[status].label}</h2>
                <Badge variant="outline">{groupedFeatures[status].length}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedFeatures[status].map(feature => (
                  <Card
                    key={feature.id}
                    className={`${statusConfig[feature.status].bgColor} border-l-4 ${statusConfig[feature.status].color.replace('bg-', 'border-')}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <feature.icon className={`h-5 w-5 ${statusConfig[feature.status].textColor}`} />
                          <CardTitle className="text-base">{feature.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {feature.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{feature.description}</CardDescription>

                      {status !== "completed" && (
                        <div className="flex items-center justify-between">
                          <Button
                            variant={votedFeatures.has(feature.id) ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => handleVote(feature.id)}
                            disabled={votedFeatures.has(feature.id) || votingFeature === feature.id}
                            className={`gap-2 transition-all duration-300 ${
                              votedFeatures.has(feature.id)
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "hover:bg-purple-100 hover:text-purple-700 hover:border-purple-300 dark:hover:bg-purple-900/30"
                            }`}
                          >
                            {votingFeature === feature.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : votedFeatures.has(feature.id) ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <ChevronUp className="h-4 w-4" />
                            )}
                            {votingFeature === feature.id ? "Voting..." : votedFeatures.has(feature.id) ? "Voted!" : "Upvote"}
                          </Button>
                          <div className={`flex items-center gap-1 text-sm transition-all duration-300 ${
                            isLoading ? "opacity-50" : "text-muted-foreground"
                          }`}>
                            <ThumbsUp className="h-4 w-4" />
                            <span className="font-semibold tabular-nums">{feature.votes}</span>
                          </div>
                        </div>
                      )}

                      {status === "completed" && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm font-medium">Live now!</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Suggestion Box */}
        <Card className="mt-12 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Suggest a Feature
            </CardTitle>
            <CardDescription>
              Have an idea for VentureVault? We'd love to hear it!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Textarea
                placeholder="Describe your feature idea..."
                value={suggestion}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSuggestion(e.target.value)}
                className="flex-1 bg-background"
                rows={3}
              />
              <Button
                onClick={handleSuggestion}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 sm:self-end"
                disabled={!suggestion.trim() || submitted}
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Submitted!
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
            {submitted && (
              <p className="text-sm text-green-600 mt-2">
                Thanks for your suggestion! We review all submissions.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
