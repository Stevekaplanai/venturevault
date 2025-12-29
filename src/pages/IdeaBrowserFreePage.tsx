import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SEO } from '@/components/SEO'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  Brain,
  Zap,
  Users,
  DollarSign,
  Search,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Gift,
  Trophy,
  Shield,
  Rocket,
  Target,
  Clock,
  CreditCard
} from 'lucide-react'

const freeVsPaidFeatures = [
  {
    feature: 'Access to Startup Ideas',
    free: 'Unlimited FREE Access',
    paid: 'Limited to plan tier',
    freeWins: true
  },
  {
    feature: 'AI Market Research',
    free: 'FREE Unlimited Queries',
    paid: '$29-99/month extra',
    freeWins: true
  },
  {
    feature: 'Competitor Analysis',
    free: 'FREE Complete Reports',
    paid: 'Premium plans only',
    freeWins: true
  },
  {
    feature: 'Customer Personas',
    free: 'FREE AI-Generated',
    paid: 'Not available',
    freeWins: true
  },
  {
    feature: 'Revenue Projections',
    free: 'FREE Unit Economics',
    paid: 'Not available',
    freeWins: true
  },
  {
    feature: 'Execution Roadmaps',
    free: 'FREE Step-by-Step',
    paid: 'Premium only',
    freeWins: true
  },
  {
    feature: 'Idea Bookmarking',
    free: 'Unlimited FREE',
    paid: '10 ideas max (free tier)',
    freeWins: true
  },
  {
    feature: 'Credit Card Required',
    free: 'Never',
    paid: 'Yes',
    freeWins: true
  }
]

const whyPeopleSearchFree = [
  {
    icon: DollarSign,
    title: 'Tired of Subscriptions',
    description: 'Founders are fed up paying $29-99/month just to browse startup ideas when they\'re bootstrapping'
  },
  {
    icon: Target,
    title: 'Need Full Features',
    description: 'Free tiers of other tools are too limited - you need real market research, not teaser content'
  },
  {
    icon: Clock,
    title: 'No Time for Trials',
    description: '7-day trials aren\'t enough to properly evaluate ideas and make business decisions'
  },
  {
    icon: CreditCard,
    title: 'No Credit Card Hassle',
    description: 'You want to explore without entering payment details or worrying about forgetting to cancel'
  }
]

const freeFeatures = [
  {
    icon: Brain,
    title: 'FREE AI Research',
    description: 'Unlimited AI-powered market research using Google Gemini Pro - completely free'
  },
  {
    icon: BarChart3,
    title: 'FREE Market Analysis',
    description: 'Detailed market size, growth rates, and TAM/SAM/SOM analysis at no cost'
  },
  {
    icon: Users,
    title: 'FREE Customer Personas',
    description: 'AI-generated customer profiles with demographics, pain points, and behaviors'
  },
  {
    icon: TrendingUp,
    title: 'FREE Revenue Models',
    description: 'Complete unit economics with CAC, LTV, and profitability projections'
  },
  {
    icon: Lightbulb,
    title: 'FREE Idea Generator',
    description: 'Generate unlimited custom startup ideas based on your interests'
  },
  {
    icon: Shield,
    title: 'FREE Execution Plans',
    description: 'Step-by-step roadmaps to go from idea to launch'
  },
  {
    icon: Search,
    title: 'FREE Trend Discovery',
    description: 'Real-time RSS feed aggregation from top startup sources'
  },
  {
    icon: Zap,
    title: 'FREE Landing Copy',
    description: 'AI-generated marketing copy and headlines ready to use'
  }
]

const faqs = [
  {
    question: 'Is VentureVault really free like IdeaBrowser isn\'t?',
    answer: 'Yes! VentureVault is 100% free forever. Unlike IdeaBrowser which charges $29-99/month for premium features, VentureVault gives you unlimited access to all features - AI research, market analysis, customer personas, and execution plans - completely free. No credit card required, no trial periods, no hidden fees.'
  },
  {
    question: 'Why is VentureVault free when IdeaBrowser charges?',
    answer: 'We believe entrepreneurship tools should be accessible to everyone. Our mission is to help founders succeed, not to maximize subscription revenue. We\'re building a community-first platform where your success matters more than our profits.'
  },
  {
    question: 'Does the free version have limitations?',
    answer: 'No! There\'s no "free tier" vs "premium tier" on VentureVault. Every feature is available to every user at no cost. You get the same unlimited access whether you signed up today or a year ago. This includes AI research, saving unlimited ideas, generating customer personas, and everything else.'
  },
  {
    question: 'How does VentureVault compare to IdeaBrowser\'s free tier?',
    answer: 'IdeaBrowser\'s free tier is severely limited - you can only save 10 ideas and don\'t get access to detailed research. VentureVault gives you unlimited everything: unlimited ideas, unlimited AI queries, unlimited saves, and complete access to all research tools. It\'s like getting IdeaBrowser\'s Pro plan ($99/month) for free.'
  },
  {
    question: 'Will VentureVault start charging in the future?',
    answer: 'Our core features will remain free forever. That\'s our commitment. We may add optional premium features in the future, but everything you see today - idea browsing, AI research, market analysis, execution plans - will always be free.'
  }
]

