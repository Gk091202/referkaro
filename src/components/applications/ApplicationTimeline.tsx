"use client";

import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Briefcase,
} from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import type { ApplicationStatusChange, ApplicationStatus } from "@/lib/types";

interface ApplicationTimelineProps {
  statusHistory?: ApplicationStatusChange[];
  currentStatus: ApplicationStatus;
  createdAt: string;
}

const statusConfig: Record<
  ApplicationStatus,
  { icon: typeof Clock; color: string; bgColor: string; label: string }
> = {
  pending: {
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    label: "Application Submitted",
  },
  reviewing: {
    icon: Eye,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "Under Review",
  },
  shortlisted: {
    icon: FileText,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    label: "Shortlisted",
  },
  interviewing: {
    icon: Briefcase,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    label: "Interviewing",
  },
  hired: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: "Hired!",
  },
  approved: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: "Approved",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "Application Closed",
  },
};

function ApplicationTimeline({
  statusHistory = [],
  currentStatus,
  createdAt,
}: ApplicationTimelineProps) {
  // Create timeline items from status history or create a simple one
  const timelineItems =
    statusHistory.length > 0
      ? statusHistory
      : [
          {
            status: "pending" as ApplicationStatus,
            timestamp: createdAt,
          },
          ...(currentStatus !== "pending"
            ? [
                {
                  status: currentStatus,
                  timestamp: new Date().toISOString(),
                },
              ]
            : []),
        ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        Application Timeline
      </h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" />

        <div className="space-y-4">
          {timelineItems.map((item, index) => {
            const config = statusConfig[item.status];
            const Icon = config.icon;
            const isLast = index === timelineItems.length - 1;

            return (
              <div key={index} className="relative flex items-start gap-4 pl-1">
                {/* Status icon */}
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                    config.bgColor
                  } ${
                    isLast
                      ? "ring-2 ring-background ring-offset-2 ring-offset-card"
                      : ""
                  }`}
                >
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p
                    className={`font-medium ${
                      isLast ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {config.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeDate(item.timestamp)}
                  </p>
                  {item.note && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { ApplicationTimeline };
