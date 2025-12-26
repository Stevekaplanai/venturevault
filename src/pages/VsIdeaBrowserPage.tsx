import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Brain,
  Users,
  DollarSign,
  Search,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Star,
  Gift,
  Trophy,
  Target,
  Rocket,
  FileText,
  Globe,
  CreditCard,
  Infinity
} from 'lucide-react'

const detailedComparison = [
  {
    category: 'Pricing & Access',
    features: [
      {
        name: 'Base Price',
        ventureVault: { value: 'FREE Forever', available: true, highlight: true },
        ideaBrowser: { value: '$29-99/month', available: true, highlight: false }
      },
      {
        name: 'Credit Card Required',
        ventureVault: { value: 'Never Required', available: true, highlight: true },
        ideaBrowser: { value: 'Required for Premium', available: false, highlight: false }
      },
      {
        name: 'Free Trial',
        ventureVault: { value: 'Not Needed - Always FREE', available: true, highlight: true },
        ideaBrowser: { value: '7-day trial', available: true, highlight: false }
      },
      {
        name: 'Usage Limits',
        ventureVault: { value: 'Unlimited', available: true, highlight: true },
        ideaBrowser: { value: 'Plan-based limits', available: false, highlight: false }
      }
    ]
  },
  {
    category: 'Startup Ideas',
    features: [
      {
        name: 'Access to Ideas',
        ventureVault: { value: 'Unlimited FREE Access', available: true, highlight: true },
        ideaBrowser: { value: 'Limited by Plan', available: true, highlight: false }
      },
      {
        name: 'Idea Details',
        ventureVault: { value: 'Full Details FREE', available: true, highlight: true },
        ideaBrowser: { value: 'Premium Only', available: false, highlight: false }
      },
      {
        name: 'Save/Bookmark Ideas',
        ventureVault: { value: 'Unlimited FREE', available: true, highlight: true },
        ideaBrowser: { value: '10 ideas max (free)', available: false, highlight: false }
      },
      {
        name: 'Trending Ideas',
        ventureVault: { value: 'FREE Real-time Updates', available: true, highlight: true },
        ideaBrowser: { value: 'Premium Feature', available: false, highlight: false }
      }
    ]
  },
  {
    category: 'AI & Research Tools',
    features: [
      {
        name: 'AI Research Assistant',
        ventureVault: { value: 'FREE Unlimited (Gemini Pro)', available: true, highlight: true },
        ideaBrowser: { value: 'Not Available', available: false, highlight: false }
      },
      {
        name: 'Market Analysis',
        ventureVault: { value: 'FREE Detailed Reports', available: true, highlight: true },
        ideaBrowser: { value: 'Basic Only', available: true, highlight: false }
      },
      {
        name: 'Competition Analysis',
        ventureVault: { value: 'FREE Complete Analysis', available: true, highlight: true },
        ideaBrowser: { value: 'Premium Only', available: false, highlight: false }
      },
      {
        name: 'AI Idea Generator',
        ventureVault: { value: 'FREE Unlimited', available: true, highlight: true },
        ideaBrowser: { value: 'Not Available', available: false, highlight: false }
      }
    ]
  },
  {
    category: 'Business Planning',
    features: [
      {
        name: 'Customer Personas',
        ventureVault: { value: 'FREE AI-Generated', available: true, highlight: true },
        ideaBrowser: { value: 'Not Available', available: false, highlight: false }
      },
      {
        name: 'Unit Economics',
        ventureVault: { value: 'FREE Revenue Models', available: true, highlight: true },
        ideaBrowser: { value: 'Not Available', available: false, highlight: false }
      },
      {
        name: 'Execution Roadmap',
        ventureVault: { value: 'FREE Step-by-Step Plans', available: true, highlight: true },
        ideaBrowser: { value: 'Premium Only', available: false, highlight: false }
      },
      {
        name: 'Landing Page Copy',
        ventureVault: { value: 'FREE AI-Generated', available: true, highlight: true },
        ideaBrowser: { value: 'Not Available', available: false, highlight: false }
      }
    ]
  },
  {
    category: 'Discovery & Trends',
    features: [
      {
        name: 'RSS Feed Discovery',
        ventureVault: { value: 'FREE Real-time', available: true, highlight: true },
        ideaBrowser: { value: 'Not Available', available: false, highlight: false }
      },
      {
        name: 'Trend Analysis',
        ventureVault: { value: 'FREE Included', available: true, highlight: true },
        ideaBrowser: { value: 'Premium Only', available: false, highlight: false }
      },
      {
        name: 'Category Filters',
        ventureVault: { value: 'FREE Advanced Filters', available: true, highlight: true },
        ideaBrowser: { value: 'Basic Only', available: true, highlight: false }
      },
      {
        name: 'Search Functionality',
        ventureVault: { value: 'FREE Full-text Search', available: true, highlight: true },
        ideaBrowser: { value: 'Limited', available: true, highlight: false }
      }
    ]
  }
]

const whyFreeReasons = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'We believe every aspiring entrepreneur deserves FREE access to startup resources'
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Built by founders, for founders. We know how hard bootstrapping can be'
  },
  {
    icon: Rocket,
    title: 'Success Focused',
    description: 'Your success building startups matters more than our subscription revenue'
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'FREE tools mean entrepreneurs worldwide can pursue their dreams'
  }
]

