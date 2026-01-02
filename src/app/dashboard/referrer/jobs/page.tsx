"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/lib/hooks";
import { JobList } from "@/components/jobs";
import { Button, LoadingPage, Alert } from "@/components/ui";
import { getJobsByReferrer } from "@/lib/appwrite/api";
import type { Job } from "@/lib/types";

export default function ReferrerJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;

      try {
        const userJobs = await getJobsByReferrer(user.$id);
        setJobs(userJobs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  if (isLoading) {
    return <LoadingPage message="Loading your jobs..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Jobs</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your referral job postings
          </p>
        </div>
        <Link href="/dashboard/referrer/jobs/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Jobs List */}
      <JobList
        jobs={jobs}
        showStatus={true}
        emptyTitle="No jobs posted"
        emptyDescription="You haven't posted any referral jobs yet. Create your first job posting to start helping others get referred."
        showCreateButton={true}
      />
    </div>
  );
}
