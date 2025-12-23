import { Link } from "react-router-dom"
import { CheckCircle2, Sparkles, Crown, Heart, Building2, Users, Shield, Headphones, Zap, Database, Lock, Globe } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

const freeFeatures = [
  "Access to all validated startup ideas",
  "Full idea analysis & market metrics",
  "AI Research Agent powered by Gemini",
  "Real-time Google Trends data",
  "Market size & TAM calculations",
  "Competitor landscape analysis",
  "Tech stack recommendations",
  "MVP feature roadmaps",
  "Save & organize unlimited ideas",
  "Export to PDF & Notion",
  "Community access",
  "No credit card required",
]

const enterpriseFeatures = [
  { icon: Users, text: "Unlimited team members & collaboration" },
  { icon: Database, text: "Private custom idea database for your org" },
  { icon: Shield, text: "SSO/SAML authentication & advanced security" },
  { icon: Building2, text: "White-label reports with your branding" },
  { icon: Zap, text: "Dedicated AI research capacity & priority queue" },
  { icon: Globe, text: "Custom API access & integrations" },
  { icon: Lock, text: "Data residency & compliance options" },
  { icon: Headphones, text: "Dedicated success manager & 24/7 SLA support" },
]

const faqs = [
  {
    question: "Is VentureVault really free?",
    answer: "Yes! VentureVault is 100% free and will remain free forever. We believe everyone should have access to quality startup idea validation tools."
  },
  {
    question: "What's included in Enterprise?",
    answer: "Enterprise is designed for venture studios, accelerators, and innovation teams who need custom solutions, team collaboration, white-label reports, and dedicated support. Contact us for a custom quote."
  },
  {
    question: "How accurate is the AI research?",
    answer: "Our AI research agent uses real-time data from multiple sources including Google Trends, market reports, and industry publications. While no analysis is perfect, we continuously improve accuracy."
  },
]

export function PricingPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
          <div className="text-center md:text-left">
            <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500">
              <Heart className="h-3 w-3 mr-1" />
              100% Free Forever
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              One Plan.{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Completely Free.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to discover and validate your next startup idea.
              No tiers, no limits, no credit card required.
            </p>
          </div>
          <div className="hidden md:flex justify-center">
            <img
              src="/images/pricing.png"
              alt="Free startup tools"
              className="w-full max-w-sm"
            />
          </div>
        </div>

        {/* Pricing Cards - 2 column layout */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">

          {/* Free Plan */}
          <Card className="relative border-green-500 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1 text-sm">
                For Everyone
              </Badge>
            </div>
            <CardHeader className="text-center pt-10">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Free Forever</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground text-lg">/forever</span>
              </div>
              <CardDescription className="mt-3 text-base">
                Full access to all features. No strings attached.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-3">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Link to="/signup" className="w-full">
                <Button
                  size="lg"
                  className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative border-amber-500/50 bg-gradient-to-b from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1 text-sm">
                For Organizations
              </Badge>
            </div>
            <CardHeader className="text-center pt-10">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Enterprise</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">Custom Pricing</span>
              </div>
              <CardDescription className="mt-3 text-base">
                For venture studios, accelerators & innovation teams
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-muted-foreground mb-4 text-center font-medium">
                Everything in Free, plus:
              </p>
              <ul className="space-y-4">
                {enterpriseFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
                      <feature.icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="pt-1">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <a href="mailto:steve@gtmvp.com?subject=VentureVault Enterprise Inquiry" className="w-full">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-lg py-6 border-amber-500 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </a>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to Find Your Next Big Idea?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of entrepreneurs using VentureVault to validate their startup ideas.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
