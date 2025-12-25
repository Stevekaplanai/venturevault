import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')

  return res.status(200).json({
    issuer: "https://venturevault.space",
    authorization_endpoint: "https://venturevault.space/api/oauth/authorize",
    token_endpoint: "https://venturevault.space/api/oauth/token",
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256", "plain"],
    token_endpoint_auth_methods_supported: ["client_secret_post", "client_secret_basic", "none"],
    scopes_supported: ["read", "saved"],
    service_documentation: "https://venturevault.space/api/openapi.json",
    // Static client credentials (no dynamic registration)
    client_id: "venturevault-chatgpt",
    registration_endpoint: null
  })
}
