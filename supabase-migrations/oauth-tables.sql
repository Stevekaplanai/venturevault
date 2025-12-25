-- OAuth Tables for ChatGPT Integration
-- Run this in your Supabase SQL Editor

-- Store pending OAuth authorization requests
CREATE TABLE IF NOT EXISTS oauth_pending_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  client_id TEXT NOT NULL,
  redirect_uri TEXT NOT NULL,
  state TEXT NOT NULL,
  code_challenge TEXT,
  code_challenge_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '10 minutes')
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_oauth_pending_session ON oauth_pending_requests(session_id);
CREATE INDEX IF NOT EXISTS idx_oauth_pending_expires ON oauth_pending_requests(expires_at);

-- Store authorization codes (short-lived, exchanged for tokens)
CREATE TABLE IF NOT EXISTS oauth_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  redirect_uri TEXT,
  access_token TEXT, -- Store the Supabase token for later use
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '10 minutes')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_oauth_codes_code ON oauth_codes(code);
CREATE INDEX IF NOT EXISTS idx_oauth_codes_expires ON oauth_codes(expires_at);

-- Store access tokens
CREATE TABLE IF NOT EXISTS oauth_access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  supabase_token TEXT, -- The original Supabase token
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_oauth_access_token ON oauth_access_tokens(access_token);
CREATE INDEX IF NOT EXISTS idx_oauth_access_expires ON oauth_access_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_oauth_access_user ON oauth_access_tokens(user_id);

-- Store refresh tokens
CREATE TABLE IF NOT EXISTS oauth_refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refresh_token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  supabase_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_oauth_refresh_token ON oauth_refresh_tokens(refresh_token);
CREATE INDEX IF NOT EXISTS idx_oauth_refresh_expires ON oauth_refresh_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_oauth_refresh_user ON oauth_refresh_tokens(user_id);

-- Enable Row Level Security
ALTER TABLE oauth_pending_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Service role has full access to pending requests" ON oauth_pending_requests
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to codes" ON oauth_codes
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to access tokens" ON oauth_access_tokens
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to refresh tokens" ON oauth_refresh_tokens
  FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON oauth_pending_requests TO service_role;
GRANT ALL ON oauth_codes TO service_role;
GRANT ALL ON oauth_access_tokens TO service_role;
GRANT ALL ON oauth_refresh_tokens TO service_role;

-- Function to clean up expired tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_oauth_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete expired pending requests
  DELETE FROM oauth_pending_requests WHERE expires_at < NOW();

  -- Delete expired authorization codes
  DELETE FROM oauth_codes WHERE expires_at < NOW();

  -- Delete expired access tokens
  DELETE FROM oauth_access_tokens WHERE expires_at < NOW();

  -- Delete expired refresh tokens
  DELETE FROM oauth_refresh_tokens WHERE expires_at < NOW();
END;
$$;

-- Optional: Create a cron job to run cleanup daily (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-oauth-tokens', '0 3 * * *', 'SELECT cleanup_expired_oauth_tokens()');
