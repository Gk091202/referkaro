"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Briefcase,
  BarChart3,
  LogOut,
  Bookmark,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui";
import { NotificationBell } from "./NotificationBell";
import type { UserRole } from "@/lib/types";

interface DashboardHeaderProps {
  role: UserRole;
}

function DashboardHeader({ role }: DashboardHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

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
        label: "Applications",
        icon: FileText,
      },
      {
        href: "/dashboard/applicant/saved",
        label: "Saved Jobs",
        icon: Bookmark,
      },
      {
        href: "/dashboard/applicant/profile",
        label: "Profile",
        icon: User,
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
      {
        href: "/dashboard/referrer/analytics",
        label: "Analytics",
        icon: BarChart3,
      },
      {
        href: "/dashboard/referrer/profile",
        label: "Profile",
        icon: User,
      },
    ],
    admin: [
      { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/admin/jobs", label: "Jobs", icon: Briefcase },
      { href: "/dashboard/admin/users", label: "Users", icon: Users },
      { href: "/dashboard/admin/stats", label: "Stats", icon: BarChart3 },
    ],
  };

  const currentLinks = links[role];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg lg:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="referkaro logo"
            width={32}
            height={32}
            className="h-8 w-8"
            style={{ background: "transparent" }}
          />
          <span className="text-lg font-bold text-foreground">referkaro</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background">
          <div className="space-y-1 px-4 py-4">
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
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t border-border pt-3 mt-3">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground"
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export { DashboardHeader };
