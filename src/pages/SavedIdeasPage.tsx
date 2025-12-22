import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Bookmark, Loader2, LogIn } from "lucide-react"
import { Button } from "../components/ui/button"
import { IdeaCard } from "../components/IdeaCard"
import { getSavedIdeas, getCurrentUser } from "../lib/supabase"
import { ideas } from "../data/ideas"

export function SavedIdeasPage() {
  const [savedIdeaIds, setSavedIdeaIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function loadSavedIdeas() {
      const { user } = await getCurrentUser()
      setIsLoggedIn(!!user)

      if (user) {
        const { data } = await getSavedIdeas()
        setSavedIdeaIds(data)
      }
      setIsLoading(false)
    }
    loadSavedIdeas()
  }, [])

  const savedIdeas = ideas.filter(idea => savedIdeaIds.includes(idea.id))

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Sign in to view saved ideas</h1>
            <p className="text-muted-foreground mb-8">
              Create a free account to save your favorite startup ideas and access them anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signin">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Bookmark className="h-5 w-5 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold">Saved Ideas</h1>
          </div>
          <p className="text-muted-foreground">
            Your collection of bookmarked startup ideas
          </p>
        </div>

        {savedIdeas.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {savedIdeas.length} saved idea{savedIdeas.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedIdeas.map((idea) => (
                <IdeaCard key={idea.id} {...idea} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No saved ideas yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Browse our collection of startup ideas and click the bookmark icon to save your favorites.
            </p>
            <Link to="/browse">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                Browse Ideas
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
