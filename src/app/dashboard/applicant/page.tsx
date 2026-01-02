"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  LoadingSpinner,
  Alert,
} from "@/components/ui";
import { useAuth } from "@/lib/hooks";
import { getApplicationsByApplicant } from "@/lib/appwrite/api";
import type { Application } from "@/lib/types";

export default function ApplicantDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const apps = await getApplicationsByApplicant(user.$id);
        setApplications(apps);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track your applications and find new opportunities
        </p>
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
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Applications
              </p>
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
                {stats.pending}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
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
                {stats.approved}
              </p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.rejected}
              </p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/jobs">
              <Button>
                <Briefcase className="mr-2 h-4 w-4" />
                Browse Jobs
              </Button>
            </Link>
            <Link href="/dashboard/applicant/applications">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Applications
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Applications
            </h2>
            <Link
              href="/dashboard/applicant/applications"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                You haven&apos;t applied to any jobs yet.
              </p>
              <Link href="/jobs">
                <Button className="mt-4">Browse Jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 3).map((application) => (
                <div
                  key={application.$id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      Application #{application.$id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Applied{" "}
                      {new Date(application.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      application.status === "approved"
                        ? "bg-success/20 text-success"
                        : application.status === "rejected"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-warning/20 text-warning"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
