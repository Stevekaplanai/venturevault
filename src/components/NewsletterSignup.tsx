import { useState, useRef } from "react"
import { Mail, Loader2, CheckCircle2, Sparkles, Rocket, PartyPopper } from "lucide-react"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"

interface NewsletterSignupProps {
  variant?: "inline" | "card" | "hero" | "compact"
  source?: string
}

function triggerConfetti() {
  const duration = 2000
  const animationEnd = Date.now() + duration
  const colors = ['#7c3aed', '#4f46e5', '#a855f7', '#6366f1', '#fbbf24']

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors
    })

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame)
    }
  }
  frame()

  // Big burst in the center
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors
    })
  }, 200)
}

export function NewsletterSignup({ variant = "inline", source = "website" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Please enter your email")
      inputRef.current?.focus()
      toast.error("Please enter your email")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email")
      inputRef.current?.focus()
      toast.error("Please enter a valid email address")
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
      triggerConfetti()
      toast.success("Welcome aboard!", {
        description: "Check your inbox for a welcome email with your first idea!",
        icon: <PartyPopper className="h-5 w-5 text-purple-500" />,
        duration: 5000
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={`
        flex items-center gap-3
        ${variant === "card" ? "p-6" : "p-4"}
        bg-gradient-to-r from-green-50 to-emerald-50
        dark:from-green-950/30 dark:to-emerald-950/30
        rounded-xl border border-green-200 dark:border-green-800
        animate-in fade-in slide-in-from-bottom-2 duration-500
      `}>
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0 animate-in zoom-in duration-300">
          <CheckCircle2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
            You're in!
            <span className="animate-bounce inline-block">🎉</span>
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Check your inbox for a welcome email with your first startup idea.
          </p>
        </div>
      </div>
    )
  }

  if (variant === "hero") {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur px-4 py-1.5 text-sm mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
            <span>Free Daily Ideas</span>
            <Rocket className="h-4 w-4 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            Get a Startup Idea Every Morning
          </h3>
          <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500">
            Join 1,000+ founders receiving curated startup ideas with market analysis, directly in your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="relative flex-1 group">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-purple-500" />
            <Input
              ref={inputRef}
              type="email"
              placeholder="Enter your email"
              className="pl-10 h-12 transition-all duration-200 border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-12 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] disabled:hover:scale-100"
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
          <p className="text-sm text-red-500 mt-2 text-center animate-in fade-in duration-300">{error}</p>
        )}

        <p className="text-xs text-muted-foreground text-center mt-4 animate-in fade-in duration-500">
          No spam, ever. Unsubscribe anytime. Join 1,000+ founders.
        </p>
      </div>
    )
  }

  if (variant === "card") {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800 overflow-hidden group hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold">Daily Startup Ideas</h4>
              <p className="text-sm text-muted-foreground">Delivered to your inbox</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              ref={inputRef}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null)
              }}
              disabled={isLoading}
              className="transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
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
            <p className="text-sm text-red-500 mt-2 animate-in fade-in duration-300">{error}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  // Compact variant - for inline article use
  if (variant === "compact") {
    return (
      <div className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            ref={inputRef}
            type="email"
            placeholder="Your email"
            className="flex-1 h-10 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            className="h-10 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shrink-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Subscribe Free"
            )}
          </Button>
        </form>
        {error && (
          <p className="text-sm text-red-500 mt-1 animate-in fade-in duration-300">{error}</p>
        )}
      </div>
    )
  }

  // Inline variant (default) - for footer
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          type="email"
          placeholder="Enter your email"
          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 transition-all duration-200"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError(null)
          }}
          disabled={isLoading}
        />
        <Button
          type="submit"
          className="bg-white text-purple-600 hover:bg-white/90 transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
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
        <p className="text-sm text-red-300 mt-2 animate-in fade-in duration-300">{error}</p>
      )}
    </div>
  )
}
