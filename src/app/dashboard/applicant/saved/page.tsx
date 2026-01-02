"use client";

import { useEffect, useState, useCallback } from "react";
import { Bookmark } from "lucide-react";
import { getSavedJobs, unsaveJob, getJobById } from "@/lib/appwrite/api";
import { useAuth, useProtectedRoute } from "@/lib/hooks";
import { LoadingPage, Alert, EmptyState } from "@/components/ui";
import { JobCard } from "@/components/jobs";
import type { Job } from "@/lib/types";

export default function SavedJobsPage() {
  useProtectedRoute({ allowedRoles: ["applicant"] });
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) return;

      try {
        const saved = await getSavedJobs(user.$id);
        setSavedJobIds(saved.map((s) => s.jobId));

        // Fetch full job details for each saved job
        const jobPromises = saved.map((s) =>
          getJobById(s.jobId).catch(() => null)
        );
        const jobs = await Promise.all(jobPromises);
        setSavedJobs(jobs.filter((job): job is Job => job !== null));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load saved jobs"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user]);

  const handleToggleSave = useCallback(
    async (jobId: string) => {
      if (!user) return;

      try {
        await unsaveJob(user.$id, jobId);
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
        setSavedJobs((prev) => prev.filter((job) => job.$id !== jobId));
      } catch (err) {
        console.error("Failed to unsave job:", err);
      }
    },
    [user]
  );

  if (isLoading) {
    return <LoadingPage message="Loading saved jobs..." />;
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading saved jobs">
        {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saved Jobs</h1>
        <p className="text-muted-foreground mt-1">
          Jobs you&apos;ve bookmarked for later
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          title="No saved jobs"
          description="Browse jobs and click the bookmark icon to save them for later."
          icon={<Bookmark className="h-8 w-8 text-muted-foreground" />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((job) => (
            <JobCard
              key={job.$id}
              job={job}
              href={`/jobs/${job.$id}`}
              isSaved={savedJobIds.includes(job.$id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
