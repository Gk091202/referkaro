"use client";

import Link from "next/link";
import { ArrowLeft, Users, Target, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About referkaro
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We&apos;re on a mission to make job referrals accessible to
            everyone, not just those with connections.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <Card>
            <CardContent className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Our Mission
              </h3>
              <p className="text-sm text-muted-foreground">
                Democratize access to job referrals and help talented people get
                discovered regardless of their network.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Community First
              </h3>
              <p className="text-sm text-muted-foreground">
                We believe in building a community where referrers and
                applicants can connect authentically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Trust & Transparency
              </h3>
              <p className="text-sm text-muted-foreground">
                Verified referrers, clear communication, and a platform built on
                trust and integrity.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story Section */}
        <Card className="mb-12">
          <CardContent className="py-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                referkaro was born out of a simple observation: the best jobs
                often go to people with the right connections, not necessarily
                the most qualified candidates.
              </p>
              <p>
                We wanted to change that. We built a platform where employees at
                top companies can share referral opportunities with talented
                individuals they might never have met otherwise.
              </p>
              <p>
                Today, referkaro connects thousands of job seekers with
                referrers at leading companies, helping level the playing field
                in the job market.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to get started?
          </h2>
          <div className="flex justify-center gap-4">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
