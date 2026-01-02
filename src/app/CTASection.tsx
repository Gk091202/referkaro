"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/hooks";

export function CTASection() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <section className="border-t border-border bg-card/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="h-8 w-48 mx-auto bg-secondary animate-pulse rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (isAuthenticated && user) {
    return (
      <section className="border-t border-border bg-card/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome back, {user.name.split(" ")[0]}!
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {user.role === "applicant" && "Browse available jobs and find your next opportunity."}
              {user.role === "referrer" && "Manage your job postings and review applications."}
              {user.role === "admin" && "Manage the platform, moderate jobs and users."}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Jobs
                </Button>
              </Link>
              <Link href={`/dashboard/${user.role}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
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
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
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
  );
}
