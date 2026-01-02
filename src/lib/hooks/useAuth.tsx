"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User, SignUpData } from "@/lib/types";
import {
  getCurrentUser,
  signIn as apiSignIn,
  signOut as apiSignOut,
  signUp as apiSignUp,
} from "@/lib/appwrite/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    initAuth();
  }, [refreshUser]);

  const signIn = async (email: string, password: string) => {
    try {
      await apiSignIn(email, password);
      await refreshUser();

      // Redirect based on role
      const currentUser = await getCurrentUser();
      if (currentUser) {
        router.push(`/dashboard/${currentUser.role}`);
      } else {
        // Fallback redirect if user document couldn't be fetched
        router.push("/dashboard/applicant");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
    await apiSignUp(data);
    await refreshUser();
    router.push(`/dashboard/${data.role}`);
  };

  const signOut = async () => {
    await apiSignOut();
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
