"use client";

import { type ReactNode } from "react";
import { DashboardSidebar, DashboardHeader } from "@/components/layout";
import { LoadingPage } from "@/components/ui";
import { useProtectedRoute } from "@/lib/hooks";

export default function ApplicantDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isLoading, isAuthorized } = useProtectedRoute({
    allowedRoles: ["applicant"],
  });

  if (isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  if (!isAuthorized) {
    return null; // Redirect happens in the hook
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="applicant" />
      <div className="flex flex-1 flex-col">
        <DashboardHeader role="applicant" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
