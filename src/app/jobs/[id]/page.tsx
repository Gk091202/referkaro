import { Suspense } from "react";
import { Navbar, Footer } from "@/components/layout";
import { LoadingPage } from "@/components/ui";
import { JobDetailContent } from "./JobDetailContent";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Job Details - referkaro",
  description: "View job details and apply for a referral.",
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Suspense fallback={<LoadingPage message="Loading job details..." />}>
            <JobDetailContent jobId={id} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
