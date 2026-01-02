// User Roles
export type UserRole = "applicant" | "referrer" | "admin";

// Job Status
export type JobStatus = "pending" | "approved" | "rejected";

// Application Status
export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interviewing"
  | "hired"
  | "approved"
  | "rejected";

// Location Type
export type LocationType = "remote" | "hybrid" | "onsite";

// Notification Type
export type NotificationType =
  | "application_received"
  | "application_status_update"
  | "application_approved"
  | "application_rejected"
  | "job_approved"
  | "job_rejected"
  | "new_job_match";

// User Document
export interface User {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills?: string[];
  isActive: boolean;
  isVerified?: boolean;
  verificationRequested?: boolean;
  verifiedAt?: string;
  emailNotifications?: boolean;
}

// Job Document
export interface Job {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  company: string;
  role: string;
  description: string;
  referralNotes: string;
  location: LocationType;
  status: JobStatus;
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
  isReferrerVerified?: boolean;
  viewCount?: number;
}

// Application Document
export interface Application {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  message: string;
  resumeLink: string;
  status: ApplicationStatus;
  statusUpdatedAt?: string;
  statusHistory?: ApplicationStatusChange[];
}

// Application Status Change for timeline
export interface ApplicationStatusChange {
  status: ApplicationStatus;
  timestamp: string;
  changedAt?: string;
  changedBy?: string;
  note?: string;
}

// Saved Job Document
export interface SavedJob {
  $id: string;
  $createdAt: string;
  userId: string;
  jobId: string;
}

// Notification Document
export interface Notification {
  $id: string;
  $createdAt: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string;
}

// Testimonial Document
export interface Testimonial {
  $id: string;
  name: string;
  role: string;
  company: string;
  message: string;
  imageUrl?: string;
}

// Extended types for UI
export interface JobWithApplicationCount extends Job {
  applicationCount?: number;
}

export interface ApplicationWithJob extends Application {
  job?: Job;
}

// Form types
export interface CreateJobData {
  company: string;
  role: string;
  description: string;
  referralNotes: string;
  location: LocationType;
}

export interface CreateApplicationData {
  jobId: string;
  message: string;
  resumeLink: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  company?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Stats for admin dashboard
export interface PlatformStats {
  totalUsers: number;
  totalApplicants: number;
  totalReferrers: number;
  totalJobs: number;
  pendingJobs: number;
  approvedJobs: number;
  totalApplications: number;
  pendingApplications: number;
  successfulReferrals: number;
}

// Referrer Analytics
export interface ReferrerAnalytics {
  totalJobs: number;
  totalViews: number;
  totalJobViews: number;
  totalApplications: number;
  approvedApplications: number;
  hiredCount: number;
  conversionRate: number;
  jobStats: {
    jobId: string;
    role: string;
    company: string;
    views: number;
    applications: number;
  }[];
}

// Search and Filter types
export interface JobFilters {
  search?: string;
  location?: LocationType | "all";
  company?: string;
  sortBy?: "newest" | "oldest" | "company";
}
