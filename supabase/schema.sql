-- VentureVault Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved ideas (bookmarks)
CREATE TABLE IF NOT EXISTS saved_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  idea_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, idea_id)
);

-- AI Research history
CREATE TABLE IF NOT EXISTS research_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies

-- Profiles: Users can only read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Saved Ideas: Users can only access their own bookmarks
ALTER TABLE saved_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved ideas" ON saved_ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save ideas" ON saved_ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved ideas" ON saved_ideas
  FOR DELETE USING (auth.uid() = user_id);

-- Research History: Users can only access their own history
ALTER TABLE research_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own research history" ON research_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to research history" ON research_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own research history" ON research_history
  FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_saved_ideas_user_id ON saved_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_ideas_idea_id ON saved_ideas(idea_id);
CREATE INDEX IF NOT EXISTS idx_research_history_user_id ON research_history(user_id);
CREATE INDEX IF NOT EXISTS idx_research_history_created_at ON research_history(created_at DESC);
