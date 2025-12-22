import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // The Supabase client will automatically handle the OAuth callback
    // and update the auth state. We just need to redirect to home.
    const timer = setTimeout(() => {
      navigate('/')
    }, 1000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}
