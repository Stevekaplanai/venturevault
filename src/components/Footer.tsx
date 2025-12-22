import { Link } from "react-router-dom"
import { Vault, Twitter, Github, Linkedin } from "lucide-react"
import { NewsletterSignup } from "./NewsletterSignup"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Get a Startup Idea Every Morning</h3>
            <p className="text-purple-100 mb-6">
              Join founders receiving curated ideas with market analysis, directly in your inbox.
            </p>
            <NewsletterSignup variant="inline" source="footer" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
                <Vault className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">VentureVault</span>
                <span className="text-[10px] text-muted-foreground -mt-1">Free Forever</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your vault of validated startup ideas. Discover, analyze, and launch
              your next venture with AI-powered insights. 100% free, forever.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/venturevault"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/venturevault"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="View our GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/venturevault"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/browse" className="hover:text-foreground transition-colors">Browse Ideas</Link></li>
              <li><Link to="/ai-research" className="hover:text-foreground transition-colors">AI Research</Link></li>
              <li><Link to="/trending" className="hover:text-foreground transition-colors">Trending Ideas</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/browse?category=AI/ML" className="hover:text-foreground transition-colors">AI & Machine Learning</Link></li>
              <li><Link to="/browse?category=FinTech" className="hover:text-foreground transition-colors">FinTech</Link></li>
              <li><Link to="/browse?category=HealthTech" className="hover:text-foreground transition-colors">HealthTech</Link></li>
              <li><Link to="/browse?category=EdTech" className="hover:text-foreground transition-colors">EdTech</Link></li>
              <li><Link to="/browse?category=SaaS" className="hover:text-foreground transition-colors">SaaS</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/roadmap" className="hover:text-foreground transition-colors">Roadmap</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VentureVault.space • Free Forever • Built with shadcn/ui</p>
        </div>
      </div>
    </footer>
  )
}