export function IdeaBrowserFreePage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="IdeaBrowser Free Alternative | 100% FREE Startup Ideas Tool - VentureVault"
        description="Looking for IdeaBrowser free? VentureVault is the best FREE alternative to IdeaBrowser. Get unlimited startup ideas, AI research, market analysis - all FREE forever. No credit card required."
        canonicalUrl="https://venturevault.space/ideabrowser-free"
        keywords="ideabrowser free, free ideabrowser, ideabrowser alternative free, free startup ideas, ideabrowser free alternative, free idea browser, startup ideas free"
      />

      {/* Hero Section - Heavily optimized for "ideabrowser free" */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100 via-background to-background dark:from-green-950/30" />

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 dark:border-green-700">
              <Gift className="h-4 w-4 mr-2" />
              IdeaBrowser FREE Alternative - No Subscription Required
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Looking for{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                IdeaBrowser Free
              </span>
              ?
              <br />
              <span className="text-3xl md:text-5xl">We've Got You Covered</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              <strong>VentureVault is the FREE IdeaBrowser alternative</strong> you've been searching for.
              Get everything IdeaBrowser offers (and more) without paying $29-99/month.
              <span className="text-green-600 font-semibold"> 100% free, forever.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8">
                <Link to="/browse">
                  Try FREE Now - No Signup <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/vs-ideabrowser">Full Comparison</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <p className="text-3xl font-bold text-green-600">$0</p>
                <p className="text-sm text-muted-foreground">Forever Free</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-muted-foreground">Credit Card Needed</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <p className="text-3xl font-bold text-green-600">&infin;</p>
                <p className="text-sm text-muted-foreground">Unlimited Ideas</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <p className="text-3xl font-bold text-green-600">&infin;</p>
                <p className="text-sm text-muted-foreground">AI Queries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why People Search "IdeaBrowser Free" */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              <Search className="h-4 w-4 mr-2" />
              Why "IdeaBrowser Free"?
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              We Know Why You're Searching for{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                IdeaBrowser Free
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              You shouldn't have to pay $99/month just to explore startup ideas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {whyPeopleSearchFree.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Paid Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">FREE vs Paid</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              VentureVault FREE vs IdeaBrowser{' '}
              <span className="text-red-600">Paid</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what you get for FREE with VentureVault that IdeaBrowser charges for
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-4 px-6 font-semibold">Feature</th>
                      <th className="text-center py-4 px-6 font-semibold">
                        <div className="flex flex-col items-center">
                          <span className="text-green-600">VentureVault</span>
                          <Badge className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            FREE
                          </Badge>
                        </div>
                      </th>
                      <th className="text-center py-4 px-6 font-semibold">
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
                    {freeVsPaidFeatures.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6 font-medium">{row.feature}</td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span className="text-green-600 font-semibold text-sm">{row.free}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {row.paid.includes('Not available') ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <span className="text-amber-500">$</span>
                            )}
                            <span className="text-muted-foreground text-sm">{row.paid}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* All FREE Features */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
              <Trophy className="h-4 w-4 mr-2" />
              Everything FREE
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Get{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                100% FREE
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Features that IdeaBrowser charges $99/month for - we give them to you free
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {freeFeatures.map((feature, index) => (
              <Card key={index} className="border-green-200 dark:border-green-800 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Savings Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              <DollarSign className="h-4 w-4 mr-2" />
              Your Savings
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Save{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                $1,188 Per Year
              </span>
              {' '}vs IdeaBrowser
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-red-200 dark:border-red-800">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">IdeaBrowser Pro</p>
                  <p className="text-4xl font-bold text-red-600">$99</p>
                  <p className="text-muted-foreground">/month</p>
                  <p className="text-sm mt-2">= $1,188/year</p>
                </CardContent>
              </Card>

              <Card className="border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/30 scale-110 relative z-10">
                <CardContent className="pt-6 text-center">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600">Best Value</Badge>
                  <p className="text-sm text-muted-foreground mb-2">VentureVault</p>
                  <p className="text-4xl font-bold text-green-600">$0</p>
                  <p className="text-muted-foreground">forever</p>
                  <p className="text-sm mt-2 text-green-600 font-semibold">100% FREE</p>
                </CardContent>
              </Card>

              <Card className="border-amber-200 dark:border-amber-800">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">You Save</p>
                  <p className="text-4xl font-bold text-amber-600">$1,188</p>
                  <p className="text-muted-foreground">/year</p>
                  <p className="text-sm mt-2">= 100% savings</p>
                </CardContent>
              </Card>
            </div>

            <p className="text-lg text-muted-foreground">
              That's <strong>$1,188</strong> you can invest in actually <strong>building</strong> your startup instead of researching it.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section - Important for SEO */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">FAQs</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              IdeaBrowser Free Alternative:{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Common Questions
              </span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Related Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/ideabrowser-alternative" className="p-4 rounded-lg border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all">
                <h3 className="font-semibold mb-2">IdeaBrowser Alternative</h3>
                <p className="text-sm text-muted-foreground">Full guide on why VentureVault is the best IdeaBrowser alternative</p>
              </Link>
              <Link to="/vs-ideabrowser" className="p-4 rounded-lg border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all">
                <h3 className="font-semibold mb-2">VentureVault vs IdeaBrowser</h3>
                <p className="text-sm text-muted-foreground">Detailed feature-by-feature comparison</p>
              </Link>
              <Link to="/pricing" className="p-4 rounded-lg border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all">
                <h3 className="font-semibold mb-2">Pricing (FREE!)</h3>
                <p className="text-sm text-muted-foreground">See why we're committed to being free forever</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Rocket className="h-12 w-12 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stop Searching for "IdeaBrowser Free"
            </h2>
            <p className="text-xl mb-8 opacity-90">
              You found it. VentureVault gives you everything IdeaBrowser offers -
              <strong> completely FREE</strong>. Start exploring startup ideas now.
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
            <p className="mt-6 text-sm opacity-75">
              No credit card. No signup required. No tricks. Just FREE startup ideas.
            </p>
          </div>
        </div>
      </section>

      {/* JSON-LD Structured Data for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </div>
  )
}
