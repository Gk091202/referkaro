"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Select, Alert } from "@/components/ui";
import { createJob } from "@/lib/appwrite/api";
import { useAuth } from "@/lib/hooks";
import type { CreateJobData, LocationType } from "@/lib/types";

function JobForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateJobData>({
    company: "",
    role: "",
    description: "",
    referralNotes: "",
    location: "remote",
  });

  const locationOptions = [
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "On-site" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createJob(formData, user);
      router.push("/dashboard/referrer/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      <Input
        label="Company Name"
        name="company"
        value={formData.company}
        onChange={handleChange}
        placeholder="e.g., Google, Microsoft, Startup Inc."
        required
      />

      <Input
        label="Role / Position"
        name="role"
        value={formData.role}
        onChange={handleChange}
        placeholder="e.g., Senior Software Engineer"
        required
      />

      <Select
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        options={locationOptions}
        required
      />

      <Textarea
        label="Job Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe the role, responsibilities, and requirements..."
        rows={5}
        required
      />

      <Textarea
        label="Referral Notes"
        name="referralNotes"
        value={formData.referralNotes}
        onChange={handleChange}
        placeholder="Share any tips for applicants, what you're looking for, or how the referral process works..."
        rows={4}
        helperText="This will be visible to applicants"
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
          {isSubmitting ? "Posting..." : "Post Job"}
        </Button>
      </div>
    </form>
  );
}

export { JobForm };
