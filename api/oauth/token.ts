import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'method_not_allowed',
      error_description: 'Only POST requests are allowed'
    })
  }

  // Parse body (handle both JSON and form-urlencoded)
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      // Try parsing as form-urlencoded
      body = Object.fromEntries(new URLSearchParams(body))
    }
  }

  const {
    grant_type,
    code,
    redirect_uri,
    client_id,
    client_secret,
    refresh_token
  } = body

  // Validate grant_type
  if (grant_type !== 'authorization_code' && grant_type !== 'refresh_token') {
    return res.status(400).json({
      error: 'unsupported_grant_type',
      error_description: 'Only authorization_code and refresh_token grant types are supported'
    })
  }

  // Handle refresh token grant
  if (grant_type === 'refresh_token') {
    if (!refresh_token) {
      return res.status(400).json({
        error: 'invalid_request',
        error_description: 'refresh_token is required'
      })
    }

    try {
      // Look up refresh token in database
      const { data: tokenData, error: tokenError } = await supabase
        .from('oauth_refresh_tokens')
        .select('*')
        .eq('refresh_token', refresh_token)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (tokenError || !tokenData) {
        return res.status(400).json({
          error: 'invalid_grant',
          error_description: 'Invalid or expired refresh token'
        })
      }

      // Generate new access token
      const newAccessToken = randomUUID() + '-' + randomUUID()
      const newRefreshToken = randomUUID() + '-' + randomUUID()
      const expiresIn = 3600 // 1 hour

      // Store new tokens
      await supabase.from('oauth_access_tokens').insert({
        access_token: newAccessToken,
        user_id: tokenData.user_id,
        client_id: tokenData.client_id,
        supabase_token: tokenData.supabase_token,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + expiresIn * 1000).toISOString()
      })

      await supabase.from('oauth_refresh_tokens').insert({
        refresh_token: newRefreshToken,
        user_id: tokenData.user_id,
        client_id: tokenData.client_id,
        supabase_token: tokenData.supabase_token,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      })

      // Delete old refresh token
      await supabase
        .from('oauth_refresh_tokens')
        .delete()
        .eq('refresh_token', refresh_token)

      return res.status(200).json({
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: expiresIn,
        refresh_token: newRefreshToken,
        scope: 'read'
      })

    } catch (err) {
      console.error('Refresh token error:', err)
      return res.status(500).json({
        error: 'server_error',
        error_description: 'Failed to refresh token'
      })
    }
  }

  // Handle authorization code grant
  if (!code) {
    return res.status(400).json({
      error: 'invalid_request',
      error_description: 'code is required'
    })
  }

  // Validate client_id
  const validClientIds = [
    process.env.CHATGPT_CLIENT_ID || 'venturevault-chatgpt',
    'venturevault-chatgpt'
  ]

  if (client_id && !validClientIds.includes(client_id)) {
    return res.status(400).json({
      error: 'invalid_client',
      error_description: 'Unknown client_id'
    })
  }

  // Validate client_secret if provided
  const validSecrets = [
    process.env.CHATGPT_CLIENT_SECRET,
    'venturevault-secret' // Fallback for testing
  ].filter(Boolean)

  if (client_secret && !validSecrets.includes(client_secret)) {
    return res.status(400).json({
      error: 'invalid_client',
      error_description: 'Invalid client_secret'
    })
  }

  try {
    // Look up authorization code in database
    const { data: codeData, error: codeError } = await supabase
      .from('oauth_codes')
      .select('*')
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (codeError || !codeData) {
      return res.status(400).json({
        error: 'invalid_grant',
        error_description: 'Invalid or expired authorization code'
      })
    }

    // Validate redirect_uri matches (if provided)
    if (redirect_uri && codeData.redirect_uri && redirect_uri !== codeData.redirect_uri) {
      return res.status(400).json({
        error: 'invalid_grant',
        error_description: 'redirect_uri mismatch'
      })
    }

    // Delete the used authorization code
    await supabase.from('oauth_codes').delete().eq('code', code)

    // Generate access token and refresh token
    const accessToken = randomUUID() + '-' + randomUUID()
    const newRefreshToken = randomUUID() + '-' + randomUUID()
    const expiresIn = 3600 // 1 hour

    // Store access token
    await supabase.from('oauth_access_tokens').insert({
      access_token: accessToken,
      user_id: codeData.user_id,
      client_id: codeData.client_id || 'venturevault-chatgpt',
      supabase_token: codeData.access_token, // Store the original Supabase token
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + expiresIn * 1000).toISOString()
    })

    // Store refresh token
    await supabase.from('oauth_refresh_tokens').insert({
      refresh_token: newRefreshToken,
      user_id: codeData.user_id,
      client_id: codeData.client_id || 'venturevault-chatgpt',
      supabase_token: codeData.access_token,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    })

    return res.status(200).json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token: newRefreshToken,
      scope: 'read'
    })

  } catch (err) {
    console.error('Token exchange error:', err)
    return res.status(500).json({
      error: 'server_error',
      error_description: 'Failed to exchange authorization code'
    })
  }
}
