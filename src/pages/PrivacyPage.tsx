import { Link } from "react-router-dom"
import { Shield, ArrowLeft } from "lucide-react"

export function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to VentureVault.space ("we," "our," or "us"). We are committed to protecting
              your personal information and your right to privacy. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Account information (email address, password)</li>
              <li>Profile information (name, if provided)</li>
              <li>Usage data (ideas you browse, searches you make)</li>
              <li>AI research queries and results</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your account registration</li>
              <li>Send you updates and marketing communications (with your consent)</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Protect against fraud and unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Data Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Service providers who assist in operating our platform (Supabase for authentication, Vercel for hosting)</li>
              <li>AI providers for research functionality (Google Gemini)</li>
              <li>Analytics services to understand usage patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational security measures to protect
              your personal information. However, no method of transmission over the Internet
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We use essential cookies to maintain your session and preferences. We do not use
              tracking cookies for advertising purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground mb-4">
              Our service is not directed to individuals under 13. We do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-muted-foreground">
              <strong>Email:</strong> privacy@venturevault.space
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
