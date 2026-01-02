"use client";

import { useEffect, useState } from "react";
import { Star, Quote, BadgeCheck, Users, Briefcase, Award } from "lucide-react";
import { getPlatformStats } from "@/lib/appwrite/api";
import type { PlatformStats } from "@/lib/types";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  isVerified?: boolean;
}

// Sample testimonials (in production, these would come from a database)
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Software Engineer",
    company: "Google",
    content:
      "Got my dream job at Google through a referral I found here. The referrer was incredibly helpful and provided valuable tips for the interview process.",
    avatar: "PS",
    isVerified: true,
  },
  {
    id: "2",
    name: "Rahul Patel",
    role: "Product Manager",
    company: "Microsoft",
    content:
      "As a referrer, I've helped 5 people land jobs at my company. It's rewarding to help talented individuals skip the traditional application process.",
    avatar: "RP",
    isVerified: true,
  },
  {
    id: "3",
    name: "Anjali Kumar",
    role: "Data Scientist",
    company: "Amazon",
    content:
      "The platform made it so easy to connect with referrers. Within 2 weeks of applying, I had multiple interview calls. Highly recommended!",
    avatar: "AK",
  },
];

function SocialProof() {
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const platformStats = await getPlatformStats();
        setStats(platformStats);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="border-t border-border bg-card/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {stats?.totalJobs || "50"}+
              </p>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {stats?.totalUsers || "200"}+
              </p>
              <p className="text-sm text-muted-foreground">Users</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {stats?.successfulReferrals || "30"}+
              </p>
              <p className="text-sm text-muted-foreground">
                Successful Referrals
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                <Star className="h-6 w-6 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">4.9</p>
              <p className="text-sm text-muted-foreground">User Rating</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Loved by job seekers & referrers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hear from people who found their dream jobs through trusted
              referrals.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-xl border border-border bg-card p-6"
              >
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-muted-foreground">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-foreground truncate">
                        {testimonial.name}
                      </p>
                      {testimonial.isVerified && (
                        <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60">
          <span className="text-sm font-medium text-muted-foreground">
            Trusted by employees at:
          </span>
          <span className="text-lg font-semibold text-muted-foreground">
            Google
          </span>
          <span className="text-lg font-semibold text-muted-foreground">
            Microsoft
          </span>
          <span className="text-lg font-semibold text-muted-foreground">
            Amazon
          </span>
          <span className="text-lg font-semibold text-muted-foreground">
            Meta
          </span>
          <span className="text-lg font-semibold text-muted-foreground">
            Flipkart
          </span>
        </div>
      </div>
    </section>
  );
}

export { SocialProof };
