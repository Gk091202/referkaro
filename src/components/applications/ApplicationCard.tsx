import Link from "next/link";
import { Clock, ExternalLink, Building2, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  Badge,
  getStatusBadgeVariant,
  Avatar,
  Button,
} from "@/components/ui";
import { formatRelativeDate } from "@/lib/utils";
import type { Application, Job } from "@/lib/types";

interface ApplicationCardProps {
  application: Application;
  job?: Job;
  showApplicantInfo?: boolean;
  onStatusChange?: (
    applicationId: string,
    status: "approved" | "rejected"
  ) => void;
  isUpdating?: boolean;
}

function ApplicationCard({
  application,
  job,
  showApplicantInfo = false,
  onStatusChange,
  isUpdating = false,
}: ApplicationCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            {showApplicantInfo ? (
              <div className="flex items-center gap-3">
                <Avatar name={application.applicantName} />
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {application.applicantName}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {application.applicantEmail}
                  </p>
                </div>
              </div>
            ) : job ? (
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {job.role}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">{job.company}</span>
                </div>
              </div>
            ) : (
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">Application</h3>
              </div>
            )}
            <Badge variant={getStatusBadgeVariant(application.status)}>
              {application.status}
            </Badge>
          </div>

          {/* Message */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {application.message}
          </p>

          {/* Referral Notes - shown to applicants */}
          {!showApplicantInfo && job && (
            <div className="rounded-lg bg-secondary/50 p-3">
              <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                Notes from Referrer
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {job.referralNotes || "No additional notes provided."}
              </p>
            </div>
          )}

          {/* Resume Link */}
          {application.resumeLink && (
            <a
              href={application.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              View Resume
            </a>
          )}

          {/* Meta */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Applied {formatRelativeDate(application.$createdAt)}</span>
          </div>

          {/* Actions for referrer */}
          {onStatusChange && application.status === "pending" && (
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onStatusChange(application.$id, "rejected")}
                disabled={isUpdating}
              >
                Reject
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onStatusChange(application.$id, "approved")}
                disabled={isUpdating}
              >
                Approve
              </Button>
            </div>
          )}

          {/* Link to job for applicant view */}
          {!showApplicantInfo && job && (
            <Link
              href={`/jobs/${job.$id}`}
              className="text-sm text-primary hover:underline"
            >
              View Job Details →
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { ApplicationCard };
