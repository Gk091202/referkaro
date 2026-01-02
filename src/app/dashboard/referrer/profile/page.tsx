"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Linkedin,
  Building2,
  BadgeCheck,
  Save,
  Shield,
} from "lucide-react";
import { updateUserProfile, requestVerification } from "@/lib/appwrite/api";
import { useAuth, useProtectedRoute } from "@/lib/hooks";
import {
  LoadingPage,
  Alert,
  Card,
  CardContent,
  Button,
  Input,
  Textarea,
  Badge,
} from "@/components/ui";

export default function ReferrerProfilePage() {
  useProtectedRoute({ allowedRoles: ["referrer"] });
  const { user, refreshUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    linkedin: "",
    company: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        linkedin: user.linkedin || "",
        company: user.company || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile(user.$id, {
        name: formData.name,
        bio: formData.bio,
        linkedin: formData.linkedin,
        company: formData.company,
      });
      setSuccess("Profile updated successfully!");
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestVerification = async () => {
    if (!user || user.isVerified || user.verificationRequested) return;

    // Check if LinkedIn is provided
    if (!formData.linkedin) {
      setError("Please add your LinkedIn profile to request verification");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      await requestVerification(user.$id);
      setSuccess(
        "Verification request submitted! Our team will review your profile."
      );
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to request verification"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  if (!user) {
    return <LoadingPage message="Loading profile..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your referrer profile
          </p>
        </div>
        {user.isVerified && (
          <Badge variant="success" className="flex items-center gap-1">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified Referrer
          </Badge>
        )}
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" title="Success">
          {success}
        </Alert>
      )}

      {/* Verification Card */}
      {!user.isVerified && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-0">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {user.verificationRequested
                    ? "Verification Pending"
                    : "Get Verified"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {user.verificationRequested
                    ? "Your verification request is being reviewed by our team. You'll be notified once it's approved."
                    : "Verified referrers get a badge on their job postings, increasing trust with applicants. Add your LinkedIn profile to request verification."}
                </p>
                {!user.verificationRequested && (
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={handleRequestVerification}
                    disabled={isVerifying || !formData.linkedin}
                  >
                    {isVerifying ? "Requesting..." : "Request Verification"}
                  </Button>
                )}
                {user.verificationRequested && (
                  <Badge variant="warning" className="mt-3">
                    Pending Review
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardContent className="p-0 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="pl-10"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={user.email}
                    className="pl-10 bg-secondary/50"
                    disabled
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={formData.company}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    className="pl-10"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Bio
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Tell applicants about yourself and your role..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardContent className="p-0 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Professional Links
            </h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                LinkedIn *
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkedin: e.target.value,
                    }))
                  }
                  className="pl-10"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Required for verification
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
