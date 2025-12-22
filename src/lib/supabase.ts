import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Auth features will be limited.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Auth helper functions
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Database types
export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  created_at: string
}

export interface SavedIdea {
  user_id: string
  idea_id: string
  created_at: string
}

export interface ResearchHistory {
  id: string
  user_id: string
  query: string
  result: string
  created_at: string
}

// Bookmark functions
export async function saveIdea(ideaId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: new Error('Not authenticated') }

  const { data, error } = await supabase
    .from('saved_ideas')
    .insert({ user_id: user.id, idea_id: ideaId })
    .select()
    .single()

  return { data, error }
}

export async function unsaveIdea(ideaId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: new Error('Not authenticated') }

  const { error } = await supabase
    .from('saved_ideas')
    .delete()
    .eq('user_id', user.id)
    .eq('idea_id', ideaId)

  return { error }
}

export async function getSavedIdeas() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], error: null }

  const { data, error } = await supabase
    .from('saved_ideas')
    .select('idea_id')
    .eq('user_id', user.id)

  return { data: data?.map(d => d.idea_id) || [], error }
}

export async function isIdeaSaved(ideaId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('saved_ideas')
    .select('id')
    .eq('user_id', user.id)
    .eq('idea_id', ideaId)
    .single()

  return !!data
}

// Research history functions
export async function saveResearch(query: string, result: object) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: new Error('Not authenticated') }

  const { data, error } = await supabase
    .from('research_history')
    .insert({ user_id: user.id, query, result })
    .select()
    .single()

  return { data, error }
}

export async function getResearchHistory() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], error: null }

  const { data, error } = await supabase
    .from('research_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return { data: data || [], error }
}
