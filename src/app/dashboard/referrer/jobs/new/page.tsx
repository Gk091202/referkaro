"use client";

import { Card, CardContent } from "@/components/ui";
import { JobForm } from "@/components/jobs";

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Post a New Job</h1>
        <p className="mt-1 text-muted-foreground">
          Create a referral opportunity for job seekers
        </p>
      </div>

      {/* Info */}
      <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
        <h3 className="font-medium text-foreground">Before you post</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>
            • Your job will be reviewed by our admin team before going live
          </li>
          <li>
            • Make sure you&apos;re authorized to refer candidates at your
            company
          </li>
          <li>
            • Be specific about what you&apos;re looking for in applicants
          </li>
        </ul>
      </div>

      {/* Form */}
      <Card>
        <CardContent>
          <JobForm />
        </CardContent>
      </Card>
    </div>
  );
}
