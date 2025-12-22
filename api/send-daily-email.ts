// Vercel Serverless Function: Send Daily Newsletter
// Endpoint: GET /api/send-daily-email
// Triggered by Vercel Cron at 7 AM EST (12:00 UTC)

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

// Import ideas data - we'll use a simplified version for the email
const quickTips: Record<string, string[]> = {
  "SaaS": [
    "Start with a landing page to validate demand before building",
    "Focus on one core feature that solves the biggest pain point",
    "Offer a free trial or freemium tier to reduce friction"
  ],
  "AI/ML": [
    "Use existing AI APIs (OpenAI, Anthropic) before building custom models",
    "Start with a narrow use case and expand from there",
    "Focus on data quality - your AI is only as good as your training data"
  ],
  "E-commerce": [
    "Test with a small product catalog before scaling inventory",
    "Focus on one customer segment initially",
    "Automate fulfillment early to maintain margins"
  ],
  "FinTech": [
    "Understand regulatory requirements before building",
    "Partner with established financial institutions initially",
    "Security and compliance are non-negotiable from day one"
  ],
  "HealthTech": [
    "Start with wellness features that don't require FDA approval",
    "Partner with healthcare professionals for credibility",
    "HIPAA compliance is essential if handling health data"
  ],
  "EdTech": [
    "Focus on measurable learning outcomes",
    "Gamification increases engagement but content is king",
    "Partner with teachers/educators for curriculum development"
  ],
  "MarketPlace": [
    "Start by solving the chicken-and-egg problem on one side",
    "Focus on a specific niche before expanding",
    "Trust and safety features are critical for adoption"
  ]
}

const defaultTips = [
  "Talk to 10 potential customers before writing any code",
  "Build an MVP in 30 days or less to test assumptions",
  "Focus on distribution as much as product"
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a legitimate cron request or manual trigger
  const authHeader = req.headers.authorization
  const cronSecret = process.env.CRON_SECRET

  // Allow cron requests (Vercel sends auth header) or requests with valid secret
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Also allow if no secret is set (for testing)
    if (cronSecret) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Missing Supabase credentials' })
  }

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing Resend API key' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  try {
    // Get all active subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true)

    if (fetchError) {
      throw new Error(`Failed to fetch subscribers: ${fetchError.message}`)
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({ message: 'No active subscribers', sent: 0 })
    }

    // Select today's featured idea (rotate based on day of year)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    const ideaIndex = dayOfYear % 65 // Rotate through 65 ideas

    // Fetch the idea from our data
    const idea = await getIdeaOfTheDay(ideaIndex)

    if (!idea) {
      throw new Error('Failed to get idea of the day')
    }

    // Get category-specific tips
    const tips = quickTips[idea.category] || defaultTips

    // Send emails in batches to avoid rate limits
    const batchSize = 50
    let sentCount = 0
    let failedCount = 0

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      const emails = batch.map(s => s.email)

      try {
        await fetch('https://api.resend.com/emails/batch', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emails.map(email => ({
            from: process.env.RESEND_FROM_EMAIL || 'VentureVault <ideas@venturevault.space>',
            to: email,
            subject: `🚀 Today's Startup Idea: ${idea.title}`,
            html: getDailyEmailHTML(idea, tips)
          })))
        })
        sentCount += batch.length
      } catch (batchError) {
        console.error('Batch send error:', batchError)
        failedCount += batch.length
      }

      // Small delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    // Log the send
    await supabase
      .from('email_logs')
      .insert({
        type: 'daily_newsletter',
        idea_id: idea.id,
        sent_count: sentCount,
        failed_count: failedCount,
        sent_at: new Date().toISOString()
      })
      .catch(() => {}) // Don't fail if logging fails

    return res.status(200).json({
      success: true,
      sent: sentCount,
      failed: failedCount,
      idea: idea.title
    })

  } catch (error) {
    console.error('Daily email error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to send daily emails'
    })
  }
}

interface IdeaData {
  id: string
  title: string
  description: string
  category: string
  marketScore: number
  competitionLevel: string
  potentialRevenue: string
  marketSize: string
  timeToMVP: string
}

