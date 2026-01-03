"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Building2,
  MapPin,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  LoadingSpinner,
  Alert,
  Badge,
} from "@/components/ui";
import { useAuth } from "@/lib/hooks";
import {
  getApplicationsByApplicant,
  getSuggestedJobs,
  type SuggestedJob,
} from "@/lib/appwrite/api";
import { getLocationLabel } from "@/lib/utils";
import type { Application } from "@/lib/types";

export default function ApplicantDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [suggestedJobs, setSuggestedJobs] = useState<SuggestedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const apps = await getApplicationsByApplicant(user.$id);
        setApplications(apps);

        // Fetch suggested jobs based on user skills
        if (user.skills && user.skills.length > 0) {
          const suggestions = await getSuggestedJobs(user.skills, 5);
          setSuggestedJobs(suggestions);
        }
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

      {/* Recommended Jobs */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Recommended for You
              </h2>
            </div>
            {suggestedJobs.length > 0 && (
              <Link
                href="/jobs"
                className="text-sm text-primary hover:underline"
              >
                View all jobs
              </Link>
            )}
          </div>

          {!user?.skills || user.skills.length === 0 ? (
            <div className="text-center py-8 bg-secondary/30 rounded-lg">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                Add skills to your profile to get personalized job
                recommendations
              </p>
              <Link href="/dashboard/applicant/profile">
                <Button className="mt-4" variant="outline">
                  Update Profile
                </Button>
              </Link>
            </div>
          ) : suggestedJobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                No matching jobs found for your skills yet. Check back later!
              </p>
              <Link href="/jobs">
                <Button className="mt-4">Browse All Jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestedJobs.map((job) => (
                <Link key={job.$id} href={`/jobs/${job.$id}`} className="block">
                  <div className="rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {job.role}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {getLocationLabel(job.location)}
                          </span>
                        </div>
                        {job.matchedSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {job.matchedSkills.slice(0, 3).map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs bg-primary/10 text-primary"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {job.matchedSkills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{job.matchedSkills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                        <Sparkles className="h-3 w-3" />
                        {Math.round(job.matchScore * 20)}% match
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
