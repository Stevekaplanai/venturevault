import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomUUID } from 'crypto'

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

// Store pending OAuth requests (in production, use Redis or database)
const pendingRequests = new Map<string, {
  client_id: string
  redirect_uri: string
  state: string
  code_challenge?: string
  code_challenge_method?: string
  created_at: number
}>()

// Clean up old pending requests (older than 10 minutes)
function cleanupOldRequests() {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000
  for (const [key, value] of pendingRequests.entries()) {
    if (value.created_at < tenMinutesAgo) {
      pendingRequests.delete(key)
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cleanupOldRequests()

  // Accept parameters from query string OR body (for POST requests)
  const params = { ...req.query, ...req.body }

  const client_id = params.client_id as string
  const redirect_uri = params.redirect_uri as string
  const response_type = params.response_type as string
  const state = params.state as string || randomUUID() // Generate state if not provided
  const code_challenge = params.code_challenge as string
  const code_challenge_method = params.code_challenge_method as string
  const scope = params.scope as string

  // Validate required parameters (state is now optional)
  if (!client_id || !redirect_uri || !response_type) {
    return res.status(400).json({
      error: 'invalid_request',
      error_description: 'Missing required parameters: client_id, redirect_uri, response_type',
      received: { client_id: !!client_id, redirect_uri: !!redirect_uri, response_type: !!response_type }
    })
  }

  // Validate client_id (in production, check against registered clients)
  const validClientIds = [
    process.env.CHATGPT_CLIENT_ID || 'venturevault-chatgpt',
    'venturevault-chatgpt'
  ]

  if (!validClientIds.includes(client_id as string)) {
    return res.status(400).json({
      error: 'invalid_client',
      error_description: 'Unknown client_id'
    })
  }

  // Validate redirect_uri (must be OpenAI/ChatGPT callback URL)
  const redirectUriStr = redirect_uri as string
  const validDomains = [
    'chat.openai.com',
    'chatgpt.com',
    'platform.openai.com',
    'openai.com',
    'auth.openai.com',
    'auth0.openai.com'
  ]

  let isValidRedirect = false
  try {
    const url = new URL(redirectUriStr)
    isValidRedirect = validDomains.some(domain =>
      url.hostname === domain || url.hostname.endsWith('.' + domain)
    )
  } catch {
    isValidRedirect = false
  }

  // Also allow custom redirect URI from env
  if (process.env.OAUTH_REDIRECT_URI && redirectUriStr.startsWith(process.env.OAUTH_REDIRECT_URI)) {
    isValidRedirect = true
  }

  if (!isValidRedirect) {
    return res.status(400).json({
      error: 'invalid_redirect_uri',
      error_description: 'Invalid redirect_uri: ' + redirectUriStr
    })
  }

  // Validate response_type
  if (response_type !== 'code') {
    return res.status(400).json({
      error: 'unsupported_response_type',
      error_description: 'Only response_type=code is supported'
    })
  }

  // Generate a unique session ID for this authorization request
  const sessionId = randomUUID()

  // Store the OAuth request details
  pendingRequests.set(sessionId, {
    client_id: client_id as string,
    redirect_uri: redirect_uri as string,
    state: state as string,
    code_challenge: code_challenge as string,
    code_challenge_method: code_challenge_method as string,
    created_at: Date.now()
  })

  // Return the login page HTML
  return res.status(200).send(getLoginPageHtml(sessionId, scope as string, SUPABASE_URL, SUPABASE_ANON_KEY))
}

function getLoginPageHtml(sessionId: string, scope: string | undefined, supabaseUrl: string, supabaseAnonKey: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign In - VentureVault</title>
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
    }
    .logo {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo h1 {
      font-size: 28px;
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .logo p {
      color: #6b7280;
      font-size: 14px;
      margin-top: 8px;
    }
    .scope-info {
      background: #f3f4f6;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .scope-info h3 {
      font-size: 14px;
      color: #374151;
      margin-bottom: 8px;
    }
    .scope-info ul {
      list-style: none;
      padding: 0;
    }
    .scope-info li {
      font-size: 13px;
      color: #6b7280;
      padding: 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .scope-info li::before {
      content: "✓";
      color: #10b981;
      font-weight: bold;
    }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #7c3aed;
    }
    .btn {
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
      margin-bottom: 12px;
    }
    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .divider {
      display: flex;
      align-items: center;
      margin: 20px 0;
      color: #9ca3af;
      font-size: 13px;
    }
    .divider::before,
    .divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }
    .divider span {
      padding: 0 16px;
    }
    .oauth-btn {
      width: 100%;
      padding: 12px;
      background: white;
      color: #374151;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: border-color 0.2s, background 0.2s;
      margin-bottom: 10px;
    }
    .oauth-btn:hover {
      border-color: #7c3aed;
      background: #faf5ff;
    }
    .oauth-btn svg {
      width: 20px;
      height: 20px;
    }
    .error {
      background: #fef2f2;
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 16px;
      display: none;
    }
    .signup-link {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #6b7280;
    }
    .signup-link a {
      color: #7c3aed;
      text-decoration: none;
      font-weight: 500;
    }
    .signup-link a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <h1>VentureVault</h1>
      <p>Sign in to authorize ChatGPT access</p>
    </div>

    <div class="scope-info">
      <h3>ChatGPT is requesting access to:</h3>
      <ul>
        <li>View startup ideas and market analysis</li>
        <li>Search and filter ideas by category</li>
        <li>Access your saved ideas</li>
      </ul>
    </div>

    <div class="error" id="error-message"></div>

    <form id="login-form">
      <input type="hidden" name="session_id" value="${sessionId}" />

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required placeholder="you@example.com" />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required placeholder="Your password" />
      </div>

      <button type="submit" class="btn" id="submit-btn">Sign In & Authorize</button>
    </form>

    <div class="divider"><span>or continue with</span></div>

    <button type="button" class="oauth-btn" onclick="signInWithGoogle()">
      <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Continue with Google
    </button>

    <button type="button" class="oauth-btn" onclick="signInWithGitHub()">
      <svg viewBox="0 0 24 24"><path fill="#333" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      Continue with GitHub
    </button>

    <p class="signup-link">
      Don't have an account? <a href="https://venturevault.space/signup" target="_blank">Sign up</a>
    </p>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    const SUPABASE_URL = '${supabaseUrl}';
    const SUPABASE_ANON_KEY = '${supabaseAnonKey}';
    const SESSION_ID = '${sessionId}';

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorEl = document.getElementById('error-message');
      const submitBtn = document.getElementById('submit-btn');

      errorEl.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        // Redirect to callback with session token
        window.location.href = '/api/oauth/callback?session_id=' + SESSION_ID + '&access_token=' + data.session.access_token;
      } catch (error) {
        errorEl.textContent = error.message || 'Failed to sign in';
        errorEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In & Authorize';
      }
    });

    async function signInWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/api/oauth/callback?session_id=' + SESSION_ID
        }
      });
      if (error) {
        document.getElementById('error-message').textContent = error.message;
        document.getElementById('error-message').style.display = 'block';
      }
    }

    async function signInWithGitHub() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin + '/api/oauth/callback?session_id=' + SESSION_ID
        }
      });
      if (error) {
        document.getElementById('error-message').textContent = error.message;
        document.getElementById('error-message').style.display = 'block';
      }
    }
  </script>
</body>
</html>
`
}

// Export pending requests for use by callback endpoint
export { pendingRequests }
