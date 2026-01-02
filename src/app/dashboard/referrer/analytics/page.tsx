"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Eye,
  FileText,
  CheckCircle,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { getReferrerAnalytics, getJobsByReferrer } from "@/lib/appwrite/api";
import { useAuth, useProtectedRoute } from "@/lib/hooks";
import { LoadingPage, Alert, Card, CardContent, Badge } from "@/components/ui";
import type { ReferrerAnalytics, Job } from "@/lib/types";

export default function ReferrerAnalyticsPage() {
  useProtectedRoute({ allowedRoles: ["referrer"] });
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ReferrerAnalytics | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [analyticsData, jobsData] = await Promise.all([
          getReferrerAnalytics(user.$id),
          getJobsByReferrer(user.$id),
        ]);
        setAnalytics(analyticsData);
        setJobs(jobsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load analytics"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return <LoadingPage message="Loading analytics..." />;
  }

  if (error) {
    return (
      <Alert variant="error" title="Error loading analytics">
        {error}
      </Alert>
    );
  }

  const conversionRate =
    analytics && analytics.totalApplications > 0
      ? ((analytics.hiredCount / analytics.totalApplications) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your referral performance and impact
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Briefcase className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics?.totalJobs || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-500/10 p-3">
                <Eye className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics?.totalViews || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-500/10 p-3">
                <FileText className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics?.totalApplications || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hired</p>
                <p className="text-2xl font-bold text-foreground">
                  {analytics?.hiredCount || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rate */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {conversionRate}%
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Applications to Hires
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Job Performance */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Job Performance
        </h2>
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="p-0 text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No jobs posted yet. Post your first job to see analytics.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Card key={job.$id}>
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-foreground truncate">
                        {job.role}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {job.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-foreground">
                          {job.viewCount || 0}
                        </p>
                        <p className="text-muted-foreground">Views</p>
                      </div>
                      <Badge
                        variant={
                          job.status === "approved"
                            ? "success"
                            : job.status === "pending"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
