import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const resend = new Resend(process.env.RESEND_API_KEY)

// Hardcoded ideas for the daily email rotation
// In production, you could fetch these from the database
const IDEAS = [
  {
    id: "ai-finance-coach",
    title: "AI-Powered Personal Finance Coach",
    description: "An intelligent app that analyzes spending habits, provides personalized savings recommendations, and automates investment decisions using machine learning.",
    category: "FinTech",
    marketScore: 87,
    competitionLevel: "Medium",
    potentialRevenue: "$50M+",
    marketSize: "$7.3 Billion",
    timeToMVP: "3-4 months"
  },
  {
    id: "remote-team-culture",
    title: "Remote Team Culture Platform",
    description: "A platform that helps remote teams build and maintain company culture through virtual events, recognition systems, and team bonding activities.",
    category: "HR Tech",
    marketScore: 82,
    competitionLevel: "Medium",
    potentialRevenue: "$20M+",
    marketSize: "$4.1 Billion",
    timeToMVP: "2-3 months"
  },
  {
    id: "ai-content-repurpose",
    title: "AI Content Repurposing Tool",
    description: "Transform long-form content into multiple formats (social posts, newsletters, videos) automatically using AI, saving creators hours of work.",
    category: "Creator Economy",
    marketScore: 89,
    competitionLevel: "Medium",
    potentialRevenue: "$30M+",
    marketSize: "$5.2 Billion",
    timeToMVP: "2-3 months"
  },
  {
    id: "subscription-box-b2b",
    title: "B2B Subscription Box Platform",
    description: "A white-label platform for businesses to create and manage subscription box services for their customers, handling logistics and billing.",
    category: "E-commerce",
    marketScore: 78,
    competitionLevel: "Low",
    potentialRevenue: "$15M+",
    marketSize: "$32 Billion",
    timeToMVP: "3-4 months"
  },
  {
    id: "ai-code-reviewer",
    title: "AI Code Review Assistant",
    description: "An AI-powered tool that provides instant code reviews, suggests improvements, and catches bugs before they reach production.",
    category: "Developer Tools",
    marketScore: 91,
    competitionLevel: "High",
    potentialRevenue: "$100M+",
    marketSize: "$12.5 Billion",
    timeToMVP: "4-5 months"
  },
  {
    id: "micro-learning-platform",
    title: "Micro-Learning Platform for Professionals",
    description: "Bite-sized learning modules delivered via mobile, helping busy professionals upskill in 5-minute daily sessions.",
    category: "EdTech",
    marketScore: 84,
    competitionLevel: "Medium",
    potentialRevenue: "$25M+",
    marketSize: "$8.4 Billion",
    timeToMVP: "3-4 months"
  },
  {
    id: "sustainable-packaging",
    title: "Sustainable Packaging Marketplace",
    description: "A B2B marketplace connecting businesses with eco-friendly packaging suppliers, with carbon footprint tracking.",
    category: "Sustainability",
    marketScore: 79,
    competitionLevel: "Low",
    potentialRevenue: "$40M+",
    marketSize: "$15.2 Billion",
    timeToMVP: "2-3 months"
  }
]

