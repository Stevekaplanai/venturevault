# VentureVault Architecture - Free Forever Plan

## Current Status

| Feature | Status | What's Working | What's Needed |
|---------|--------|----------------|---------------|
| Homepage | ✅ Working | Static content + generated images | - |
| Browse Ideas | ✅ Working | 50 static ideas in JSON | Database for user submissions |
| Idea Details | ✅ Working | Full idea analysis | - |
| Trending | ✅ Working | Static trending list | Real-time data source |
| Discover (RSS) | ✅ Working | Live RSS feeds via CORS proxy | More reliable proxy |
| Discover (Trends) | ⚠️ Mock Data | Simulated trending topics | Real Google Trends API |
| AI Research | ⚠️ Mock Data | Demo analysis output | Real AI API integration |
| Auth (Sign In/Up) | ⚠️ UI Only | Forms render | Auth backend |
| Pricing | ✅ Working | All free tiers displayed | - |

---

## APIs Required for Full Functionality

### 1. RSS Feeds (Currently Working)
**Current**: Using `api.allorigins.win` as CORS proxy
**Status**: ✅ FREE & WORKING

```
No API key needed - just works
```

**Alternative free proxies if needed:**
- `https://corsproxy.io/?`
- `https://api.codetabs.com/v1/proxy?quest=`

---

### 2. Google Trends Data (Currently Mocked)
**Options:**

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **SerpAPI** | 100 searches/month | Best accuracy, needs API key |
| **Pytrends (via serverless)** | Unlimited | Unofficial, may break |
| **Trendy API** | 1000 req/month | Limited features |

**Recommended**: SerpAPI with 100 free searches/month
```
SERPAPI_KEY=your_key_here
```

**How to get**: https://serpapi.com (free account)

---

### 3. AI Research Analysis (Currently Mocked)
**Options for FREE AI:**

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Google Gemini** | 1500 req/day | Best free option |
| **Groq** | 14,400 req/day | Fastest inference |
| **Together AI** | $25 credit | Good models |
| **OpenRouter** | Some free models | Model variety |

**Recommended**: Google Gemini API (you already have this!)
```
GEMINI_API_KEY=AIzaSyD90sSLr7kjbaRF_ul-IhB7tJmnAzp8Amk
```

---

### 4. Authentication (Currently UI Only)
**Options:**

| Service | Free Tier | Features |
|---------|-----------|----------|
| **Supabase** | 50K MAU | Auth + Database + Edge Functions |
| **Firebase** | 50K MAU | Auth + Firestore + Functions |
| **Clerk** | 10K MAU | Auth only, great DX |

**Recommended**: Supabase (already in your MCP tools!)
- Free tier includes: Auth, Database, Edge Functions, Storage
- No credit card required

---

## Database Requirements

### Do We Need a Database?
**YES** - for these features:

| Feature | Why Database Needed |
|---------|---------------------|
| User accounts | Store user profiles |
| Saved ideas | Users bookmark favorites |
| User-submitted ideas | Community contributions |
| AI research history | Save past analyses |
| Voting/ratings | Community feedback on ideas |

### Recommended Schema (Supabase PostgreSQL)

```sql
-- Users (handled by Supabase Auth)

-- User profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ideas (extend current static data)
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  full_description TEXT,
  category TEXT,
  market_score INT,
  competition_level TEXT,
  tags TEXT[],
  user_id UUID REFERENCES auth.users,
  is_community BOOLEAN DEFAULT false,
  upvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved ideas (bookmarks)
CREATE TABLE saved_ideas (
  user_id UUID REFERENCES auth.users,
  idea_id UUID REFERENCES ideas,
  PRIMARY KEY (user_id, idea_id)
);

-- AI Research history
CREATE TABLE research_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  query TEXT,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Free Forever Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (Vercel - FREE)                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  React + Vite + TailwindCSS + shadcn/ui                 │    │
│  │  - Static idea browsing                                  │    │
│  │  - RSS feed display                                      │    │
│  │  - AI research interface                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES                            │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Supabase        │  │  Supabase Edge   │  │  External    │  │
│  │  (FREE)          │  │  Functions       │  │  APIs        │  │
│  │                  │  │  (FREE)          │  │  (FREE)      │  │
│  │  - Auth          │  │                  │  │              │  │
│  │  - PostgreSQL    │  │  - Google Trends │  │  - RSS Feeds │  │
│  │  - Storage       │  │  - AI Research   │  │  - CORS Proxy│  │
│  │  - Realtime      │  │  - API Proxying  │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Checklist

### Phase 1: Core Infrastructure (Week 1)
- [ ] Set up Supabase project
- [ ] Configure Supabase Auth (email + OAuth)
- [ ] Create database tables
- [ ] Migrate static ideas to database

### Phase 2: AI Integration (Week 2)
- [ ] Create Edge Function for Gemini API
- [ ] Implement real AI research analysis
- [ ] Add research history saving

### Phase 3: Google Trends (Week 2)
- [ ] Sign up for SerpAPI (free tier)
- [ ] Create Edge Function for trends
- [ ] Display real trending data

### Phase 4: User Features (Week 3)
- [ ] Implement sign in/sign up
- [ ] Add idea bookmarking
- [ ] Community idea submissions
- [ ] User profiles

---

## Environment Variables Needed

```env
# Supabase (FREE)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini AI (FREE - 1500 req/day)
GEMINI_API_KEY=AIzaSyD90sSLr7kjbaRF_ul-IhB7tJmnAzp8Amk

# SerpAPI for Google Trends (FREE - 100 searches/month)
SERPAPI_KEY=your-serpapi-key

# Optional: Analytics
VITE_POSTHOG_KEY=your-posthog-key
```

---

## Cost Breakdown: $0/month

| Service | Free Tier Limits | Our Usage |
|---------|------------------|-----------|
| **Vercel** | 100GB bandwidth | ~5GB |
| **Supabase** | 500MB DB, 50K MAU | Plenty |
| **Gemini API** | 1500 req/day | ~500/day |
| **SerpAPI** | 100 searches/month | ~100/month |
| **RSS Feeds** | Unlimited | N/A |

**Total Monthly Cost: $0**

---

## Next Steps

1. **Create Supabase project** at https://supabase.com
2. **Get SerpAPI key** at https://serpapi.com
3. **Create Edge Functions** for AI and Trends
4. **Deploy to Vercel** at https://vercel.com

Want me to implement any of these?
