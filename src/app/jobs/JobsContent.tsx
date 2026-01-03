"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Sparkles, Building2, MapPin, ChevronRight } from "lucide-react";
import { JobList, JobSearch } from "@/components/jobs";
import {
  LoadingPage,
  Alert,
  Card,
  CardContent,
  Badge,
  Button,
} from "@/components/ui";
import {
  getApprovedJobs,
  getApplicationsByApplicant,
  getSavedJobs,
  saveJob,
  unsaveJob,
  getSuggestedJobs,
  type SuggestedJob,
} from "@/lib/appwrite/api";
import { useAuth } from "@/lib/hooks";
import { getLocationLabel } from "@/lib/utils";
import type { Job, JobFilters } from "@/lib/types";

export function JobsContent() {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJob[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

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

          // Get suggested jobs if user has skills
          if (user.skills && user.skills.length > 0) {
            const suggestions = await getSuggestedJobs(user.skills, 10);
            setSuggestedJobs(suggestions);
          }
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
      {/* Recommended Jobs Section for Applicants with Skills */}
      {isAuthenticated &&
        user?.role === "applicant" &&
        suggestedJobs.length > 0 && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Recommended for You
                  </h2>
                  <Badge variant="secondary" className="text-xs">
                    Based on your skills
                  </Badge>
                </div>
                {suggestedJobs.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                    className="text-primary"
                  >
                    {showAllSuggestions ? "Show less" : "View all"}
                    <ChevronRight
                      className={`h-4 w-4 ml-1 transition-transform ${
                        showAllSuggestions ? "rotate-90" : ""
                      }`}
                    />
                  </Button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(showAllSuggestions
                  ? suggestedJobs
                  : suggestedJobs.slice(0, 3)
                ).map((job) => (
                  <Link key={job.$id} href={`/jobs/${job.$id}`}>
                    <div className="rounded-lg border border-border bg-background p-4 hover:border-primary/50 hover:shadow-md transition-all h-full">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-foreground line-clamp-1">
                          {job.role}
                        </h3>
                        <span className="flex-shrink-0 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {Math.round(job.matchScore * 20)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1 truncate">
                          <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          {getLocationLabel(job.location)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {job.matchedSkills.slice(0, 2).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs bg-primary/10 text-primary"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {job.matchedSkills.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{job.matchedSkills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
