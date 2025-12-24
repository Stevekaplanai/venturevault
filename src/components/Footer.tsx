import { Link } from "react-router-dom"
import { Vault, Twitter, Github, Linkedin, Mail, Sparkles } from "lucide-react"
import { NewsletterSignup } from "./NewsletterSignup"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* Newsletter Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 py-12 md:py-16">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px)] bg-[length:24px_24px]" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-1.5 text-sm text-white mb-4">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Join 1,000+ Founders</span>
              <Mail className="h-4 w-4" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Get a Startup Idea Every Morning
            </h3>
            <p className="text-purple-100 mb-6 text-sm md:text-base">
              Curated ideas with market analysis, customer personas, and 90-day playbooks.
            </p>
            <NewsletterSignup variant="inline" source="footer" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 transition-transform duration-300 group-hover:scale-110">
                <Vault className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">VentureVault</span>
                <span className="text-[10px] text-muted-foreground -mt-1">Free Forever</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Your vault of validated startup ideas. Discover, analyze, and launch
              your next venture with AI-powered insights.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/venturevault"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 transition-all duration-300 hover:scale-110"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/venturevault"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
                aria-label="View our GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/company/venturevault"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-110"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links - Explore */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/browse" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Browse Ideas</span>
                </Link>
              </li>
              <li>
                <Link to="/ai-research" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">AI Research</span>
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Trending Ideas</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Blog</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Links - Resources */}
          <div className="hidden md:block">
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/blog/mvp-in-30-days" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">30-Day MVP Guide</span>
                </Link>
              </li>
              <li>
                <Link to="/blog/how-to-validate-startup-idea" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Idea Validation</span>
                </Link>
              </li>
              <li>
                <Link to="/blog/saas-pricing-strategies" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">SaaS Pricing Guide</span>
                </Link>
              </li>
              <li>
                <Link to="/blog/finding-first-10-customers" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">First 10 Customers</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Links - Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">About</span>
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Roadmap</span>
                </Link>
              </li>
              <li>
                <Link to="/idea-generator" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Idea Generator</span>
                </Link>
              </li>
              <li>
                <a href="mailto:hello@venturevault.space" className="text-muted-foreground hover:text-purple-600 transition-colors duration-300 flex items-center gap-1 group">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Contact Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VentureVault.space</p>
          <p className="flex items-center gap-2">
            <span>Free Forever</span>
            <span className="text-purple-500">•</span>
            <span>Built with love</span>
            <span className="animate-pulse">💜</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
