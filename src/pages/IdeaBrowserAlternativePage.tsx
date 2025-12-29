import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SEO } from '@/components/SEO'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  Brain,
  Zap,
  Shield,
  Users,
  DollarSign,
  Search,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Star,
  Gift
} from 'lucide-react'

const comparisonFeatures = [
  {
    feature: 'Price',
    ventureVault: 'FREE Forever',
    ideaBrowser: '$29-99/month',
    ventureVaultWins: true
  },
  {
    feature: 'Number of Ideas',
    ventureVault: 'Unlimited Access',
    ideaBrowser: 'Limited by Plan',
    ventureVaultWins: true
  },
  {
    feature: 'AI-Powered Analysis',
    ventureVault: 'FREE with Gemini Pro',
    ideaBrowser: 'Premium Only',
    ventureVaultWins: true
  },
  {
    feature: 'Market Research',
    ventureVault: 'FREE Detailed Reports',
    ideaBrowser: 'Basic Only',
    ventureVaultWins: true
  },
  {
    feature: 'Competition Analysis',
    ventureVault: 'FREE Complete Analysis',
    ideaBrowser: 'Premium Feature',
    ventureVaultWins: true
  },
  {
    feature: 'Revenue Projections',
    ventureVault: 'FREE Unit Economics',
    ideaBrowser: 'Not Available',
    ventureVaultWins: true
  },
  {
    feature: 'Customer Personas',
    ventureVault: 'FREE AI-Generated',
    ideaBrowser: 'Not Available',
    ventureVaultWins: true
  },
  {
    feature: 'Execution Roadmaps',
    ventureVault: 'FREE Step-by-Step Plans',
    ideaBrowser: 'Premium Only',
    ventureVaultWins: true
  },
  {
    feature: 'Landing Page Copy',
    ventureVault: 'FREE AI-Generated',
    ideaBrowser: 'Not Available',
    ventureVaultWins: true
  },
  {
    feature: 'RSS Feed Discovery',
    ventureVault: 'FREE Real-time Trends',
    ideaBrowser: 'Not Available',
    ventureVaultWins: true
  },
  {
    feature: 'Idea Bookmarking',
    ventureVault: 'FREE Unlimited',
    ideaBrowser: 'Limited',
    ventureVaultWins: true
  },
  {
    feature: 'Credit Card Required',
    ventureVault: 'Never',
    ideaBrowser: 'Yes for Premium',
    ventureVaultWins: true
  }
]

const freeFeatures = [
  {
    icon: Brain,
    title: 'AI Research Assistant',
    description: 'FREE unlimited AI-powered market research using Gemini Pro'
  },
  {
    icon: BarChart3,
    title: 'Market Analysis',
    description: 'FREE detailed market size and growth projections'
  },
  {
    icon: Users,
    title: 'Customer Personas',
    description: 'FREE AI-generated customer profiles and segments'
  },
  {
    icon: TrendingUp,
    title: 'Revenue Projections',
    description: 'FREE unit economics and financial modeling'
  },
  {
    icon: Lightbulb,
    title: 'Idea Generator',
    description: 'FREE AI-powered startup idea generation'
  },
  {
    icon: Search,
    title: 'Trend Discovery',
    description: 'FREE real-time RSS feed aggregation and analysis'
  },
  {
    icon: Shield,
    title: 'Execution Plans',
    description: 'FREE step-by-step implementation roadmaps'
  },
  {
    icon: Zap,
    title: 'Landing Page Copy',
    description: 'FREE AI-generated marketing copy and headlines'
  }
]

