"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks";
import { ApplicationList } from "@/components/applications";
import { LoadingPage, Alert, Select } from "@/components/ui";
import {
  getJobsByReferrer,
  getApplicationsByJob,
  updateApplicationStatus,
} from "@/lib/appwrite/api";
import type { Application, Job, ApplicationStatus } from "@/lib/types";

export default function ReferrerApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const userJobs = await getJobsByReferrer(user.$id);
      setJobs(userJobs);

      // Fetch applications for all jobs
      const allApps: Application[] = [];
      await Promise.all(
        userJobs.map(async (job) => {
          const jobApps = await getApplicationsByJob(job.$id);
          allApps.push(...jobApps);
        })
      );
      setApplications(allApps);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (
    applicationId: string,
    status: ApplicationStatus
  ) => {
    setIsUpdating(true);
    try {
      await updateApplicationStatus(applicationId, status);
      // Refresh data
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredApplications =
    selectedJobId === "all"
      ? applications
      : applications.filter((a) => a.jobId === selectedJobId);

  const jobsMap = new Map(jobs.map((j) => [j.$id, j]));

  if (isLoading) {
    return <LoadingPage message="Loading applications..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Applications</h1>
          <p className="mt-1 text-muted-foreground">
            Review applications for your referral jobs
          </p>
        </div>

        {/* Filter */}
        {jobs.length > 0 && (
          <div className="w-full sm:w-64">
            <Select
              label="Filter by Job"
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              options={[
                { value: "all", label: "All Jobs" },
                ...jobs.map((j) => ({
                  value: j.$id,
                  label: `${j.role} at ${j.company}`,
                })),
              ]}
            />
          </div>
        )}
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Applications List */}
      <ApplicationList
        applications={filteredApplications}
        jobs={jobsMap}
        showApplicantInfo={true}
        emptyTitle="No applications"
        emptyDescription="You haven't received any applications yet. Make sure your jobs are approved and visible to applicants."
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
      />
    </div>
  );
}
