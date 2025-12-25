import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, source = 'website' } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      if (existing.is_active) {
        return res.status(400).json({ error: 'You\'re already subscribed!' })
      }

      // Reactivate subscription
      await supabase
        .from('newsletter_subscribers')
        .update({
          is_active: true,
          unsubscribed_at: null,
          source
        })
        .eq('email', email.toLowerCase())

      return res.status(200).json({ success: true, message: 'Welcome back!' })
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        source,
        is_active: true
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return res.status(500).json({ error: 'Failed to subscribe' })
    }

    // Send welcome email
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'VentureVault <ideas@venturevault.space>',
        to: email,
        subject: "Welcome to VentureVault - Your First Startup Idea Inside!",
        html: getWelcomeEmailHtml()
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Don't fail the subscription if email fails
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed!'
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

function getWelcomeEmailHtml(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to VentureVault</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                Welcome to VentureVault
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
                Your vault of million-dollar startup ideas
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Hey there, future founder!
              </p>

              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                You're now part of a growing community of 1,000+ founders who receive curated startup ideas every morning. Each idea comes with:
              </p>

              <ul style="color: #374151; font-size: 16px; line-height: 1.8; margin: 0 0 30px; padding-left: 20px;">
                <li><strong>Market Analysis</strong> - Size, growth rate, and competition level</li>
                <li><strong>Customer Personas</strong> - Who you'll be selling to</li>
                <li><strong>90-Day Playbook</strong> - Step-by-step launch plan</li>
                <li><strong>Tech Stack</strong> - What you need to build it</li>
                <li><strong>Unit Economics</strong> - CAC, LTV, and margins</li>
              </ul>

              <!-- Featured Idea Preview -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="color: #7c3aed; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 0 0 8px; letter-spacing: 0.5px;">
                      YOUR FIRST IDEA
                    </p>
                    <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 12px; font-weight: 700;">
                      AI-Powered Personal Finance Coach
                    </h2>
                    <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
                      An intelligent app that analyzes spending habits, provides personalized savings recommendations, and automates investment decisions using machine learning.
                    </p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #7c3aed; border-radius: 8px;">
                          <a href="https://venturevault.space/idea/ai-finance-coach" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">
                            View Full Analysis
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Quick Tips -->
              <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 16px; font-weight: 700;">
                3 Quick Tips to Get Started
              </h3>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <span style="display: inline-block; width: 24px; height: 24px; background-color: #7c3aed; color: #ffffff; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">1</span>
                        </td>
                        <td style="color: #374151; font-size: 14px; line-height: 1.5;">
                          <strong>Browse 65+ Ideas</strong> - Start exploring our curated collection of validated startup ideas
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <span style="display: inline-block; width: 24px; height: 24px; background-color: #7c3aed; color: #ffffff; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">2</span>
                        </td>
                        <td style="color: #374151; font-size: 14px; line-height: 1.5;">
                          <strong>Use AI Research</strong> - Deep-dive into any idea with our AI-powered market research tool
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <span style="display: inline-block; width: 24px; height: 24px; background-color: #7c3aed; color: #ffffff; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700;">3</span>
                        </td>
                        <td style="color: #374151; font-size: 14px; line-height: 1.5;">
                          <strong>Save Your Favorites</strong> - Create an account to bookmark ideas and track your research
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); border-radius: 8px;">
                          <a href="https://venturevault.space/browse" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                            Browse All Ideas
                          </a>
                        </td>
                        <td style="width: 16px;"></td>
                        <td style="background-color: #f3f4f6; border-radius: 8px; border: 2px solid #e5e7eb;">
                          <a href="https://venturevault.space/ai-research" style="display: inline-block; padding: 12px 24px; color: #374151; text-decoration: none; font-weight: 600; font-size: 16px;">
                            AI Research
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0; text-align: center;">
                Questions? Just reply to this email - we read every message!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0">
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
