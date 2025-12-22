import { Link } from "react-router-dom"
import { FileText, ArrowLeft } from "lucide-react"

export function TermsPage() {
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
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using VentureVault.space ("the Service"), you accept and agree to
              be bound by these Terms of Service. If you do not agree to these terms, please do
              not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              VentureVault provides a platform for discovering and researching startup ideas,
              including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>A database of validated startup ideas</li>
              <li>AI-powered market research tools</li>
              <li>Trending topics and RSS feed aggregation</li>
              <li>User accounts for saving and organizing ideas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Free Service</h2>
            <p className="text-muted-foreground mb-4">
              VentureVault is provided free of charge. We reserve the right to introduce paid
              features in the future, but core functionality will remain free. We make no
              guarantees about the continued availability of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              To access certain features, you may need to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Acceptable Use</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Scrape or collect data without permission</li>
              <li>Upload malicious code or content</li>
              <li>Impersonate others or misrepresent your affiliation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              The startup ideas presented on VentureVault are for informational purposes only.
              We do not claim ownership over these ideas, and you are free to pursue any idea
              you find on our platform. The VentureVault name, logo, and website design are
              our intellectual property.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. AI-Generated Content</h2>
            <p className="text-muted-foreground mb-4">
              Our AI research features use third-party AI services. The information provided
              is for general guidance only and should not be considered professional business,
              legal, or financial advice. AI-generated content may contain errors or inaccuracies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground mb-4">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL
              WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR
              USEFULNESS OF ANY INFORMATION ON THE SERVICE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS,
              DATA, OR BUSINESS OPPORTUNITIES, ARISING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to terminate or suspend your account at any time, for any
              reason, without notice. You may also delete your account at any time through your
              account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We may modify these Terms at any time. We will notify users of material changes
              by posting a notice on the Service. Continued use of the Service after changes
              constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms shall be governed by and construed in accordance with the laws of
              the jurisdiction in which VentureVault operates, without regard to conflict of
              law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">13. Contact</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms, please contact us at:
            </p>
            <p className="text-muted-foreground">
              <strong>Email:</strong> legal@venturevault.space
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
