import { Suspense } from "react";
import { Navbar, Footer } from "@/components/layout";
import { LoadingPage } from "@/components/ui";
import { JobsContent } from "./JobsContent";

export const metadata = {
  title: "Browse Jobs - referkaro",
  description:
    "Browse verified referral opportunities from real employees at top companies.",
};

export default function JobsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Browse Jobs</h1>
            <p className="mt-2 text-muted-foreground">
              Find your next opportunity through trusted referrals
            </p>
          </div>

          {/* Jobs List */}
          <Suspense fallback={<LoadingPage message="Loading jobs..." />}>
            <JobsContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
