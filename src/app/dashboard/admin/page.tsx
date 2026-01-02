"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  FileText,
  AlertCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  LoadingSpinner,
  Alert,
} from "@/components/ui";
import { useAuth } from "@/lib/hooks";
import { getPlatformStats, getPendingJobs } from "@/lib/appwrite/api";
import type { PlatformStats, Job } from "@/lib/types";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [platformStats, pending] = await Promise.all([
          getPlatformStats(),
          getPendingJobs(),
        ]);
        setStats(platformStats);
        setPendingJobs(pending);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor and manage the referkaro platform
        </p>
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Pending Jobs Alert */}
      {pendingJobs.length > 0 && (
        <Alert variant="warning" title="Jobs Pending Review">
          There are {pendingJobs.length} job{pendingJobs.length > 1 ? "s" : ""}{" "}
          waiting for approval.{" "}
          <Link href="/dashboard/admin/jobs" className="font-medium underline">
            Review now
          </Link>
        </Alert>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalJobs}
                </p>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <FileText className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalApplications}
                </p>
                <p className="text-sm text-muted-foreground">Applications</p>
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
                  {stats.pendingJobs}
                </p>
                <p className="text-sm text-muted-foreground">Pending Jobs</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Stats */}
      {stats && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Breakdown */}
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                User Breakdown
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Applicants</span>
                  <span className="font-medium text-foreground">
                    {stats.totalApplicants}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Referrers</span>
                  <span className="font-medium text-foreground">
                    {stats.totalReferrers}
                  </span>
                </div>
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-foreground">
                    {stats.totalUsers}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Breakdown */}
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Job Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Approved</span>
                  <span className="font-medium text-success">
                    {stats.approvedJobs}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-medium text-warning">
                    {stats.pendingJobs}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rejected</span>
                  <span className="font-medium text-destructive">
                    {stats.totalJobs - stats.approvedJobs - stats.pendingJobs}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/admin/jobs">
              <Button>
                <Briefcase className="mr-2 h-4 w-4" />
                Manage Jobs
              </Button>
            </Link>
            <Link href="/dashboard/admin/users">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/dashboard/admin/stats">
              <Button variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Statistics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Pending Jobs Preview */}
      {pendingJobs.length > 0 && (
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Jobs Awaiting Review
              </h2>
              <Link
                href="/dashboard/admin/jobs"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {pendingJobs.slice(0, 5).map((job) => (
                <div
                  key={job.$id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{job.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.company} · by {job.referrerName}
                    </p>
                  </div>
                  <span className="rounded-full bg-warning/20 px-3 py-1 text-xs font-medium text-warning">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
