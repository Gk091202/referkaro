import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: January 2, 2026</p>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="py-8 prose prose-invert max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or using referkaro, you agree to be bound by
                  these Terms of Service. If you do not agree to these terms,
                  please do not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  2. Description of Service
                </h2>
                <p>
                  referkaro is a platform that connects job seekers with
                  employees at companies who are willing to provide referrals.
                  We facilitate connections but do not guarantee employment
                  outcomes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  3. User Accounts
                </h2>
                <p>
                  To use certain features, you must create an account. You agree
                  to:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  4. User Conduct
                </h2>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Submit false or misleading information</li>
                  <li>Impersonate any person or entity</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Use the service for any illegal purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  5. Referrer Responsibilities
                </h2>
                <p>If you are a referrer, you agree to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Only post legitimate job opportunities</li>
                  <li>Accurately represent your employment status</li>
                  <li>Respond to applications in a timely manner</li>
                  <li>Not discriminate against applicants</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  6. Applicant Responsibilities
                </h2>
                <p>If you are an applicant, you agree to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Provide accurate information in your applications</li>
                  <li>Respect referrers&apos; time and effort</li>
                  <li>Not spam or send excessive applications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  7. Limitation of Liability
                </h2>
                <p>
                  referkaro is provided &quot;as is&quot; without warranties of
                  any kind. We are not liable for any damages arising from your
                  use of the service, including but not limited to employment
                  decisions made by third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  8. Termination
                </h2>
                <p>
                  We reserve the right to suspend or terminate your account at
                  any time for violations of these terms or for any other reason
                  at our discretion.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  9. Changes to Terms
                </h2>
                <p>
                  We may update these terms from time to time. Continued use of
                  the service after changes constitutes acceptance of the new
                  terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  10. Contact
                </h2>
                <p>
                  For questions about these Terms of Service, contact us at{" "}
                  <a
                    href="mailto:legal@referkaro.com"
                    className="text-primary hover:underline"
                  >
                    legal@referkaro.com
                  </a>
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
