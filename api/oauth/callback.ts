import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Store authorization codes (in production, use Redis or database)
const authorizationCodes = new Map<string, {
  user_id: string
  access_token: string
  redirect_uri: string
  client_id: string
  created_at: number
}>()

// Store pending OAuth requests (shared with authorize endpoint)
const pendingRequests = new Map<string, {
  client_id: string
  redirect_uri: string
  state: string
  code_challenge?: string
  code_challenge_method?: string
  created_at: number
}>()

// Clean up old codes (older than 10 minutes)
function cleanupOldCodes() {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000
  for (const [key, value] of authorizationCodes.entries()) {
    if (value.created_at < tenMinutesAgo) {
      authorizationCodes.delete(key)
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cleanupOldCodes()

  const { session_id, access_token, error, error_description } = req.query

  // Handle OAuth provider errors
  if (error) {
    return res.status(400).send(getErrorPageHtml(
      error as string,
      (error_description as string) || 'Authentication failed'
    ))
  }

  // Get the pending request
  if (!session_id) {
    return res.status(400).send(getErrorPageHtml(
      'invalid_request',
      'Missing session_id parameter'
    ))
  }

  // Try to get pending request from database (for cross-request persistence)
  // For now, we'll handle the case where user comes back with access_token directly

  if (access_token) {
    // Verify the access token with Supabase
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser(access_token as string)

      if (userError || !user) {
        return res.status(401).send(getErrorPageHtml(
          'invalid_token',
          'Invalid or expired access token'
        ))
      }

      // Get or create the pending request info from database
      const { data: pendingData } = await supabase
        .from('oauth_pending_requests')
        .select('*')
        .eq('session_id', session_id)
        .single()

      if (!pendingData) {
        // Fallback: Use default ChatGPT redirect
        const code = randomUUID()

        authorizationCodes.set(code, {
          user_id: user.id,
          access_token: access_token as string,
          redirect_uri: 'https://chat.openai.com/aip/g-placeholder/oauth/callback',
          client_id: 'venturevault-chatgpt',
          created_at: Date.now()
        })

        // Store code in database for token exchange
        await supabase.from('oauth_codes').upsert({
          code,
          user_id: user.id,
          access_token: access_token as string,
          client_id: 'venturevault-chatgpt',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        })

        return res.status(200).send(getSuccessPageHtml(code))
      }

      // Generate authorization code
      const code = randomUUID()

      // Store the code with user info
      authorizationCodes.set(code, {
        user_id: user.id,
        access_token: access_token as string,
        redirect_uri: pendingData.redirect_uri,
        client_id: pendingData.client_id,
        created_at: Date.now()
      })

      // Store in database for cross-instance access
      await supabase.from('oauth_codes').upsert({
        code,
        user_id: user.id,
        access_token: access_token as string,
        redirect_uri: pendingData.redirect_uri,
        client_id: pendingData.client_id,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      })

      // Clean up pending request
      await supabase
        .from('oauth_pending_requests')
        .delete()
        .eq('session_id', session_id)

      // Redirect back to ChatGPT with authorization code
      const redirectUrl = new URL(pendingData.redirect_uri)
      redirectUrl.searchParams.set('code', code)
      redirectUrl.searchParams.set('state', pendingData.state)

      return res.redirect(302, redirectUrl.toString())

    } catch (err) {
      console.error('OAuth callback error:', err)
      return res.status(500).send(getErrorPageHtml(
        'server_error',
        'An unexpected error occurred'
      ))
    }
  }

  // Handle Supabase OAuth redirect (after Google/GitHub login)
  // The hash fragment contains the access token, but we can't read it server-side
  // So we serve a page that reads the fragment and calls back
  return res.status(200).send(getHashReaderHtml(session_id as string))
}

function getHashReaderHtml(sessionId: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authorizing... - VentureVault</title>
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
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e5e7eb;
      border-top-color: #7c3aed;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    h1 { color: #1f2937; font-size: 24px; margin-bottom: 12px; }
    p { color: #6b7280; font-size: 14px; }
    .error { color: #dc2626; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h1>Authorizing...</h1>
    <p>Please wait while we complete the authorization.</p>
    <p class="error" id="error"></p>
  </div>

  <script>
    // Check for access token in hash fragment (from Supabase OAuth)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const sessionId = '${sessionId}';

    if (accessToken) {
      // Redirect to callback with access token
      window.location.href = '/api/oauth/callback?session_id=' + sessionId + '&access_token=' + accessToken;
    } else {
      // Check URL params for error
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      if (error) {
        document.getElementById('error').textContent = error;
        document.getElementById('error').style.display = 'block';
      } else {
        document.getElementById('error').textContent = 'No access token received. Please try again.';
        document.getElementById('error').style.display = 'block';
      }
    }
  </script>
</body>
</html>
`
}

function getSuccessPageHtml(code: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authorized - VentureVault</title>
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
    .code-box {
      background: #f3f4f6;
      border-radius: 8px;
      padding: 12px;
      margin: 16px 0;
      font-family: monospace;
      font-size: 12px;
      word-break: break-all;
      color: #374151;
    }
    .back-link {
      display: inline-block;
      margin-top: 16px;
      color: #7c3aed;
      text-decoration: none;
      font-size: 14px;
    }
    .back-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>
    <h1>Authorization Successful</h1>
    <p>You've authorized ChatGPT to access your VentureVault account.</p>
    <p>If you're not automatically redirected, copy the code below and paste it in ChatGPT:</p>
    <div class="code-box">${code}</div>
    <a href="https://venturevault.space" class="back-link">Return to VentureVault</a>
  </div>
</body>
</html>
`
}

function getErrorPageHtml(error: string, description: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - VentureVault</title>
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
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .icon svg { width: 32px; height: 32px; color: white; }
    h1 { color: #1f2937; font-size: 24px; margin-bottom: 12px; }
    p { color: #6b7280; font-size: 14px; line-height: 1.6; }
    .error-code { color: #dc2626; font-family: monospace; margin-top: 8px; }
    .back-link {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </div>
    <h1>Authorization Failed</h1>
    <p>${description}</p>
    <p class="error-code">Error: ${error}</p>
    <a href="https://venturevault.space" class="back-link">Return to VentureVault</a>
  </div>
</body>
</html>
`
}

// Export authorization codes for use by token endpoint
export { authorizationCodes }