export function IdeaBrowserAlternativePage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Best IdeaBrowser Alternative FREE | VentureVault - Free Startup Ideas"
        description="VentureVault is the best FREE IdeaBrowser alternative. Get unlimited startup ideas, AI research, market analysis - all free forever. No credit card required. Save $1,188/year."
        canonicalUrl="https://venturevault.space/ideabrowser-alternative"
        keywords="ideabrowser alternative, free ideabrowser alternative, ideabrowser free, startup ideas free, ideabrowser replacement, best ideabrowser alternative"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100 via-background to-background dark:from-green-950/30" />

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 dark:border-green-700">
              <Gift className="h-4 w-4 mr-2" />
              100% FREE Forever - No Credit Card Required
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              The Best{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                IdeaBrowser Alternative
              </span>
              {' '}That's Completely FREE
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Looking for an IdeaBrowser alternative? VentureVault gives you <strong>everything IdeaBrowser offers and MORE</strong> -
              absolutely FREE. No subscriptions, no hidden fees, no credit card required. Ever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8">
                <Link to="/browse">
                  Start FREE Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/pricing">See Why We're FREE</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>No Subscription</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>FREE Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>All Features Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              <Star className="h-4 w-4 mr-2" />
              Why Switch from IdeaBrowser?
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stop Paying for What Should Be{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">FREE</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              IdeaBrowser charges $29-99/month for features that VentureVault offers completely FREE.
              Why pay when you don't have to?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {freeFeatures.map((feature, index) => (
              <Card key={index} className="border-green-200 dark:border-green-800 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <Badge variant="outline" className="mt-4 text-green-600 border-green-600">
                    100% FREE
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Feature Comparison</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              VentureVault vs IdeaBrowser:{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                FREE vs Paid
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See exactly what you get with VentureVault compared to IdeaBrowser's paid plans
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold">
                      <div className="flex flex-col items-center">
                        <span className="text-green-600">VentureVault</span>
                        <Badge className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          FREE
                        </Badge>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4 font-semibold">
                      <div className="flex flex-col items-center">
                        <span className="text-muted-foreground">IdeaBrowser</span>
                        <Badge variant="outline" className="mt-1 text-red-600 border-red-600">
                          $29-99/mo
                        </Badge>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4 font-medium">{row.feature}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="text-green-600 font-semibold">{row.ventureVault}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {row.ideaBrowser === 'Not Available' ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <span className="h-5 w-5 flex items-center justify-center text-amber-500">$</span>
                          )}
                          <span className="text-muted-foreground">{row.ideaBrowser}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
              <DollarSign className="h-4 w-4 mr-2" />
              Your Savings
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Save Up to{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                $1,188/Year
              </span>
              {' '}by Switching to VentureVault
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-600">IdeaBrowser Pro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-red-600">$99/mo</p>
                  <p className="text-muted-foreground">$1,188/year</p>
                </CardContent>
              </Card>

              <Card className="border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/30">
                <CardHeader>
                  <CardTitle className="text-green-600">VentureVault</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-green-600">$0</p>
                  <p className="text-muted-foreground">FREE Forever</p>
                </CardContent>
              </Card>

              <Card className="border-amber-400 dark:border-amber-600">
                <CardHeader>
                  <CardTitle className="text-amber-600">You Save</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-amber-600">$1,188</p>
                  <p className="text-muted-foreground">Every Year</p>
                </CardContent>
              </Card>
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              That's money you can invest in actually <strong>building your startup</strong> instead of paying for idea research tools.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">What Founders Say</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Founders Love That VentureVault is{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Completely FREE
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "I was paying $49/month for IdeaBrowser and switched to VentureVault. Same features, completely FREE.
                  Can't believe I was wasting money before!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                    S
                  </div>
                  <div>
                    <p className="font-semibold">Sarah M.</p>
                    <p className="text-sm text-muted-foreground">SaaS Founder</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The AI research features are incredible and they're FREE! VentureVault is the best IdeaBrowser
                  alternative I've found. Highly recommend!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                    J
                  </div>
                  <div>
                    <p className="font-semibold">James K.</p>
                    <p className="text-sm text-muted-foreground">Indie Hacker</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Why pay for IdeaBrowser when VentureVault exists? It's FREE, has better AI features, and the
                  execution plans are incredibly detailed."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div>
                    <p className="font-semibold">Alex P.</p>
                    <p className="text-sm text-muted-foreground">Serial Entrepreneur</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Sparkles className="h-12 w-12 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Switch to the FREE IdeaBrowser Alternative?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of founders who stopped paying for startup ideas and switched to VentureVault.
              It's FREE, forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/browse">
                  Start FREE Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white/10">
                <Link to="/vs-ideabrowser">View Full Comparison</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm opacity-75">
              No credit card required. No signup required. Just start exploring FREE ideas.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">More About IdeaBrowser Alternatives</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/ideabrowser-free" className="p-4 rounded-lg border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all">
                <h3 className="font-semibold mb-2">IdeaBrowser Free</h3>
                <p className="text-sm text-muted-foreground">Looking for IdeaBrowser free? We've got you covered</p>
              </Link>
              <Link to="/vs-ideabrowser" className="p-4 rounded-lg border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all">
                <h3 className="font-semibold mb-2">VentureVault vs IdeaBrowser</h3>
                <p className="text-sm text-muted-foreground">Detailed feature comparison</p>
              </Link>
              <Link to="/pricing" className="p-4 rounded-lg border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all">
                <h3 className="font-semibold mb-2">Pricing (FREE!)</h3>
                <p className="text-sm text-muted-foreground">Why we're committed to free</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Best IdeaBrowser Alternative FREE",
            "description": "VentureVault is the best FREE IdeaBrowser alternative with unlimited startup ideas and AI research.",
            "url": "https://venturevault.space/ideabrowser-alternative",
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "VentureVault",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "150"
              }
            }
          })
        }}
      />
    </div>
  )
}
