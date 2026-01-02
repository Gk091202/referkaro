"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, X, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  getStatusBadgeVariant,
  LoadingPage,
  Alert,
  Select,
} from "@/components/ui";
import { getAllJobs, updateJobStatus, deleteJob } from "@/lib/appwrite/api";
import { formatRelativeDate, getLocationLabel } from "@/lib/utils";
import type { Job, JobStatus } from "@/lib/types";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const allJobs = await getAllJobs();
      setJobs(allJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleStatusUpdate = async (jobId: string, status: JobStatus) => {
    setIsUpdating(jobId);
    try {
      await updateJobStatus(jobId, status);
      await fetchJobs();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update job status"
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsUpdating(jobId);
    try {
      await deleteJob(jobId);
      await fetchJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  if (isLoading) {
    return <LoadingPage message="Loading jobs..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Jobs</h1>
          <p className="mt-1 text-muted-foreground">
            Review, approve, or reject job postings
          </p>
        </div>

        {/* Filter */}
        <div className="w-full sm:w-48">
          <Select
            label="Filter by Status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: "all", label: "All Jobs" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
          />
        </div>
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No jobs found with the selected filter.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.$id}>
              <CardContent>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {job.role}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium">Company:</span>{" "}
                        {job.company}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {getLocationLabel(job.location)}
                      </p>
                      <p>
                        <span className="font-medium">Posted by:</span>{" "}
                        {job.referrerName} ({job.referrerEmail})
                      </p>
                      <p>
                        <span className="font-medium">Posted:</span>{" "}
                        {formatRelativeDate(job.$createdAt)}
                      </p>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 lg:flex-col">
                    {job.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(job.$id, "approved")
                          }
                          disabled={isUpdating === job.$id}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleStatusUpdate(job.$id, "rejected")
                          }
                          disabled={isUpdating === job.$id}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}

                    {job.status === "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(job.$id, "rejected")}
                        disabled={isUpdating === job.$id}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Revoke
                      </Button>
                    )}

                    {job.status === "rejected" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(job.$id, "approved")}
                        disabled={isUpdating === job.$id}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(job.$id)}
                      disabled={isUpdating === job.$id}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
