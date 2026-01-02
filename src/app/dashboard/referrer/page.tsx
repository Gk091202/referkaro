"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  LoadingSpinner,
  Alert,
} from "@/components/ui";
import { useAuth } from "@/lib/hooks";
import { getJobsByReferrer, getApplicationsByJob } from "@/lib/appwrite/api";
import type { Job, Application } from "@/lib/types";

export default function ReferrerDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const jobStats = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    approved: jobs.filter((j) => j.status === "approved").length,
  };

  const appStats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your referral jobs and applications
          </p>
        </div>
        <Link href="/dashboard/referrer/jobs/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {jobStats.total}
              </p>
              <p className="text-sm text-muted-foreground">Total Jobs</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {jobStats.pending}
              </p>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {jobStats.approved}
              </p>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {appStats.pending}
              </p>
              <p className="text-sm text-muted-foreground">
                Pending Applications
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Jobs</h2>
            <Link
              href="/dashboard/referrer/jobs"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                You haven&apos;t posted any jobs yet.
              </p>
              <Link href="/dashboard/referrer/jobs/new">
                <Button className="mt-4">Post Your First Job</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 3).map((job) => (
                <Link
                  key={job.$id}
                  href={`/jobs/${job.$id}`}
                  className="block rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{job.role}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.company}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        job.status === "approved"
                          ? "bg-success/20 text-success"
                          : job.status === "rejected"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-warning/20 text-warning"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Applications Alert */}
      {appStats.pending > 0 && (
        <Alert variant="info" title="Pending Applications">
          You have {appStats.pending} application
          {appStats.pending > 1 ? "s" : ""} waiting for your review.{" "}
          <Link
            href="/dashboard/referrer/applications"
            className="font-medium underline"
          >
            Review now
          </Link>
        </Alert>
      )}
    </div>
  );
}
