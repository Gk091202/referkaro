import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

function Alert({ variant = "info", title, children, className }: AlertProps) {
  const variants: Record<
    AlertVariant,
    { bg: string; border: string; icon: typeof Info }
  > = {
    info: {
      bg: "bg-primary/10",
      border: "border-primary/30",
      icon: Info,
    },
    success: {
      bg: "bg-success/10",
      border: "border-success/30",
      icon: CheckCircle,
    },
    warning: {
      bg: "bg-warning/10",
      border: "border-warning/30",
      icon: AlertTriangle,
    },
    error: {
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      icon: AlertCircle,
    },
  };

  const { bg, border, icon: Icon } = variants[variant];

  return (
    <div
      className={cn("flex gap-3 rounded-lg border p-4", bg, border, className)}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="mb-1 font-medium text-foreground">{title}</h4>}
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export { Alert };
export type { AlertProps, AlertVariant };
