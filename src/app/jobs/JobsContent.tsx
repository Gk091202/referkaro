"use client";

import { useEffect, useState } from "react";
import { JobList } from "@/components/jobs";
import { LoadingPage, Alert } from "@/components/ui";
import { getApprovedJobs, getApplicationsByApplicant } from "@/lib/appwrite/api";
import { useAuth } from "@/lib/hooks";
import type { Job } from "@/lib/types";

export function JobsContent() {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const approvedJobs = await getApprovedJobs();
        setJobs(approvedJobs);

        // Fetch user's applications if they're an applicant
        if (isAuthenticated && user?.role === "applicant") {
          const applications = await getApplicationsByApplicant(user.$id);
          const appliedIds = applications.map((app) => app.jobId);
          setAppliedJobIds(appliedIds);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [isAuthenticated, user]);

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
      appliedJobIds={appliedJobIds}
    />
  );
}
