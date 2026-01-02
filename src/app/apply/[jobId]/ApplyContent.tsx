"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, CheckCircle2 } from "lucide-react";
import { Card, CardContent, Alert, LoadingPage, Button } from "@/components/ui";
import { ApplicationForm } from "@/components/applications";
import { getJobById, checkExistingApplication } from "@/lib/appwrite/api";
import { useProtectedRoute } from "@/lib/hooks";
import { getLocationLabel } from "@/lib/utils";
import type { Job } from "@/lib/types";

interface ApplyContentProps {
  jobId: string;
}

export function ApplyContent({ jobId }: ApplyContentProps) {
  const {
    user,
    isLoading: authLoading,
    isAuthorized,
  } = useProtectedRoute({
    allowedRoles: ["applicant"],
  });

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAlreadyApplied, setHasAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(jobId);
        if (!jobData) {
          setError("Job not found");
        } else if (jobData.status !== "approved") {
          setError("This job is not accepting applications");
        } else {
          setJob(jobData);
          // Check if user has already applied
          if (user) {
            const alreadyApplied = await checkExistingApplication(
              jobId,
              user.$id
            );
            setHasAlreadyApplied(alreadyApplied);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job");
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && isAuthorized) {
      fetchJob();
    }
  }, [jobId, authLoading, isAuthorized, user]);

  if (authLoading || isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  if (!isAuthorized) {
    return (
      <Alert variant="error" title="Access Denied">
        Only applicants can apply to jobs. Please sign in with an applicant
        account.
      </Alert>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
        <Alert variant="error" title="Error">
          {error || "Job not found"}
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href={`/jobs/${job.$id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Job
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Apply for Position
        </h1>
        <p className="mt-2 text-muted-foreground">
          Submit your application to get referred
        </p>
      </div>

      {/* Job Summary */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground">{job.role}</h2>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{getLocationLabel(job.location)}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Referred by:{" "}
            <span className="text-foreground">{job.referrerName}</span>
          </p>
        </CardContent>
      </Card>

      {/* Application Form or Already Applied Status */}
      <Card>
        <CardContent>
          {hasAlreadyApplied ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Already Applied
              </h2>
              <p className="text-muted-foreground mb-6">
                You have already submitted an application for this position.
              </p>
              <Link href="/dashboard/applicant/applications">
                <Button variant="outline">View My Applications</Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Your Application
              </h2>
              <ApplicationForm job={job} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
