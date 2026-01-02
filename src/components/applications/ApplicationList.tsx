import { FileText } from "lucide-react";
import { EmptyState } from "@/components/ui";
import { ApplicationCard } from "./ApplicationCard";
import type { Application, Job } from "@/lib/types";

interface ApplicationListProps {
  applications: Application[];
  jobs?: Map<string, Job>;
  showApplicantInfo?: boolean;
  showTimeline?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onStatusChange?: (
    applicationId: string,
    status: "approved" | "rejected"
  ) => void;
  isUpdating?: boolean;
}

function ApplicationList({
  applications,
  jobs,
  showApplicantInfo = false,
  showTimeline = false,
  emptyTitle = "No applications",
  emptyDescription = "There are no applications to display.",
  onStatusChange,
  isUpdating = false,
}: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<FileText className="h-8 w-8 text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {applications.map((application) => (
        <ApplicationCard
          key={application.$id}
          application={application}
          job={jobs?.get(application.jobId)}
          showApplicantInfo={showApplicantInfo}
          showTimeline={showTimeline}
          onStatusChange={onStatusChange}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  );
}

export { ApplicationList };
