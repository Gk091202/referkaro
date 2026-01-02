"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Briefcase, User, Users } from "lucide-react";
import { Card, CardContent, Button, Input, Alert } from "@/components/ui";
import { useAuth } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

export function SignupContent() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") as UserRole | null;
  const { signUp } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    defaultRole && ["applicant", "referrer"].includes(defaultRole)
      ? defaultRole
      : "applicant"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });

  const roles: {
    value: UserRole;
    label: string;
    icon: typeof User;
    description: string;
  }[] = [
    {
      value: "applicant",
      label: "Job Seeker",
      icon: User,
      description: "Looking for referral opportunities",
    },
    {
      value: "referrer",
      label: "Referrer",
      icon: Users,
      description: "I can refer people at my company",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      await signUp({
        ...formData,
        role: selectedRole,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      </div>

      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Briefcase className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">referkaro</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardContent>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join referkaro and start your journey
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.value;

                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-muted-foreground/50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <div className="text-center">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {role.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              autoComplete="name"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              helperText="Minimum 8 characters"
              required
              autoComplete="new-password"
            />

            {selectedRole === "referrer" && (
              <Input
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company name"
                required
              />
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      <Link
        href="/"
        className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
