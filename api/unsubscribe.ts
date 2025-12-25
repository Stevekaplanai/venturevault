import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle both GET (from email link) and POST requests
  const email = req.method === 'GET' ? req.query.email : req.body?.email

  if (!email || typeof email !== 'string') {
    // If no email provided, show the unsubscribe page
    if (req.method === 'GET') {
      return res.status(200).send(getUnsubscribePageHtml())
    }
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    // Update subscriber to inactive
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email.toLowerCase())

    if (error) {
      console.error('Unsubscribe error:', error)
      return res.status(500).json({ error: 'Failed to unsubscribe' })
    }

    // Return success page for GET requests (from email links)
    if (req.method === 'GET') {
      return res.status(200).send(getSuccessPageHtml(email))
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed'
    })

  } catch (error) {
    console.error('Unsubscribe error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

function getUnsubscribePageHtml(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe - VentureVault</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(124, 58, 237, 0.1);
      text-align: center;
    }
    h1 { color: #1f2937; font-size: 24px; margin-bottom: 12px; }
    p { color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      margin-bottom: 16px;
      transition: border-color 0.2s;
    }
    input:focus { outline: none; border-color: #7c3aed; }
    button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3); }
    .back-link {
      display: inline-block;
      margin-top: 20px;
      color: #7c3aed;
      text-decoration: none;
      font-size: 14px;
    }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Unsubscribe</h1>
    <p>We're sorry to see you go! Enter your email below to unsubscribe from our daily startup ideas.</p>
    <form action="/api/unsubscribe" method="GET">
      <input type="email" name="email" placeholder="Enter your email" required />
      <button type="submit">Unsubscribe</button>
    </form>
    <a href="https://venturevault.space" class="back-link">Back to VentureVault</a>
  </div>
</body>
</html>
`
}

function getSuccessPageHtml(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed - VentureVault</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(124, 58, 237, 0.1);
      text-align: center;
    }
    .icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .icon svg { width: 32px; height: 32px; color: white; }
    h1 { color: #1f2937; font-size: 24px; margin-bottom: 12px; }
    p { color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 8px; }
    .email { color: #7c3aed; font-weight: 600; }
    .back-link {
      display: inline-block;
      margin-top: 24px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.2s;
    }
    .back-link:hover { transform: translateY(-1px); }
    .resubscribe {
      display: block;
      margin-top: 16px;
      color: #6b7280;
      font-size: 13px;
    }
    .resubscribe a { color: #7c3aed; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <h1>You're Unsubscribed</h1>
    <p>We've removed <span class="email">${email}</span> from our mailing list.</p>
    <p>You won't receive any more emails from us.</p>
    <a href="https://venturevault.space" class="back-link">Visit VentureVault</a>
    <p class="resubscribe">Changed your mind? <a href="https://venturevault.space">Resubscribe anytime</a></p>
  </div>
</body>
</html>
`
}