const switchReasons = [
  {
    number: '01',
    title: 'Save $1,188/Year',
    description: 'Stop paying for IdeaBrowser\'s premium plans. VentureVault is completely FREE.'
  },
  {
    number: '02',
    title: 'More Features',
    description: 'Get AI research, customer personas, and execution plans that IdeaBrowser doesn\'t offer.'
  },
  {
    number: '03',
    title: 'No Limits',
    description: 'Unlimited idea access, unlimited saves, unlimited AI queries. All FREE.'
  },
  {
    number: '04',
    title: 'Better AI',
    description: 'Powered by Gemini Pro for superior market research and analysis.'
  }
]

export function VsIdeaBrowserPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-background to-background dark:from-purple-950/30" />

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 dark:border-green-700">
              <Trophy className="h-4 w-4 mr-2" />
              Complete Feature Comparison
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              VentureVault vs IdeaBrowser:{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                FREE vs Paid
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The ultimate comparison between VentureVault and IdeaBrowser. See why thousands of founders
              are switching to the <strong>FREE IdeaBrowser alternative</strong>.
            </p>

            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 mb-8">
              <div className="text-left">
                <p className="text-sm text-muted-foreground">VentureVault Price</p>
                <p className="text-3xl font-bold text-green-600">$0 FREE</p>
              </div>
              <div className="h-12 w-px bg-green-300 dark:bg-green-700" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">IdeaBrowser Price</p>
                <p className="text-3xl font-bold text-red-600">$99/mo</p>
              </div>
              <div className="h-12 w-px bg-green-300 dark:bg-green-700" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">You Save</p>
                <p className="text-3xl font-bold text-amber-600">$1,188/yr</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8">
                <Link to="/browse">
                  Start FREE Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/ideabrowser-alternative">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">$0</p>
              <p className="text-muted-foreground">VentureVault Price</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Infinity className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold">Unlimited</p>
              <p className="text-muted-foreground">FREE Access</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold">AI-Powered</p>
              <p className="text-muted-foreground">FREE Research</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CreditCard className="h-8 w-8 text-amber-600" />
              </div>
              <p className="text-3xl font-bold">No Card</p>
              <p className="text-muted-foreground">Ever Required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Comparison Tables */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Detailed Comparison</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Feature-by-Feature:{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                FREE VentureVault Wins
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare every feature between VentureVault (FREE) and IdeaBrowser (Paid)
            </p>
          </div>

          <div className="space-y-12 max-w-5xl mx-auto">
            {detailedComparison.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  {category.category}
                </h3>

                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="text-left py-4 px-6 font-semibold">Feature</th>
                          <th className="text-center py-4 px-6 font-semibold">
                            <span className="text-green-600">VentureVault</span>
                            <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">FREE</Badge>
                          </th>
                          <th className="text-center py-4 px-6 font-semibold">
                            <span className="text-muted-foreground">IdeaBrowser</span>
                            <Badge variant="outline" className="ml-2 text-red-600 border-red-600">PAID</Badge>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.features.map((feature, featureIndex) => (
                          <tr key={featureIndex} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                            <td className="py-4 px-6 font-medium">{feature.name}</td>
                            <td className="py-4 px-6 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span className={feature.ventureVault.highlight ? 'text-green-600 font-semibold' : ''}>
                                  {feature.ventureVault.value}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {feature.ideaBrowser.available ? (
                                  <span className="text-amber-500">$</span>
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                <span className="text-muted-foreground">{feature.ideaBrowser.value}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Switch Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              <Rocket className="h-4 w-4 mr-2" />
              4 Reasons to Switch
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Switch from IdeaBrowser to{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                FREE VentureVault
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {switchReasons.map((reason, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all">
                <div className="absolute top-4 right-4 text-6xl font-bold text-muted/20">
                  {reason.number}
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                  <p className="text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why FREE Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
              <Gift className="h-4 w-4 mr-2" />
              Our Mission
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why VentureVault is{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                100% FREE Forever
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlike IdeaBrowser, we believe entrepreneurship tools should be accessible to everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {whyFreeReasons.map((reason, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <reason.icon className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-bold mb-2">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Exclusive FREE Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Features You Get{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                FREE with VentureVault
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These features are not available on IdeaBrowser at any price
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>AI Research Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Unlimited AI-powered market research using Gemini Pro. Ask any question about markets, competitors, or trends.
                </p>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">FREE - Not on IdeaBrowser</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Customer Personas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  AI-generated detailed customer profiles with demographics, pain points, and buying behaviors.
                </p>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">FREE - Not on IdeaBrowser</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle>Unit Economics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Complete revenue models with CAC, LTV, margins, and break-even analysis for each idea.
                </p>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">FREE - Not on IdeaBrowser</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>AI Idea Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Generate unlimited custom startup ideas based on your skills, interests, and market preferences.
                </p>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">FREE - Not on IdeaBrowser</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Landing Page Copy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  AI-generated marketing copy, headlines, and CTAs ready to use for your startup landing page.
                </p>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">FREE - Not on IdeaBrowser</Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500/20 to-violet-500/20 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle>RSS Trend Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Real-time RSS feed aggregation from top startup and tech sources to discover emerging trends.
                </p>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">FREE - Not on IdeaBrowser</Badge>
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
              Make the Switch to FREE Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Stop paying $99/month for IdeaBrowser. Get everything you need completely FREE with VentureVault.
              No credit card, no subscription, no limits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/browse">
                  Start FREE Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white/10">
                <Link to="/ai-research">Try FREE AI Research</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>100% FREE Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Unlimited Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>All Features Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
