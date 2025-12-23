// 60-Day Email Campaign Calendar for VentureVault
// Auto-rotates through top ideas by market score
// Special themed weeks add variety to the daily emails

export interface WeeklyTheme {
  week: number
  theme: string
  description: string
  categories: string[]
  specialContent?: string
}

// 60 days = ~9 weeks of themed content
export const weeklyThemes: WeeklyTheme[] = [
  {
    week: 1,
    theme: "AI & Automation Week",
    description: "Discover how AI is transforming every industry",
    categories: ["AI/ML", "SaaS", "DevTools"],
    specialContent: "Bonus: Free AI prompt templates for startup validation"
  },
  {
    week: 2,
    theme: "SaaS Builder Week",
    description: "Software ideas that scale to millions in ARR",
    categories: ["SaaS", "B2B", "Productivity"],
    specialContent: "Bonus: SaaS metrics calculator included"
  },
  {
    week: 3,
    theme: "Healthcare & Wellness Week",
    description: "High-impact ideas in the $4T healthcare market",
    categories: ["HealthTech", "FoodTech", "Sustainability"],
    specialContent: "Guide: Navigating healthcare regulations"
  },
  {
    week: 4,
    theme: "Marketplace Madness Week",
    description: "Two-sided marketplace opportunities",
    categories: ["MarketPlace", "E-commerce", "Creator Economy"],
    specialContent: "Framework: Solving the chicken-and-egg problem"
  },
  {
    week: 5,
    theme: "FinTech & Money Week",
    description: "Financial services disruption opportunities",
    categories: ["FinTech", "B2B", "SaaS"],
    specialContent: "Checklist: FinTech compliance essentials"
  },
  {
    week: 6,
    theme: "Education & Learning Week",
    description: "EdTech ideas reshaping how we learn",
    categories: ["EdTech", "Productivity", "Creator Economy"],
    specialContent: "Template: Course validation framework"
  },
  {
    week: 7,
    theme: "Future of Work Week",
    description: "Remote work, HR tech, and productivity tools",
    categories: ["HRTech", "Productivity", "SaaS"],
    specialContent: "Report: Remote work trends 2024"
  },
  {
    week: 8,
    theme: "Marketing & Growth Week",
    description: "Tools and platforms for modern marketers",
    categories: ["MarTech", "SaaS", "Creator Economy"],
    specialContent: "Playbook: Growth hacking strategies"
  },
  {
    week: 9,
    theme: "Holiday Season Prep Week",
    description: "E-commerce and seasonal business opportunities",
    categories: ["E-commerce", "MarketPlace", "FoodTech"],
    specialContent: "Guide: Launching before the holiday rush"
  }
]

// Special promotional emails (sprinkled throughout the 60 days)
export const promotionalEmails = {
  day7: {
    type: "week-recap",
    subject: "🎯 Your Week 1 Recap: Top 7 Startup Ideas",
    content: "Missed a day? Here are the best ideas from this week."
  },
  day14: {
    type: "case-study",
    subject: "📈 Case Study: From Idea to $1M ARR",
    content: "Real story of a VentureVault reader who launched."
  },
  day21: {
    type: "tool-highlight",
    subject: "🔬 New: AI Research Deep Dives",
    content: "Use our AI tool for instant market research."
  },
  day30: {
    type: "milestone",
    subject: "🎉 30 Days of Startup Inspiration!",
    content: "Month milestone - celebrate with exclusive content."
  },
  day45: {
    type: "community",
    subject: "👥 Join the VentureVault Community",
    content: "Connect with other founders building their ideas."
  },
  day60: {
    type: "renewal",
    subject: "🚀 60 Days Complete - What's Next?",
    content: "Reflect on your journey and plan your next steps."
  }
}

// Email subject line variations to increase open rates
export const subjectLineVariations = [
  "🚀 Today's Startup Idea: {title}",
  "💡 New Idea Alert: {title}",
  "🎯 {category} Opportunity: {title}",
  "📊 Market Score {score}/100: {title}",
  "🔥 Trending: {title}",
  "💰 {revenue} Potential: {title}",
  "⚡ Quick MVP Idea: {title}",
  "🌟 Featured: {title}"
]

// Pre-header text variations
export const preheaderVariations = [
  "Market size: {marketSize} | Competition: {competition}",
  "{category} startup idea with {revenue} potential",
  "Build in {timeToMvp} | Score: {score}/100",
  "Today's top-rated startup opportunity inside",
  "A {competition} competition market worth {marketSize}"
]

// Best send times based on research (EST timezone)
export const optimalSendTimes = {
  weekday: "7:00 AM",
  weekend: "9:00 AM",
  timezone: "America/New_York"
}

// A/B testing configurations
export const abTestConfigs = {
  subjectLines: {
    enabled: true,
    splitPercentage: 20, // 20% of audience gets variant B
    testDuration: 2 // hours before sending winner to rest
  },
  sendTimes: {
    enabled: false,
    variants: ["7:00 AM", "8:00 AM", "12:00 PM"]
  }
}
