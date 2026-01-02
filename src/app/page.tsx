import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Users,
  Briefcase,
  CheckCircle,
  Zap,
  Lock,
} from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { Button } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
            <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  The trusted referral job board
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Get referred.
                <br />
                <span className="text-gradient">Get hired.</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
                Connect with employees who can refer you directly. Skip the
                queue, land interviews faster, and get your dream job through
                trusted referrals.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/signup?role=applicant">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Find Jobs
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/signup?role=referrer">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Become a Referrer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border bg-card/50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A simple, transparent process for both referrers and job
                seekers.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Browse Referrals
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Explore verified job referrals from real employees at top
                  companies. Every listing is from someone who can actually
                  refer you.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Apply Directly
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send your application directly to the referrer. Share your
                  story, resume, and let them know why you&apos;re a great fit.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Get Referred
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  If the referrer approves, they&apos;ll submit your application
                  internally. Your resume goes straight to the hiring team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Why referrals matter
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Referrals aren&apos;t just about getting your foot in the door
                  — they&apos;re about building trust and making connections
                  that matter.
                </p>

                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        Higher interview rates
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Referred candidates are 4x more likely to get interviews
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        Faster hiring process
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Skip the resume black hole and get noticed immediately
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        Better job fit
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Referrers only refer candidates they believe will
                        succeed
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="flex items-center">
                <div className="rounded-xl border border-border bg-card p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
                      <Shield className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Built on trust
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Moderated platform
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Every job posting is reviewed by our team. Referrers are
                    verified employees. No spam, no fake listings, just real
                    opportunities.
                  </p>
                  <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Lock className="h-4 w-4" />
                      <span>Admin moderated</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4" />
                      <span>Role-based access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-card/50 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of professionals already using referkaro to find
                their next opportunity.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/jobs">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Browse Jobs
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
