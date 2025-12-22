import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Vault, Sparkles, Menu, User, LogOut, X } from "lucide-react"
import { Button } from "./ui/button"
import { useAuth } from "../contexts/AuthContext"

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
    navigate("/")
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const navLinks = [
    { path: "/browse", label: "Browse Ideas" },
    { path: "/ai-research", label: "AI Research" },
    { path: "/trending", label: "Trending" },
    { path: "/discover", label: "Discover" },
    { path: "/pricing", label: "Pricing" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
            <Vault className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold">VentureVault</span>
            <span className="text-[10px] text-muted-foreground -mt-1">Free Forever</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${isActive(link.path) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {user.email?.split('@')[0]}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Sparkles className="h-4 w-4" />
                  Get Started Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t space-y-2">
              {loading ? (
                <div className="h-10 animate-pulse rounded-lg bg-muted" />
              ) : user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium truncate">
                      {user.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                      <Sparkles className="h-4 w-4" />
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
