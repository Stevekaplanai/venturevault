import type { VercelRequest, VercelResponse } from '@vercel/node'

interface GenerateIdeasRequest {
  skills: string[]
  interests: string[]
  targetCategories: string[]
  problemAreas?: string
  includeMarketContext?: boolean
}

interface GeneratedIdea {
  title: string
  description: string
  category: string
  problemSolved: string
  targetAudience: string
  monetizationModel: string[]
  techStack: string[]
  mvpFeatures: string[]
  marketScore: number
  competitionLevel: "Low" | "Medium" | "High"
  potentialRevenue: string
  timeToMVP: string
  whyNow: string
  tags: string[]
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' })
  }

  try {
    const { skills, interests, targetCategories, problemAreas, includeMarketContext } = req.body as GenerateIdeasRequest

    // Validate input
    if (!skills?.length && !interests?.length && !targetCategories?.length) {
      return res.status(400).json({ error: 'Please provide at least skills, interests, or target categories' })
    }

    // Fetch market context if requested
    let trendsContext = ''
    let newsContext = ''

    if (includeMarketContext) {
      try {
        // Fetch trends
        const trendsResponse = await fetch(`https://${req.headers.host}/api/trends`)
        if (trendsResponse.ok) {
          const trendsData = await trendsResponse.json()
          if (trendsData.trends?.length) {
            trendsContext = `Current trending topics: ${trendsData.trends.slice(0, 10).map((t: any) => t.term).join(', ')}`
          }
        }
      } catch (e) {
        console.log('Could not fetch trends:', e)
      }

      try {
        // Fetch news
        const newsResponse = await fetch(`https://${req.headers.host}/api/rss`)
        if (newsResponse.ok) {
          const newsData = await newsResponse.json()
          if (newsData.items?.length) {
            newsContext = `Recent tech news headlines: ${newsData.items.slice(0, 8).map((n: any) => n.title).join('; ')}`
          }
        }
      } catch (e) {
        console.log('Could not fetch news:', e)
      }
    }

    const prompt = `You are an expert startup idea generator. Generate 5 unique, innovative startup ideas based on the following inputs.

USER PROFILE:
- Skills: ${skills?.length ? skills.join(', ') : 'Not specified'}
- Interests: ${interests?.length ? interests.join(', ') : 'Not specified'}
- Target Categories: ${targetCategories?.length ? targetCategories.join(', ') : 'Any'}
${problemAreas ? `- Problem areas to solve: ${problemAreas}` : ''}

${trendsContext ? `MARKET CONTEXT:\n${trendsContext}\n` : ''}
${newsContext ? `${newsContext}\n` : ''}

REQUIREMENTS:
1. Generate 5 DIVERSE startup ideas (not similar to each other)
2. Each idea should be actionable and realistic for a small team
3. Consider the user's skills when suggesting tech stacks
4. Align with their interests and target categories
5. Include a compelling "whyNow" explanation referencing current market conditions
6. Be specific about monetization and target audience

OUTPUT FORMAT:
Return ONLY a valid JSON array with exactly 5 objects. No markdown, no explanations, just the JSON array.

Each object must have these exact fields:
{
  "title": "string - catchy, memorable name",
  "description": "string - 2-3 sentence elevator pitch",
  "category": "string - one of: SaaS, AI/ML, E-commerce, FinTech, HealthTech, EdTech, MarketPlace",
  "problemSolved": "string - the specific pain point this addresses",
  "targetAudience": "string - who will use this",
  "monetizationModel": ["array of 2-3 revenue streams"],
  "techStack": ["array of 4-6 technologies matching user skills"],
  "mvpFeatures": ["array of 4-5 core MVP features"],
  "marketScore": number 60-95 (opportunity score),
  "competitionLevel": "Low" or "Medium" or "High",
  "potentialRevenue": "string like $10M+, $50M+, $100M+",
  "timeToMVP": "string like 2-3 months, 3-4 months",
  "whyNow": "string - why this idea is timely RIGHT NOW",
  "tags": ["array of 4-5 relevant tags"]
}

Generate ideas now:`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 64,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', errorText)
      return res.status(500).json({ error: 'Failed to generate ideas', details: errorText })
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      return res.status(500).json({ error: 'No response from AI' })
    }

    // Parse the JSON response
    let ideas: GeneratedIdea[]
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedText = generatedText.trim()
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7)
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3)
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3)
      }
      cleanedText = cleanedText.trim()

      ideas = JSON.parse(cleanedText)

      // Validate structure
      if (!Array.isArray(ideas) || ideas.length === 0) {
        throw new Error('Invalid response structure')
      }

      // Ensure all required fields exist
      ideas = ideas.map(idea => ({
        title: idea.title || 'Untitled Idea',
        description: idea.description || '',
        category: idea.category || 'SaaS',
        problemSolved: idea.problemSolved || '',
        targetAudience: idea.targetAudience || '',
        monetizationModel: Array.isArray(idea.monetizationModel) ? idea.monetizationModel : [],
        techStack: Array.isArray(idea.techStack) ? idea.techStack : [],
        mvpFeatures: Array.isArray(idea.mvpFeatures) ? idea.mvpFeatures : [],
        marketScore: typeof idea.marketScore === 'number' ? idea.marketScore : 75,
        competitionLevel: ['Low', 'Medium', 'High'].includes(idea.competitionLevel) ? idea.competitionLevel : 'Medium',
        potentialRevenue: idea.potentialRevenue || '$10M+',
        timeToMVP: idea.timeToMVP || '3-4 months',
        whyNow: idea.whyNow || '',
        tags: Array.isArray(idea.tags) ? idea.tags : []
      }))

    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw text:', generatedText)
      return res.status(500).json({ error: 'Failed to parse AI response', raw: generatedText })
    }

    return res.status(200).json({
      success: true,
      ideas,
      marketContext: {
        trends: trendsContext ? trendsContext.replace('Current trending topics: ', '').split(', ') : [],
        recentNews: newsContext ? newsContext.replace('Recent tech news headlines: ', '').split('; ').slice(0, 5) : []
      },
      model: 'gemini-2.0-flash-exp',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Generate ideas error:', error)
    return res.status(500).json({
      error: 'Failed to generate ideas',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
