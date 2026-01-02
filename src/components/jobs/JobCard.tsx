import Link from "next/link";
import { MapPin, Building2, Clock, User, CheckCircle2 } from "lucide-react";
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
}

function JobCard({
  job,
  showStatus = false,
  href,
  hasApplied = false,
}: JobCardProps) {
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
              </div>
            </div>
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
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{job.referrerName}</span>
            </div>
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
