"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import type { UserRole } from "@/lib/types";

interface UseProtectedRouteOptions {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { allowedRoles, redirectTo = "/login" } = options;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on actual role
      router.push(`/dashboard/${user.role}`);
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, redirectTo, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isAuthorized: user && (!allowedRoles || allowedRoles.includes(user.role)),
  };
}
