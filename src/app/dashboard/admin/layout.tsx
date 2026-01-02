"use client";

import { type ReactNode } from "react";
import { DashboardSidebar, DashboardHeader } from "@/components/layout";
import { LoadingPage } from "@/components/ui";
import { useProtectedRoute } from "@/lib/hooks";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isLoading, isAuthorized } = useProtectedRoute({
    allowedRoles: ["admin"],
  });

  if (isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="admin" />
      <div className="flex flex-1 flex-col">
        <DashboardHeader role="admin" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
