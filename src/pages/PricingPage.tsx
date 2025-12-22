import { Link } from "react-router-dom"
import { CheckCircle2, Sparkles, Zap, Crown, Heart } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

const plans = [
  {
    name: "Free Forever",
    price: "$0",
    period: "forever",
    description: "Everything you need to discover and validate your next big idea",
    icon: Heart,
    color: "from-green-500 to-emerald-500",
    features: [
      "Access to all 50+ startup ideas",
      "Full idea analysis & metrics",
      "AI Research Agent",
      "Market size calculations",
      "Competitor analysis",
      "Tech stack recommendations",
      "MVP feature lists",
      "Community access",
    ],
    cta: "Get Started Free",
    popular: true,
  },
  {
    name: "Pro",
    price: "$0",
    period: "forever",
    description: "For serious entrepreneurs who want more",
    icon: Zap,
    color: "from-purple-500 to-indigo-500",
    features: [
      "Everything in Free",
      "Save unlimited ideas",
      "Export to PDF/Notion",
      "Custom idea requests",
      "Priority AI research",
      "Early access to new features",
      "Direct support",
      "API access",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Enterprise",
    price: "$0",
    period: "forever",
    description: "For teams and organizations",
    icon: Crown,
    color: "from-amber-500 to-orange-500",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom idea database",
      "White-label reports",
      "Dedicated AI research",
      "Custom integrations",
      "SLA support",
      "Training sessions",
    ],
    cta: "Get Started Free",
    popular: false,
  },
]

const faqs = [
  {
    question: "Is VentureVault really free?",
    answer: "Yes! VentureVault is 100% free and will remain free forever. We believe everyone should have access to quality startup idea validation tools."
  },
  {
    question: "How do you make money if it's free?",
    answer: "We're building VentureVault as an open resource for entrepreneurs. In the future, we may offer optional premium features, but the core platform will always be free."
  },
  {
    question: "Can I request custom startup ideas?",
    answer: "Absolutely! You can submit requests for specific industries or problem spaces, and our AI will generate custom ideas for you."
  },
  {
    question: "How accurate is the AI research?",
    answer: "Our AI research agent uses real-time data from multiple sources including market reports, competitor websites, and industry publications. While no analysis is perfect, we strive for high accuracy."
  },
]

export function PricingPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500">
            <Heart className="h-3 w-3 mr-1" />
            100% Free
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple Pricing:{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Free Forever
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe startup validation tools should be accessible to everyone.
            That's why VentureVault is completely free, with no hidden fees or credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? 'border-green-500 shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <div className={`mx-auto h-12 w-12 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                  <plan.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/signup" className="w-full">
                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
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
