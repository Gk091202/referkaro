"use client";

import { useEffect, useState } from "react";
import { JobList } from "@/components/jobs";
import { LoadingPage, Alert } from "@/components/ui";
import { getApprovedJobs } from "@/lib/appwrite/api";
import type { Job } from "@/lib/types";

export function JobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const approvedJobs = await getApprovedJobs();
        setJobs(approvedJobs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (isLoading) {
    return <LoadingPage message="Loading jobs..." />;
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading jobs">
        {error}
      </Alert>
    );
  }

  return (
    <JobList
      jobs={jobs}
      emptyTitle="No jobs available"
      emptyDescription="There are no approved jobs at the moment. Check back later for new opportunities."
    />
  );
}