async function getIdeaOfTheDay(index: number): Promise<IdeaData | null> {
  // Hardcoded sample ideas for the email - in production, fetch from database
  const sampleIdeas: IdeaData[] = [
    {
      id: "ai-finance-coach",
      title: "AI Personal Finance Coach",
      description: "AI assistant that analyzes spending, suggests budgets, and provides personalized financial advice.",
      category: "FinTech",
      marketScore: 85,
      competitionLevel: "Medium",
      potentialRevenue: "$50M+",
      marketSize: "$1.5 Trillion",
      timeToMVP: "3-4 months"
    },
    {
      id: "ai-code-reviewer",
      title: "AI Code Review Assistant",
      description: "Automated code review tool that catches bugs, suggests improvements, and ensures best practices.",
      category: "SaaS",
      marketScore: 82,
      competitionLevel: "High",
      potentialRevenue: "$40M+",
      marketSize: "$26.8 Billion",
      timeToMVP: "2-3 months"
    },
    {
      id: "sustainable-fashion",
      title: "AI Sustainable Fashion Marketplace",
      description: "Platform connecting eco-conscious consumers with verified sustainable fashion brands.",
      category: "E-commerce",
      marketScore: 78,
      competitionLevel: "Low",
      potentialRevenue: "$30M+",
      marketSize: "$8.25 Billion",
      timeToMVP: "3-4 months"
    }
  ]

  return sampleIdeas[index % sampleIdeas.length] || sampleIdeas[0]
}

function getDailyEmailHTML(idea: IdeaData, tips: string[]): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">

  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #7c3aed; margin: 0; font-size: 24px;">🚀 VentureVault</h1>
    <p style="color: #666; margin: 5px 0; font-size: 14px;">Your Daily Startup Idea</p>
  </div>

  <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); border-radius: 12px; padding: 24px; margin-bottom: 20px; color: white;">
    <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">🎯 TODAY'S FEATURED IDEA</p>
    <h2 style="margin: 0 0 12px 0; font-size: 22px;">${idea.title}</h2>
    <p style="margin: 0; opacity: 0.95; font-size: 15px;">${idea.description}</p>
  </div>

  <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
    <h3 style="margin: 0 0 16px 0; color: #4c1d95; font-size: 16px;">📊 Quick Stats</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
          <span style="color: #666;">Market Score</span>
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
          <strong style="color: ${idea.marketScore >= 80 ? '#16a34a' : idea.marketScore >= 60 ? '#ca8a04' : '#ea580c'};">${idea.marketScore}/100</strong>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
          <span style="color: #666;">Competition</span>
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
          <span style="background: ${idea.competitionLevel === 'Low' ? '#dcfce7' : idea.competitionLevel === 'Medium' ? '#fef3c7' : '#fee2e2'}; color: ${idea.competitionLevel === 'Low' ? '#166534' : idea.competitionLevel === 'Medium' ? '#92400e' : '#991b1b'}; padding: 2px 8px; border-radius: 12px; font-size: 13px;">${idea.competitionLevel}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
          <span style="color: #666;">Market Size</span>
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
          <strong>${idea.marketSize}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
          <span style="color: #666;">Revenue Potential</span>
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">
          <strong style="color: #16a34a;">${idea.potentialRevenue}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">
          <span style="color: #666;">Time to MVP</span>
        </td>
        <td style="padding: 8px 0; text-align: right;">
          <strong>${idea.timeToMVP}</strong>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin-top: 20px;">
      <a href="https://venturevault.space/idea/${idea.id}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Full Analysis →</a>
    </div>
  </div>

  <div style="background: #fffbeb; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #fde68a;">
    <h3 style="margin: 0 0 16px 0; color: #92400e; font-size: 16px;">💡 3 Quick Tips for ${idea.category}</h3>
    <ol style="margin: 0; padding-left: 20px; color: #78350f;">
      ${tips.map(tip => `<li style="margin-bottom: 8px;">${tip}</li>`).join('')}
    </ol>
  </div>

  <div style="text-align: center; margin-bottom: 20px;">
    <a href="https://venturevault.space/browse" style="color: #7c3aed; margin-right: 16px; text-decoration: none;">Browse All Ideas</a>
    <a href="https://venturevault.space/ai-research" style="color: #7c3aed; text-decoration: none;">AI Research Tool</a>
  </div>

  <div style="text-align: center; color: #888; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
    <p style="margin: 0 0 8px 0;">VentureVault - Your daily dose of startup inspiration</p>
    <p style="margin: 0;">
      <a href="https://venturevault.space/unsubscribe" style="color: #888;">Unsubscribe</a>
    </p>
  </div>

</body>
</html>
  `.trim()
}
