"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Briefcase,
  BarChart3,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

interface DashboardSidebarProps {
  role: UserRole;
}

function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();

  const links: Record<
    UserRole,
    { href: string; label: string; icon: typeof LayoutDashboard }[]
  > = {
    applicant: [
      {
        href: "/dashboard/applicant",
        label: "Overview",
        icon: LayoutDashboard,
      },
      {
        href: "/dashboard/applicant/applications",
        label: "My Applications",
        icon: FileText,
      },
      { href: "/jobs", label: "Browse Jobs", icon: Briefcase },
    ],
    referrer: [
      { href: "/dashboard/referrer", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/referrer/jobs", label: "My Jobs", icon: Briefcase },
      {
        href: "/dashboard/referrer/jobs/new",
        label: "Post Job",
        icon: PlusCircle,
      },
      {
        href: "/dashboard/referrer/applications",
        label: "Applications",
        icon: FileText,
      },
    ],
    admin: [
      { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/admin/jobs", label: "Manage Jobs", icon: Briefcase },
      { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
      { href: "/dashboard/admin/stats", label: "Statistics", icon: BarChart3 },
    ],
  };

  const roleConfig: Record<
    UserRole,
    { label: string; icon: typeof Shield; color: string }
  > = {
    applicant: { label: "Applicant", icon: FileText, color: "text-blue-500" },
    referrer: { label: "Referrer", icon: Briefcase, color: "text-green-500" },
    admin: { label: "Admin", icon: Shield, color: "text-purple-500" },
  };

  const currentLinks = links[role];
  const currentRole = roleConfig[role];
  const RoleIcon = currentRole.icon;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-border lg:bg-card">
      <div className="flex flex-col flex-1 p-4">
        {/* Role Badge */}
        <div className="mb-6 rounded-lg border border-border bg-secondary/50 p-4">
          <div className="flex items-center gap-3">
            <div
              className={cn("rounded-lg bg-background p-2", currentRole.color)}
            >
              <RoleIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="font-medium text-foreground">{currentRole.label}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export { DashboardSidebar };
