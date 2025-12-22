import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Sparkles, Loader2, Brain, Code2, Target, TrendingUp,
  Zap, CheckCircle2, Users, DollarSign, Clock, X, Plus,
  Search, Bookmark, Copy, Check, AlertCircle, RefreshCw
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

interface GeneratedIdea {
  title: string
  description: string
  category: string
  problemSolved: string
  targetAudience: string
  monetizationModel: string[]
  techStack: string[]
  mvpFeatures: string[]
  marketScore: number
  competitionLevel: "Low" | "Medium" | "High"
  potentialRevenue: string
  timeToMVP: string
  whyNow: string
  tags: string[]
}

const categoryOptions = ["SaaS", "AI/ML", "E-commerce", "FinTech", "HealthTech", "EdTech", "MarketPlace"]

const skillSuggestions = [
  "React", "Node.js", "Python", "TypeScript", "AWS", "Machine Learning",
  "Mobile Development", "UI/UX Design", "Data Analysis", "Marketing",
  "Sales", "Product Management", "Backend Development", "DevOps"
]

export function IdeaGeneratorPage() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [problemAreas, setProblemAreas] = useState("")
  const [includeMarketContext, setIncludeMarketContext] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([])
  const [marketContext, setMarketContext] = useState<{ trends: string[], recentNews: string[] }>({ trends: [], recentNews: [] })
  const [error, setError] = useState("")
  const [savedIdeas, setSavedIdeas] = useState<Set<string>>(new Set())
  const [copiedIdea, setCopiedIdea] = useState<string | null>(null)

  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed])
    }
    setSkillInput("")
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleGenerate = async () => {
    if (!skills.length && !selectedCategories.length && !problemAreas) {
      setError("Please add at least one skill, select a category, or describe a problem to solve.")
      return
    }

    setIsLoading(true)
    setError("")
    setIdeas([])

    try {
      const apiUrl = import.meta.env.PROD
        ? '/api/generate-ideas'
        : 'http://localhost:3000/api/generate-ideas'

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills,
          interests: selectedCategories,
          targetCategories: selectedCategories,
          problemAreas: problemAreas || undefined,
          includeMarketContext
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate ideas')
      }

      const data = await response.json()
      if (data.success && data.ideas) {
        setIdeas(data.ideas)
        setMarketContext(data.marketContext || { trends: [], recentNews: [] })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ideas. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResearch = (idea: GeneratedIdea) => {
    navigate(`/ai-research?idea=${encodeURIComponent(idea.title)}`)
  }

  const handleSave = (idea: GeneratedIdea) => {
    const newSaved = new Set(savedIdeas)
    if (newSaved.has(idea.title)) {
      newSaved.delete(idea.title)
    } else {
      newSaved.add(idea.title)
      // Also save to localStorage
      const savedList = JSON.parse(localStorage.getItem("venturevault-generated-ideas") || "[]")
      savedList.push({ ...idea, savedAt: new Date().toISOString() })
      localStorage.setItem("venturevault-generated-ideas", JSON.stringify(savedList))
    }
    setSavedIdeas(newSaved)
  }

  const handleCopy = async (idea: GeneratedIdea) => {
    const text = `${idea.title}\n\n${idea.description}\n\nProblem: ${idea.problemSolved}\nTarget: ${idea.targetAudience}\nCategory: ${idea.category}\nMarket Score: ${idea.marketScore}/100\nRevenue Potential: ${idea.potentialRevenue}\nTime to MVP: ${idea.timeToMVP}\n\nWhy Now: ${idea.whyNow}\n\nTech Stack: ${idea.techStack.join(", ")}\nMVP Features: ${idea.mvpFeatures.join(", ")}`
    await navigator.clipboard.writeText(text)
    setCopiedIdea(idea.title)
    setTimeout(() => setCopiedIdea(null), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-orange-600"
  }

  const getCompetitionColor = (level: string) => {
    if (level === "Low") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    if (level === "Medium") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm mb-4">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>AI-Powered Generation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Startup Idea{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Generator
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tell us about your skills and interests. Our AI will generate personalized startup ideas tailored to your strengths.
          </p>
        </div>

        {/* Input Form */}
        {!ideas.length && !isLoading && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Skills Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code2 className="h-5 w-5 text-purple-500" />
                  Your Skills
                </CardTitle>
                <CardDescription>What are you good at? Add technical and business skills.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Type a skill and press Enter..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSkill(skillInput)
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => addSkill(skillInput)}
                    disabled={!skillInput.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:bg-muted rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground">Suggestions:</span>
                  {skillSuggestions.filter(s => !skills.includes(s)).slice(0, 6).map(skill => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      onClick={() => addSkill(skill)}
                    >
                      + {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-indigo-500" />
                  Target Categories
                </CardTitle>
                <CardDescription>What industries interest you?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map(category => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedCategories.includes(category)
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "hover:bg-purple-100 dark:hover:bg-purple-900/30"
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {selectedCategories.includes(category) && <Check className="h-3 w-3 mr-1" />}
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Problem Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Problem Areas (Optional)
                </CardTitle>
                <CardDescription>Describe specific problems you'd like to solve.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., I want to help small businesses automate their accounting, or I want to make education more accessible..."
                  value={problemAreas}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProblemAreas(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Market Context Toggle */}
            <Card>
              <CardContent className="pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMarketContext}
                    onChange={(e) => setIncludeMarketContext(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Include Market Context</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use live Google Trends and tech news to inform idea generation
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <Button
              size="lg"
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={handleGenerate}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Startup Ideas
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="py-16 text-center">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">Generating Ideas...</h3>
                <p className="text-muted-foreground mb-6">
                  Our AI is analyzing your profile and current market trends
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> Analyzing skills</span>
                  <span className="flex items-center gap-1"><Loader2 className="h-4 w-4 animate-spin" /> Finding opportunities</span>
                  <span className="flex items-center gap-1 opacity-50"><Sparkles className="h-4 w-4" /> Generating ideas</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {ideas.length > 0 && !isLoading && (
          <div className="space-y-6">
            {/* Market Context */}
            {(marketContext.trends.length > 0 || marketContext.recentNews.length > 0) && (
              <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Market Context Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {marketContext.trends.slice(0, 6).map((trend, i) => (
                      <Badge key={i} variant="outline" className="bg-background">
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Header with actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Generated Ideas</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setIdeas([]); setError("") }}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={handleGenerate}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate More
                </Button>
              </div>
            </div>

            {/* Ideas Grid */}
            <div className="grid gap-6">
              {ideas.map((idea, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>{idea.category}</Badge>
                          <Badge className={getCompetitionColor(idea.competitionLevel)}>
                            {idea.competitionLevel} Competition
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{idea.title}</CardTitle>
                        <CardDescription className="mt-2 text-base">{idea.description}</CardDescription>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm text-muted-foreground">Score</div>
                        <div className={`text-3xl font-bold ${getScoreColor(idea.marketScore)}`}>
                          {idea.marketScore}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Why Now */}
                    <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-medium mb-1">
                        <Zap className="h-4 w-4" />
                        Why Now
                      </div>
                      <p className="text-sm text-muted-foreground">{idea.whyNow}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          Problem Solved
                        </div>
                        <p className="text-sm text-muted-foreground">{idea.problemSolved}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                          <Users className="h-4 w-4 text-green-500" />
                          Target Audience
                        </div>
                        <p className="text-sm text-muted-foreground">{idea.targetAudience}</p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 py-3 border-y">
                      <div className="text-center">
                        <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-500" />
                        <div className="font-semibold">{idea.potentialRevenue}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                      <div className="text-center">
                        <Clock className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                        <div className="font-semibold">{idea.timeToMVP}</div>
                        <div className="text-xs text-muted-foreground">Time to MVP</div>
                      </div>
                      <div className="text-center">
                        <DollarSign className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                        <div className="font-semibold">{idea.monetizationModel.length}</div>
                        <div className="text-xs text-muted-foreground">Revenue Streams</div>
                      </div>
                    </div>

                    {/* Tech Stack & MVP Features */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Tech Stack</div>
                        <div className="flex flex-wrap gap-1">
                          {idea.techStack.map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">MVP Features</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {idea.mvpFeatures.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-green-500 shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        onClick={() => handleResearch(idea)}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Deep Research
                      </Button>
                      <Button
                        variant={savedIdeas.has(idea.title) ? "secondary" : "outline"}
                        onClick={() => handleSave(idea)}
                      >
                        {savedIdeas.has(idea.title) ? (
                          <><Check className="h-4 w-4 mr-2" />Saved</>
                        ) : (
                          <><Bookmark className="h-4 w-4 mr-2" />Save</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopy(idea)}
                      >
                        {copiedIdea === idea.title ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
