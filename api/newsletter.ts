// Vercel Serverless Function: Newsletter Subscription
// Endpoint: POST /api/newsletter

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

interface SubscribeRequest {
  email: string
  source?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase credentials')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const { email, source = 'website' } = req.body as SubscribeRequest

  // Validate email
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email format' })
  }

  const normalizedEmail = email.trim().toLowerCase()

  try {
    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .single()

    if (existing) {
      if (existing.is_active) {
        return res.status(400).json({ error: 'You are already subscribed!' })
      } else {
        // Reactivate subscription
        await supabase
          .from('newsletter_subscribers')
          .update({
            is_active: true,
            unsubscribed_at: null,
            subscribed_at: new Date().toISOString()
          })
          .eq('id', existing.id)

        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.'
        })
      }
    }

    // Create new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: normalizedEmail,
        source,
        is_active: true,
        subscribed_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      throw new Error('Failed to save subscription')
    }

    // Send welcome email via Resend (if configured)
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'VentureVault <ideas@venturevault.space>',
            to: normalizedEmail,
            subject: '🚀 Welcome to VentureVault Daily Ideas!',
            html: getWelcomeEmailHTML()
          })
        })
      } catch (emailError) {
        // Don't fail the subscription if email fails
        console.error('Welcome email failed:', emailError)
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed! Check your inbox for a welcome email.'
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to subscribe'
    })
  }
}

function getWelcomeEmailHTML(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7c3aed; margin: 0;">🚀 VentureVault</h1>
    <p style="color: #666; margin: 5px 0;">Your Vault of Million-Dollar Startup Ideas</p>
  </div>

  <div style="background: linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%); border-radius: 12px; padding: 30px; margin-bottom: 20px;">
    <h2 style="color: #4c1d95; margin-top: 0;">Welcome to the Daily Ideas Newsletter! 🎉</h2>
    <p>You're now subscribed to receive a curated startup idea every morning, complete with:</p>
    <ul style="color: #555;">
      <li>📊 Market analysis and validation scores</li>
      <li>👥 Target customer personas</li>
      <li>💰 Revenue potential and unit economics</li>
      <li>💡 3 actionable tips to get started</li>
    </ul>
  </div>

  <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <h3 style="color: #4c1d95; margin-top: 0;">While You Wait for Tomorrow's Email...</h3>
    <p>Get a head start by exploring our full library:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="https://venturevault.space/browse" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Browse 65+ Ideas →</a>
    </div>
    <p style="text-align: center;">
      <a href="https://venturevault.space/ai-research" style="color: #7c3aed;">Or try our AI Research tool for deep market analysis</a>
    </p>
  </div>

  <div style="text-align: center; color: #888; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
    <p>You're receiving this because you subscribed at venturevault.space</p>
    <p><a href="https://venturevault.space/unsubscribe" style="color: #888;">Unsubscribe</a></p>
  </div>

</body>
</html>
  `.trim()
}
