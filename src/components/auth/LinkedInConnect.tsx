"use client";

import { useState } from "react";
import {
  Linkedin,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button, Alert } from "@/components/ui";
import { updateUserProfile } from "@/lib/appwrite/api";
import { getLinkedInAuthUrl, generateState } from "@/lib/linkedin/oauth";
import type { User } from "@/lib/types";

interface LinkedInConnectProps {
  user: User;
  onUpdate?: () => Promise<void>;
  variant?: "card" | "button";
}

export function LinkedInConnect({
  user,
  onUpdate,
  variant = "card",
}: LinkedInConnectProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = () => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate and store state for CSRF protection
      const state = generateState();
      sessionStorage.setItem("linkedin_oauth_state", state);

      // Redirect to LinkedIn OAuth
      const authUrl = getLinkedInAuthUrl(state);
      window.location.href = authUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initiate LinkedIn login"
      );
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect your LinkedIn account? This will remove your verified status."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updateUserProfile(user.$id, {
        linkedin: "",
        linkedinConnected: false,
        linkedinId: "",
        linkedinProfileUrl: "",
      });

      if (onUpdate) {
        await onUpdate();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to disconnect LinkedIn account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = user.linkedinConnected && user.linkedinId;

  if (variant === "button") {
    if (isConnected) {
      return (
        <div className="flex items-center gap-2">
          <a
            href={user.linkedinProfileUrl || user.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-[#0A66C2] hover:underline"
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn Profile</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <span className="flex items-center gap-1 text-xs text-green-600">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </span>
        </div>
      );
    }

    return (
      <Button
        variant="outline"
        onClick={handleConnect}
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Linkedin className="h-4 w-4" />
        )}
        {isLoading ? "Connecting..." : "Connect LinkedIn"}
      </Button>
    );
  }

  // Card variant
  return (
    <div className="rounded-lg border border-border p-4">
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">LinkedIn Verified</p>
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your LinkedIn account is connected and verified
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
            <div className="flex-1 min-w-0">
              <a
                href={user.linkedinProfileUrl || user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#0A66C2] hover:underline truncate block"
              >
                {user.linkedinProfileUrl || user.linkedin}
                <ExternalLink className="inline h-3 w-3 ml-1" />
              </a>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Disconnecting...
              </>
            ) : (
              "Disconnect LinkedIn"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A66C2]/10">
              <Linkedin className="h-5 w-5 text-[#0A66C2]" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">
                LinkedIn Verification
              </p>
              <p className="text-sm text-muted-foreground">
                Connect your LinkedIn to verify your professional profile
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">Why connect LinkedIn?</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Verify your professional identity</li>
              <li>Build trust with applicants or referrers</li>
              <li>Get a verified badge on your profile</li>
              <li>Auto-fill profile information</li>
            </ul>
          </div>

          <Button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Linkedin className="h-4 w-4 mr-2" />
                Connect with LinkedIn
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            We only access your basic profile information. Your data is secure.
          </p>
        </div>
      )}
    </div>
  );
}
