import { useState } from "react"
import { Mail, Loader2, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"

interface NewsletterSignupProps {
  variant?: "inline" | "card" | "hero"
  source?: string
}

export function NewsletterSignup({ variant = "inline", source = "website" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Please enter your email")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe")
      }

      setIsSuccess(true)
      setEmail("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={`flex items-center gap-2 ${variant === "card" ? "p-6" : "p-4"} bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800`}>
        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
        <div>
          <p className="font-medium text-green-700 dark:text-green-300">You're subscribed!</p>
          <p className="text-sm text-green-600 dark:text-green-400">Check your inbox for a welcome email with your first idea.</p>
        </div>
      </div>
    )
  }

  if (variant === "hero") {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm mb-4">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>Free Daily Ideas</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Get a Startup Idea Every Morning</h3>
          <p className="text-muted-foreground">
            Join 1,000+ founders receiving curated startup ideas with market analysis, directly in your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Enter your email"
              className="pl-10 h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-12 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Subscribe Free
              </>
            )}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
        )}

        <p className="text-xs text-muted-foreground text-center mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    )
  }

  if (variant === "card") {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold">Daily Startup Ideas</h4>
              <p className="text-sm text-muted-foreground">Delivered to your inbox</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe Free"
              )}
            </Button>
          </form>

          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  // Inline variant (default) - for footer
  return (
    <div className="w-full">
      <h4 className="font-semibold mb-2">Get Daily Startup Ideas</h4>
      <p className="text-sm text-muted-foreground mb-4">
        One curated idea with market analysis, every morning.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          className="flex-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shrink-0"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}