// Quick tips that rotate with ideas
const QUICK_TIPS = [
  [
    "Start with a landing page before building the product - validate demand first",
    "Talk to 10 potential customers this week - their feedback is gold",
    "Focus on one core feature for your MVP, not ten mediocre ones"
  ],
  [
    "Your first 10 customers will teach you more than any market research",
    "Build in public - share your journey on Twitter/X to attract early adopters",
    "Price higher than you think - you can always offer discounts"
  ],
  [
    "Use no-code tools for your MVP to launch faster",
    "Create a waitlist before you build - it's free market validation",
    "The best time to start was yesterday. The second best time is now."
  ],
  [
    "Cold email works - send 20 personalized emails daily to potential customers",
    "Document everything you learn - it becomes content marketing gold",
    "Find your first customers in communities where they already hang out"
  ],
  [
    "Revenue is validation. Get to $1 before worrying about scaling to $1M",
    "Your competitors' 1-star reviews are your product roadmap",
    "Ship something this week, even if it's embarrassingly simple"
  ],
  [
    "Partner with one influencer in your niche for instant credibility",
    "Offer a money-back guarantee - it increases conversions more than it costs",
    "Build an email list from day one - it's your most valuable asset"
  ],
  [
    "Solve your own problem first - you're your best first customer",
    "Don't build features, solve problems",
    "Every 'no' gets you closer to your first 'yes'"
  ]
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a cron job or authorized request
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    // In production without proper auth, check if it's from Vercel cron
    const isVercelCron = req.headers['x-vercel-cron'] === '1'
    if (!isVercelCron) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  try {
    // Get all active subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true)

    if (fetchError) {
      console.error('Failed to fetch subscribers:', fetchError)
      return res.status(500).json({ error: 'Failed to fetch subscribers' })
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({ message: 'No active subscribers' })
    }

    // Get today's idea (rotate based on day of year)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const ideaIndex = dayOfYear % IDEAS.length
    const tipsIndex = dayOfYear % QUICK_TIPS.length

    const todayIdea = IDEAS[ideaIndex]
    const todayTips = QUICK_TIPS[tipsIndex]

    // Send emails in batches to respect rate limits
    const BATCH_SIZE = 100
    const batches = []
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      batches.push(subscribers.slice(i, i + BATCH_SIZE))
    }

    let successCount = 0
    let errorCount = 0

    for (const batch of batches) {
      const emailPromises = batch.map(async (subscriber: { email: string }) => {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'VentureVault <ideas@venturevault.space>',
            to: subscriber.email,
            subject: `Today's Startup Idea: ${todayIdea.title}`,
            html: getDailyEmailHtml(todayIdea, todayTips)
          })
          successCount++
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error)
          errorCount++
        }
      })

      await Promise.all(emailPromises)

      // Small delay between batches to respect rate limits
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Log the send
    await supabase
      .from('newsletter_logs')
      .insert({
        idea_id: todayIdea.id,
        subscribers_count: subscribers.length,
        success_count: successCount,
        error_count: errorCount,
        sent_at: new Date().toISOString()
      })
      .catch(err => console.error('Failed to log newsletter send:', err))

    return res.status(200).json({
      success: true,
      sent: successCount,
      failed: errorCount,
      total: subscribers.length,
      idea: todayIdea.title
    })

  } catch (error) {
    console.error('Daily email error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

function getDailyEmailHtml(idea: typeof IDEAS[0], tips: string[]): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Today's Startup Idea</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 30px 40px; text-align: center;">
              <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">
                TODAY'S FEATURED IDEA
              </p>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                ${idea.title}
              </h1>
            </td>
          </tr>

          <!-- Idea Content -->
          <tr>
            <td style="padding: 40px;">

              <!-- Category & Score -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #f3e8ff; color: #7c3aed; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                      ${idea.category}
                    </span>
                    <span style="display: inline-block; margin-left: 8px; color: #6b7280; font-size: 14px;">
                      Market Score: <strong style="color: #059669;">${idea.marketScore}/100</strong>
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Description -->
              <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
                ${idea.description}
              </p>

              <!-- Quick Stats -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 0 0 12px; letter-spacing: 0.5px;">
                      QUICK STATS
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Market Size</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <strong style="color: #1f2937; font-size: 14px;">${idea.marketSize}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Competition</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <strong style="color: #1f2937; font-size: 14px;">${idea.competitionLevel}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 14px;">Time to MVP</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                          <strong style="color: #1f2937; font-size: 14px;">${idea.timeToMVP}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #6b7280; font-size: 14px;">Revenue Potential</span>
                        </td>
                        <td style="padding: 8px 0; text-align: right;">
                          <strong style="color: #059669; font-size: 14px;">${idea.potentialRevenue}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); border-radius: 8px;">
                          <a href="https://venturevault.space/idea/${idea.id}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                            View Full Analysis
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="border-top: 2px solid #e5e7eb;"></td>
                </tr>
              </table>

              <!-- Quick Tips -->
              <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 16px; font-weight: 700;">
                3 Quick Tips for Today
              </h3>

              <table width="100%" cellpadding="0" cellspacing="0">
                ${tips.map((tip, i) => `
                <tr>
                  <td style="padding: 10px 0; ${i < tips.length - 1 ? 'border-bottom: 1px solid #f3f4f6;' : ''}">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 28px; vertical-align: top;">
                          <span style="display: inline-block; width: 20px; height: 20px; background-color: #f3e8ff; color: #7c3aed; border-radius: 50%; text-align: center; line-height: 20px; font-size: 11px; font-weight: 700;">${i + 1}</span>
                        </td>
                        <td style="color: #4b5563; font-size: 14px; line-height: 1.5;">
                          ${tip}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `).join('')}
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <a href="https://venturevault.space/browse" style="color: #7c3aed; text-decoration: none; font-size: 14px; font-weight: 500; margin: 0 12px;">Browse Ideas</a>
                    <span style="color: #d1d5db;">|</span>
                    <a href="https://venturevault.space/ai-research" style="color: #7c3aed; text-decoration: none; font-size: 14px; font-weight: 500; margin: 0 12px;">AI Research</a>
                    <span style="color: #d1d5db;">|</span>
                    <a href="https://venturevault.space/blog" style="color: #7c3aed; text-decoration: none; font-size: 14px; font-weight: 500; margin: 0 12px;">Blog</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px;">
                      VentureVault - Your Vault of Million-Dollar Startup Ideas
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                      <a href="https://venturevault.space/unsubscribe" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
                      &nbsp;|&nbsp;
                      <a href="https://venturevault.space" style="color: #9ca3af; text-decoration: underline;">Visit Website</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
