import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { BrowsePage } from './pages/BrowsePage'
import { IdeaDetailPage } from './pages/IdeaDetailPage'
import { TrendingPage } from './pages/TrendingPage'
import { AIResearchPage } from './pages/AIResearchPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { PricingPage } from './pages/PricingPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { AboutPage } from './pages/AboutPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { SavedIdeasPage } from './pages/SavedIdeasPage'
import { RoadmapPage } from './pages/RoadmapPage'
import { IdeaGeneratorPage } from './pages/IdeaGeneratorPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/idea/:id" element={<IdeaDetailPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/ai-research" element={<AIResearchPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/saved" element={<SavedIdeasPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route path="/idea-generator" element={<IdeaGeneratorPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
