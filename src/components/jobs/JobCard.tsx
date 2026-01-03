import Link from "next/link";
import {
  MapPin,
  Building2,
  Clock,
  User,
  CheckCircle2,
  Bookmark,
  BadgeCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  Badge,
  getStatusBadgeVariant,
} from "@/components/ui";
import { formatRelativeDate, getLocationLabel } from "@/lib/utils";
import type { Job } from "@/lib/types";

interface JobCardProps {
  job: Job;
  showStatus?: boolean;
  href?: string;
  hasApplied?: boolean;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
  isVerifiedReferrer?: boolean;
}

function JobCard({
  job,
  showStatus = false,
  href,
  hasApplied = false,
  isSaved = false,
  onToggleSave,
  isVerifiedReferrer = false,
}: JobCardProps) {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(job.$id);
  };

  const content = (
    <Card hover={!!href} className="h-full">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {job.role}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.company}</span>
                {isVerifiedReferrer && (
                  <span title="Verified Referrer">
                    <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onToggleSave && (
                <button
                  onClick={handleSaveClick}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isSaved
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  title={isSaved ? "Remove from saved" : "Save job"}
                >
                  <Bookmark
                    className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                  />
                </button>
              )}
              <div className="flex flex-col items-end gap-2">
                {hasApplied && (
                  <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-500">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Applied
                  </div>
                )}
                {showStatus && (
                  <Badge variant={getStatusBadgeVariant(job.status)}>
                    {job.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{getLocationLabel(job.location)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formatRelativeDate(job.$createdAt)}</span>
            </div>
            <Link
              href={`/referrer/${job.referrerId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <User className="h-4 w-4" />
              <span className="hover:underline">{job.referrerName}</span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export { JobCard };
