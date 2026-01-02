"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, LoadingSpinner, Alert } from "@/components/ui";
import { getPlatformStats } from "@/lib/appwrite/api";
import type { PlatformStats } from "@/lib/types";

export default function AdminStatsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const platformStats = await getPlatformStats();
        setStats(platformStats);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load statistics"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Error">
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Users",
      items: [
        { label: "Total Users", value: stats.totalUsers },
        { label: "Applicants", value: stats.totalApplicants },
        { label: "Referrers", value: stats.totalReferrers },
      ],
    },
    {
      title: "Jobs",
      items: [
        { label: "Total Jobs", value: stats.totalJobs },
        { label: "Approved", value: stats.approvedJobs },
        { label: "Pending", value: stats.pendingJobs },
        {
          label: "Rejected",
          value: stats.totalJobs - stats.approvedJobs - stats.pendingJobs,
        },
      ],
    },
    {
      title: "Applications",
      items: [
        { label: "Total Applications", value: stats.totalApplications },
        { label: "Pending Review", value: stats.pendingApplications },
        {
          label: "Reviewed",
          value: stats.totalApplications - stats.pendingApplications,
        },
      ],
    },
  ];

  // Calculate some rates
  const applicationsPerJob =
    stats.totalJobs > 0
      ? (stats.totalApplications / stats.totalJobs).toFixed(1)
      : "0";
  const approvalRate =
    stats.totalJobs > 0
      ? ((stats.approvedJobs / stats.totalJobs) * 100).toFixed(0)
      : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Platform Statistics
        </h1>
        <p className="mt-1 text-muted-foreground">
          Detailed analytics and metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-4xl font-bold text-primary">
              {stats.totalUsers}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-4xl font-bold text-primary">{stats.totalJobs}</p>
            <p className="mt-1 text-sm text-muted-foreground">Total Jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-4xl font-bold text-primary">
              {stats.totalApplications}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-4xl font-bold text-primary">{approvalRate}%</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Job Approval Rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {card.title}
              </h2>
              <div className="space-y-3">
                {card.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Metrics */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Performance Metrics
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">
                {applicationsPerJob}
              </p>
              <p className="text-sm text-muted-foreground">
                Avg. Applications per Job
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">
                {approvalRate}%
              </p>
              <p className="text-sm text-muted-foreground">Job Approval Rate</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">
                {stats.pendingJobs}
              </p>
              <p className="text-sm text-muted-foreground">
                Jobs Awaiting Review
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <p className="text-2xl font-bold text-foreground">
                {stats.pendingApplications}
              </p>
              <p className="text-sm text-muted-foreground">
                Pending Applications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
