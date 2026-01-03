"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Linkedin,
  Github,
  Globe,
  BadgeCheck,
  Briefcase,
  Calendar,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  LoadingPage,
  Alert,
  Avatar,
} from "@/components/ui";
import { getUserById, getJobsByReferrer } from "@/lib/appwrite/api";
import { formatDate } from "@/lib/utils";
import type { User, Job } from "@/lib/types";

interface ReferrerStats {
  totalJobs: number;
  activeJobs: number;
  memberSince: string;
}

export default function ReferrerProfilePage() {
  const params = useParams();
  const referrerId = params.id as string;

  const [referrer, setReferrer] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<ReferrerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferrerData = async () => {
      try {
        // Fetch referrer profile
        const userData = await getUserById(referrerId);

        if (!userData) {
          setError("Referrer not found");
          return;
        }

        if (userData.role !== "referrer") {
          setError("This profile is not available");
          return;
        }

        setReferrer(userData);

        // Fetch referrer's jobs (only approved ones for public view)
        const referrerJobs = await getJobsByReferrer(referrerId);
        const approvedJobs = referrerJobs.filter(
          (job) => job.status === "approved"
        );
        setJobs(approvedJobs);

        // Calculate stats
        setStats({
          totalJobs: approvedJobs.length,
          activeJobs: approvedJobs.length,
          memberSince: userData.$createdAt,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (referrerId) {
      fetchReferrerData();
    }
  }, [referrerId]);

  if (isLoading) {
    return <LoadingPage message="Loading referrer profile..." />;
  }

  if (error || !referrer) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
          <Alert variant="error" title="Error">
            {error || "Referrer not found"}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Back Button */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar name={referrer.name} size="xl" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {referrer.name}
                  </h1>
                  {referrer.isVerified && (
                    <span
                      title="Verified Referrer"
                      className="flex items-center"
                    >
                      <BadgeCheck className="h-6 w-6 text-primary" />
                    </span>
                  )}
                </div>

                {referrer.company && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Building2 className="h-4 w-4" />
                    <span>Works at {referrer.company}</span>
                  </div>
                )}

                {referrer.isVerified && (
                  <Badge variant="success" className="mb-4">
                    ✓ Verified Employee
                  </Badge>
                )}

                {referrer.bio && (
                  <p className="text-muted-foreground mb-4">{referrer.bio}</p>
                )}

                {/* Social Links */}
                <div className="flex flex-wrap gap-3">
                  {referrer.linkedin && (
                    <a
                      href={referrer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {referrer.github && (
                    <a
                      href={referrer.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                  {referrer.portfolio && (
                    <a
                      href={referrer.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <Briefcase className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalJobs}
                </p>
                <p className="text-sm text-muted-foreground">Jobs Posted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <Users className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.activeJobs}
                </p>
                <p className="text-sm text-muted-foreground">
                  Active Referrals
                </p>
              </CardContent>
            </Card>
            <Card className="col-span-2 sm:col-span-1">
              <CardContent className="pt-4 pb-4 text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <Calendar className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {formatDate(stats.memberSince)}
                </p>
                <p className="text-sm text-muted-foreground">Member Since</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Jobs */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Active Referral Opportunities
            </h2>

            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No active job referrals at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Link
                    key={job.$id}
                    href={`/jobs/${job.$id}`}
                    className="block"
                  >
                    <div className="rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">
                            {job.role}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Building2 className="h-4 w-4" />
                            <span>{job.company}</span>
                            <span>•</span>
                            <span className="capitalize">{job.location}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {formatDate(job.$createdAt)}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
