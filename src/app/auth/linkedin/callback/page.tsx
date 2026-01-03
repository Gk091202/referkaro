"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Linkedin, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, Button, Alert } from "@/components/ui";
import { updateUserProfile, getCurrentUser } from "@/lib/appwrite/api";
import { useAuth } from "@/lib/hooks";

function LinkedInCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const processCallback = async () => {
      const error = searchParams.get("error");
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      // Verify state to prevent CSRF attacks
      const savedState = sessionStorage.getItem("linkedin_oauth_state");

      if (error) {
        setStatus("error");
        setMessage(
          error === "user_cancelled_login"
            ? "LinkedIn login was cancelled."
            : "LinkedIn authentication failed. Please try again."
        );
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("No authorization code received from LinkedIn.");
        return;
      }

      if (state !== savedState) {
        setStatus("error");
        setMessage("Security validation failed. Please try again.");
        return;
      }

      try {
        // Exchange code for token and get profile via our API route
        const response = await fetch("/api/linkedin/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to connect LinkedIn");
        }

        const linkedinData = await response.json();

        // Get current user
        const currentUser = await getCurrentUser();

        if (currentUser) {
          // Update user with LinkedIn data
          await updateUserProfile(currentUser.$id, {
            linkedin: `https://linkedin.com/in/${linkedinData.linkedinId}`,
            linkedinConnected: true,
            linkedinId: linkedinData.linkedinId,
            linkedinProfileUrl: `https://linkedin.com/in/${linkedinData.linkedinId}`,
          });

          // Refresh user context
          if (refreshUser) {
            await refreshUser();
          }

          // Clear OAuth state
          sessionStorage.removeItem("linkedin_oauth_state");

          setStatus("success");
          setMessage(
            `LinkedIn connected successfully! Welcome, ${
              linkedinData.name || "User"
            }!`
          );
        } else {
          setStatus("error");
          setMessage(
            "Could not find user account. Please log in and try again."
          );
        }
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      }
    };

    processCallback();
  }, [searchParams, refreshUser]);

  const handleContinue = () => {
    // Redirect based on user role
    if (user?.role === "referrer") {
      router.push("/dashboard/referrer/profile");
    } else if (user?.role === "applicant") {
      router.push("/dashboard/applicant/profile");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          {status === "loading" && (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Connecting LinkedIn
              </h1>
              <p className="text-muted-foreground">
                Please wait while we connect your LinkedIn account...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h1 className="text-xl font-semibold text-foreground mb-2">
                LinkedIn Connected!
              </h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-primary mb-6">
                <Linkedin className="h-4 w-4" />
                <span>Your profile is now verified with LinkedIn</span>
              </div>
              <Button onClick={handleContinue} className="w-full">
                Continue to Profile
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Connection Failed
              </h1>
              <Alert variant="error" className="mb-6 text-left">
                {message}
              </Alert>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="flex-1"
                >
                  Go Home
                </Button>
                <Button onClick={() => router.back()} className="flex-1">
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            Loading...
          </h1>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LinkedInCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LinkedInCallbackContent />
    </Suspense>
  );
}
