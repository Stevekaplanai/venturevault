import { useState } from "react"
import { FileText, Copy, Check, Sparkles, MousePointer, Megaphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import type { LandingPageCopy as LandingPageCopyType } from "../../data/ideas"

interface LandingPageCopyProps {
  landingPageCopy: LandingPageCopyType
  title: string
}

export function LandingPageCopy({ landingPageCopy, title }: LandingPageCopyProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  if (!landingPageCopy) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Landing page copy coming soon...
        </CardContent>
      </Card>
    )
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(id)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const sections = [
    {
      title: "Headlines",
      icon: Sparkles,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      items: landingPageCopy.headlines,
      description: "Attention-grabbing headlines for your hero section"
    },
    {
      title: "Value Propositions",
      icon: Megaphone,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      items: landingPageCopy.valueProps,
      description: "Key benefits to highlight on your landing page"
    },
    {
      title: "Call-to-Action Options",
      icon: MousePointer,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      items: landingPageCopy.ctaOptions,
      description: "Button text that converts visitors to users"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-semibold">Ready-to-Use Landing Page Copy</h3>
        <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">
          Copy & Paste
        </Badge>
      </div>

      <p className="text-muted-foreground">
        Skip the blank page. Use these professionally written copy elements to launch your {title} landing page faster.
      </p>

      {/* Copy Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.title} className={`${section.bgColor} ${section.borderColor} border`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <section.icon className={`h-4 w-4 ${section.color}`} />
                {section.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{section.description}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {section.items.map((item, i) => {
                const itemId = `${section.title}-${i}`
                const isCopied = copiedIndex === itemId

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-3 bg-background rounded-lg border group"
                  >
                    <p className="text-sm flex-1">{item}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item, itemId)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pro Tips */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Pro Tips for High-Converting Landing Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">1.</span>
              Test multiple headlines - small changes can increase conversions by 30%+
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">2.</span>
              Use action-oriented CTAs - "Start Free Trial" beats "Submit"
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">3.</span>
              Lead with benefits, not features - address the pain point directly
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">4.</span>
              Add social proof near your CTA - testimonials or user counts
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
