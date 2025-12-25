-- Newsletter Subscribers Table
-- Run this in your Supabase SQL Editor

-- Create the newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'website'
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(is_active) WHERE is_active = true;

-- Create the newsletter_logs table for tracking sends
CREATE TABLE IF NOT EXISTS newsletter_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id TEXT NOT NULL,
  subscribers_count INTEGER NOT NULL,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for logs
CREATE INDEX IF NOT EXISTS idx_newsletter_logs_sent_at ON newsletter_logs(sent_at DESC);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (for API endpoints)
CREATE POLICY "Service role has full access to subscribers" ON newsletter_subscribers
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to logs" ON newsletter_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON newsletter_subscribers TO service_role;
GRANT ALL ON newsletter_logs TO service_role;
