// User Roles
export type UserRole = "applicant" | "referrer" | "admin";

// Job Status
export type JobStatus = "pending" | "approved" | "rejected";

// Application Status
export type ApplicationStatus = "pending" | "approved" | "rejected";

// Location Type
export type LocationType = "remote" | "hybrid" | "onsite";

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
  linkedIn?: string;
  isActive: boolean;
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
}
