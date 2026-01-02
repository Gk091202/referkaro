import { Suspense } from "react";
import { Navbar, Footer } from "@/components/layout";
import { LoadingPage } from "@/components/ui";
import { ApplyContent } from "./ApplyContent";

interface ApplyPageProps {
  params: Promise<{ jobId: string }>;
}

export const metadata = {
  title: "Apply for Job - referkaro",
  description: "Submit your application for a referral opportunity.",
};

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { jobId } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <Suspense fallback={<LoadingPage message="Loading..." />}>
            <ApplyContent jobId={jobId} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
