"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { JobList, JobSearch } from "@/components/jobs";
import { LoadingPage, Alert } from "@/components/ui";
import {
  getApprovedJobs,
  getApplicationsByApplicant,
  getSavedJobs,
  saveJob,
  unsaveJob,
} from "@/lib/appwrite/api";
import { useAuth } from "@/lib/hooks";
import type { Job, JobFilters } from "@/lib/types";

export function JobsContent() {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const approvedJobs = await getApprovedJobs();
        setJobs(approvedJobs);

        // Fetch user's applications and saved jobs if they're an applicant
        if (isAuthenticated && user?.role === "applicant") {
          const [applications, savedJobs] = await Promise.all([
            getApplicationsByApplicant(user.$id),
            getSavedJobs(user.$id),
          ]);
          setAppliedJobIds(applications.map((app) => app.jobId));
          setSavedJobIds(savedJobs.map((saved) => saved.jobId));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [isAuthenticated, user]);

  const handleToggleSave = useCallback(
    async (jobId: string) => {
      if (!user || user.role !== "applicant") return;

      const isSaved = savedJobIds.includes(jobId);
      try {
        if (isSaved) {
          await unsaveJob(user.$id, jobId);
          setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
        } else {
          await saveJob(user.$id, jobId);
          setSavedJobIds((prev) => [...prev, jobId]);
        }
      } catch (err) {
        console.error("Failed to toggle save:", err);
      }
    },
    [user, savedJobIds]
  );

  // Get unique locations and companies for filters
  const { locations, companies } = useMemo(() => {
    const locationSet = new Set<string>();
    const companySet = new Set<string>();
    jobs.forEach((job) => {
      locationSet.add(job.location);
      companySet.add(job.company);
    });
    return {
      locations: Array.from(locationSet).sort(),
      companies: Array.from(companySet).sort(),
    };
  }, [jobs]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (job) =>
          job.role.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
      );
    }

    // Location filter
    if (filters.location) {
      result = result.filter((job) => job.location === filters.location);
    }

    // Company filter
    if (filters.company) {
      result = result.filter((job) => job.company === filters.company);
    }

    // Sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        switch (filters.sortBy) {
          case "newest":
            return (
              new Date(b.$createdAt).getTime() -
              new Date(a.$createdAt).getTime()
            );
          case "oldest":
            return (
              new Date(a.$createdAt).getTime() -
              new Date(b.$createdAt).getTime()
            );
          case "company":
            return a.company.localeCompare(b.company);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [jobs, filters]);

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
    <div className="space-y-6">
      <JobSearch
        filters={filters}
        onFiltersChange={setFilters}
        locations={locations}
        companies={companies}
        totalJobs={jobs.length}
        filteredCount={filteredJobs.length}
      />
      <JobList
        jobs={filteredJobs}
        emptyTitle="No jobs found"
        emptyDescription={
          filters.search || filters.location || filters.company
            ? "Try adjusting your search or filters to find more jobs."
            : "There are no approved jobs at the moment. Check back later for new opportunities."
        }
        appliedJobIds={appliedJobIds}
        savedJobIds={savedJobIds}
        onToggleSave={user?.role === "applicant" ? handleToggleSave : undefined}
      />
    </div>
  );
}
