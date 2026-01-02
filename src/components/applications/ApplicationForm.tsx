"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Alert } from "@/components/ui";
import {
  createApplication,
  checkExistingApplication,
} from "@/lib/appwrite/api";
import { useAuth } from "@/lib/hooks";
import { validateUrl } from "@/lib/utils";
import type { Job } from "@/lib/types";

interface ApplicationFormProps {
  job: Job;
}

function ApplicationForm({ job }: ApplicationFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    resumeLink: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to apply");
      return;
    }

    if (!validateUrl(formData.resumeLink)) {
      setError("Please enter a valid URL for your resume");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Check if already applied
      const hasApplied = await checkExistingApplication(job.$id, user.$id);
      if (hasApplied) {
        setError("You have already applied to this job");
        return;
      }

      await createApplication(
        {
          jobId: job.$id,
          message: formData.message,
          resumeLink: formData.resumeLink,
        },
        user
      );

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/applicant/applications");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (success) {
    return (
      <Alert variant="success" title="Application Submitted!">
        Your application has been sent to the referrer. You&apos;ll be
        redirected to your applications shortly.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      <Textarea
        label="Cover Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Introduce yourself and explain why you'd be a great fit for this role..."
        rows={6}
        required
      />

      <Input
        label="Resume Link"
        name="resumeLink"
        type="url"
        value={formData.resumeLink}
        onChange={handleChange}
        placeholder="https://drive.google.com/your-resume"
        helperText="Link to your resume (Google Drive, Dropbox, etc.)"
        required
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}

export { ApplicationForm };
