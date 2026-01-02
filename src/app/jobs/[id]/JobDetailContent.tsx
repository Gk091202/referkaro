"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Clock,
  User,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  getStatusBadgeVariant,
  LoadingPage,
  Alert,
} from "@/components/ui";
import { getJobById, checkExistingApplication } from "@/lib/appwrite/api";
import { useAuth } from "@/lib/hooks";
import { formatDate, getLocationLabel } from "@/lib/utils";
import type { Job } from "@/lib/types";

interface JobDetailContentProps {
  jobId: string;
}

export function JobDetailContent({ jobId }: JobDetailContentProps) {
  const { user, isAuthenticated } = useAuth();
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
        } else if (jobData.status !== "approved" && user?.role !== "admin") {
          setError("This job is not available");
        } else {
          setJob(jobData);
          // Check if user has already applied (only for applicants)
          if (user?.role === "applicant") {
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

    fetchJob();
  }, [jobId, user?.role, user?.$id]);

  if (isLoading) {
    return <LoadingPage message="Loading job details..." />;
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

  const canApply =
    isAuthenticated && user?.role === "applicant" && !hasAlreadyApplied;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      {/* Job Header */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {job.role}
                </h1>
                {job.status !== "approved" && (
                  <Badge variant={getStatusBadgeVariant(job.status)}>
                    {job.status}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{getLocationLabel(job.location)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Posted {formatDate(job.$createdAt)}</span>
                </div>
              </div>
            </div>

            {canApply && (
              <Link href={`/apply/${job.$id}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  Apply Now
                </Button>
              </Link>
            )}

            {isAuthenticated &&
              user?.role === "applicant" &&
              hasAlreadyApplied && (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Already Applied</span>
                </div>
              )}

            {!isAuthenticated && (
              <Link href={`/login?redirect=/apply/${job.$id}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  Login to Apply
                </Button>
              </Link>
            )}

            {isAuthenticated && user?.role !== "applicant" && (
              <Badge variant="secondary">Only applicants can apply</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            About this Role
          </h2>
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Referral Notes */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Notes from Referrer
            </h2>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {job.referralNotes}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Referrer Info */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              About the Referrer
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
              {job.referrerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-foreground">{job.referrerName}</p>
              <p className="text-sm text-muted-foreground">
                Employee at {job.company}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
