"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks";
import { ApplicationList } from "@/components/applications";
import { LoadingPage, Alert } from "@/components/ui";
import { getApplicationsByApplicant, getJobById } from "@/lib/appwrite/api";
import type { Application, Job } from "@/lib/types";

export default function ApplicantApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Map<string, Job>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const apps = await getApplicationsByApplicant(user.$id);
        setApplications(apps);

        // Fetch job details for each application
        const jobsMap = new Map<string, Job>();
        await Promise.all(
          apps.map(async (app) => {
            if (!jobsMap.has(app.jobId)) {
              const job = await getJobById(app.jobId);
              if (job) {
                jobsMap.set(app.jobId, job);
              }
            }
          })
        );
        setJobs(jobsMap);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load applications"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return <LoadingPage message="Loading applications..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
        <p className="mt-1 text-muted-foreground">
          Track the status of all your job applications
        </p>
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Applications List */}
      <ApplicationList
        applications={applications}
        jobs={jobs}
        showApplicantInfo={false}
        emptyTitle="No applications yet"
        emptyDescription="You haven't applied to any jobs yet. Browse available positions to get started."
      />
    </div>
  );
}
