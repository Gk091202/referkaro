import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-secondary text-secondary-foreground",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-success/20 text-success border border-success/30",
    warning: "bg-warning/20 text-warning border border-warning/30",
    destructive:
      "bg-destructive/20 text-destructive border border-destructive/30",
    outline: "border border-border bg-transparent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Helper function to get badge variant from status
function getStatusBadgeVariant(
  status: string
): "success" | "warning" | "destructive" {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
      return "destructive";
    default:
      return "warning";
  }
}

export { Badge, getStatusBadgeVariant };
export type { BadgeProps, BadgeVariant };
