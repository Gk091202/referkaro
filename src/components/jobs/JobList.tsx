import { Briefcase } from "lucide-react";
import { EmptyState, Button } from "@/components/ui";
import { JobCard } from "./JobCard";
import type { Job } from "@/lib/types";
import Link from "next/link";

interface JobListProps {
  jobs: Job[];
  showStatus?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  showCreateButton?: boolean;
}

function JobList({
  jobs,
  showStatus = false,
  emptyTitle = "No jobs found",
  emptyDescription = "There are no jobs to display at the moment.",
  showCreateButton = false,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<Briefcase className="h-8 w-8 text-muted-foreground" />}
        action={
          showCreateButton ? (
            <Link href="/dashboard/referrer/jobs/new">
              <Button>Post a Job</Button>
            </Link>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard
          key={job.$id}
          job={job}
          showStatus={showStatus}
          href={`/jobs/${job.$id}`}
        />
      ))}
    </div>
  );
}

export { JobList };
