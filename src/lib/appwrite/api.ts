import {
  account,
  databases,
  DATABASE_ID,
  COLLECTIONS,
  ID,
  Query,
} from "./config";
import type {
  User,
  Job,
  Application,
  CreateJobData,
  CreateApplicationData,
  SignUpData,
  UserRole,
  JobStatus,
  ApplicationStatus,
  PlatformStats,
  SavedJob,
  Notification,
  NotificationType,
  ReferrerAnalytics,
} from "@/lib/types";

// ============================================
// AUTHENTICATION
// ============================================

export async function signUp(data: SignUpData): Promise<User> {
  // Delete any existing session first
  try {
    await account.deleteSession("current");
  } catch {
    // No existing session, continue
  }

  let authAccountId: string;

  try {
    // Create Appwrite account
    const authAccount = await account.create(
      ID.unique(),
      data.email,
      data.password,
      data.name
    );
    authAccountId = authAccount.$id;
  } catch (error: unknown) {
    // If user already exists in Auth, try to sign in and get their ID
    if (error instanceof Error && error.message.includes("already exists")) {
      try {
        await account.createEmailPasswordSession(data.email, data.password);
        const authUser = await account.get();
        authAccountId = authUser.$id;

        // Check if user document exists
        try {
          const existingUser = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            authAccountId
          );
          return existingUser as unknown as User;
        } catch {
          // User doc doesn't exist, will create below
        }
      } catch {
        throw new Error(
          "An account with this email already exists. Please sign in instead."
        );
      }
    } else {
      throw error;
    }
  }

  // Create session if not already created
  try {
    await account.createEmailPasswordSession(data.email, data.password);
  } catch {
    // Session might already exist
  }

  // Create user document in database
  try {
    const userDoc = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      authAccountId,
      {
        email: data.email,
        name: data.name,
        role: data.role,
        bio: "",
        linkedin: "",
        github: "",
        portfolio: "",
        company: "",
        skills: [],
        isVerified: false,
      }
    );
    return userDoc as unknown as User;
  } catch (error: unknown) {
    // If document already exists, fetch and return it
    if (error instanceof Error && error.message.includes("already exists")) {
      const existingDoc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        authAccountId
      );
      return existingDoc as unknown as User;
    }
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  // Delete any existing session first
  try {
    await account.deleteSession("current");
  } catch {
    // No existing session, continue
  }

  // Create session
  await account.createEmailPasswordSession(email, password);

  // Get the auth user
  const authUser = await account.get();

  // Check if user document exists, if not create one
  try {
    await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, authUser.$id);
  } catch {
    // User document doesn't exist, create it with default role
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      authUser.$id,
      {
        email: authUser.email,
        name: authUser.name || email.split("@")[0],
        role: "applicant",
        bio: "",
        linkedin: "",
        github: "",
        portfolio: "",
        company: "",
        skills: [],
        isVerified: false,
      }
    );
  }

  return authUser;
}

export async function signOut() {
  return await account.deleteSession("current");
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const authUser = await account.get();
    const userDoc = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      authUser.$id
    );
    return userDoc as unknown as User;
  } catch {
    return null;
  }
}

export async function getCurrentSession() {
  try {
    return await account.getSession("current");
  } catch {
    return null;
  }
}

// ============================================
// USER OPERATIONS
// ============================================

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      userId
    );
    return userDoc as unknown as User;
  } catch {
    return null;
  }
}

export async function updateUser(
  userId: string,
  data: Partial<User>
): Promise<User> {
  const userDoc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId,
    data
  );
  return userDoc as unknown as User;
}

export async function getAllUsers(): Promise<User[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.USERS,
    [Query.orderDesc("$createdAt"), Query.limit(100)]
  );
  return response.documents as unknown as User[];
}

export async function getUsersByRole(role: UserRole): Promise<User[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.USERS,
    [Query.equal("role", role), Query.equal("isActive", true), Query.limit(100)]
  );
  return response.documents as unknown as User[];
}

export async function deactivateUser(userId: string): Promise<User> {
  return await updateUser(userId, { isActive: false });
}

export async function reactivateUser(userId: string): Promise<User> {
  return await updateUser(userId, { isActive: true });
}

// ============================================
// JOB OPERATIONS
// ============================================

export async function createJob(
  data: CreateJobData,
  referrer: User
): Promise<Job> {
  const jobDoc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.JOBS,
    ID.unique(),
    {
      company: data.company,
      role: data.role,
      description: data.description,
      referralNotes: data.referralNotes,
      location: data.location,
      status: "pending",
      referrerId: referrer.$id,
      referrerName: referrer.name,
      referrerEmail: referrer.email,
    }
  );
  return jobDoc as unknown as Job;
}

export async function getJobById(jobId: string): Promise<Job | null> {
  try {
    const jobDoc = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.JOBS,
      jobId
    );
    const job = jobDoc as unknown as Job;

    // Fetch referrer's verification status
    try {
      const referrerDoc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        job.referrerId
      );
      job.isReferrerVerified =
        (referrerDoc as unknown as User).isVerified || false;
    } catch {
      job.isReferrerVerified = false;
    }

    return job;
  } catch {
    return null;
  }
}

export async function getApprovedJobs(): Promise<Job[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.JOBS,
    [
      Query.equal("status", "approved"),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]
  );
  return response.documents as unknown as Job[];
}

export interface SuggestedJob extends Job {
  matchScore: number;
  matchedSkills: string[];
}

export async function getSuggestedJobs(
  skills: string[],
  limit: number = 5
): Promise<SuggestedJob[]> {
  if (!skills || skills.length === 0) {
    return [];
  }

  // Get all approved jobs
  const jobs = await getApprovedJobs();

  // Score each job based on skill matches
  const scoredJobs: SuggestedJob[] = jobs.map((job) => {
    const jobText =
      `${job.role} ${job.description} ${job.company}`.toLowerCase();
    const matchedSkills: string[] = [];
    let matchScore = 0;

    skills.forEach((skill) => {
      const skillLower = skill.toLowerCase().trim();
      if (skillLower && jobText.includes(skillLower)) {
        matchScore += 1;
        matchedSkills.push(skill);
      }
      // Bonus for exact role match
      if (job.role.toLowerCase().includes(skillLower)) {
        matchScore += 0.5;
      }
    });

    return {
      ...job,
      matchScore,
      matchedSkills,
    };
  });

  // Filter jobs with at least one match, sort by score, return top N
  return scoredJobs
    .filter((job) => job.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

export async function getJobsByReferrer(referrerId: string): Promise<Job[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.JOBS,
    [
      Query.equal("referrerId", referrerId),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]
  );
  return response.documents as unknown as Job[];
}

export async function getPendingJobs(): Promise<Job[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.JOBS,
    [
      Query.equal("status", "pending"),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]
  );
  return response.documents as unknown as Job[];
}

export async function getAllJobs(): Promise<Job[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.JOBS,
    [Query.orderDesc("$createdAt"), Query.limit(100)]
  );
  return response.documents as unknown as Job[];
}

export async function updateJobStatus(
  jobId: string,
  status: JobStatus
): Promise<Job> {
  const jobDoc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.JOBS,
    jobId,
    { status }
  );
  return jobDoc as unknown as Job;
}

export async function deleteJob(jobId: string): Promise<void> {
  await databases.deleteDocument(DATABASE_ID, COLLECTIONS.JOBS, jobId);
}

// ============================================
// APPLICATION OPERATIONS
// ============================================

export async function createApplication(
  data: CreateApplicationData,
  applicant: User
): Promise<Application> {
  const applicationDoc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.APPLICATIONS,
    ID.unique(),
    {
      ...data,
      applicantId: applicant.$id,
      applicantName: applicant.name,
      applicantEmail: applicant.email,
      status: "pending",
    }
  );
  return applicationDoc as unknown as Application;
}

export async function getApplicationById(
  applicationId: string
): Promise<Application | null> {
  try {
    const applicationDoc = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.APPLICATIONS,
      applicationId
    );
    return applicationDoc as unknown as Application;
  } catch {
    return null;
  }
}

export async function getApplicationsByApplicant(
  applicantId: string
): Promise<Application[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.APPLICATIONS,
    [
      Query.equal("applicantId", applicantId),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]
  );
  return response.documents as unknown as Application[];
}

export async function getApplicationsByJob(
  jobId: string
): Promise<Application[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.APPLICATIONS,
    [
      Query.equal("jobId", jobId),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]
  );
  return response.documents as unknown as Application[];
}

export async function getAllApplications(): Promise<Application[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.APPLICATIONS,
    [Query.orderDesc("$createdAt"), Query.limit(100)]
  );
  return response.documents as unknown as Application[];
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<Application> {
  const applicationDoc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.APPLICATIONS,
    applicationId,
    { status }
  );
  return applicationDoc as unknown as Application;
}

export async function checkExistingApplication(
  jobId: string,
  applicantId: string
): Promise<boolean> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.APPLICATIONS,
    [
      Query.equal("jobId", jobId),
      Query.equal("applicantId", applicantId),
      Query.limit(1),
    ]
  );
  return response.documents.length > 0;
}

// ============================================
// ADMIN STATISTICS
// ============================================

export async function getPlatformStats(): Promise<PlatformStats> {
  const [usersResponse, jobsResponse, applicationsResponse] = await Promise.all(
    [
      databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [
        Query.limit(1000),
      ]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.JOBS, [
        Query.limit(1000),
      ]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.APPLICATIONS, [
        Query.limit(1000),
      ]),
    ]
  );

  const users = usersResponse.documents as unknown as User[];
  const jobs = jobsResponse.documents as unknown as Job[];
  const applications =
    applicationsResponse.documents as unknown as Application[];

  return {
    totalUsers: users.length,
    totalApplicants: users.filter((u) => u.role === "applicant").length,
    totalReferrers: users.filter((u) => u.role === "referrer").length,
    totalJobs: jobs.length,
    pendingJobs: jobs.filter((j) => j.status === "pending").length,
    approvedJobs: jobs.filter((j) => j.status === "approved").length,
    totalApplications: applications.length,
    pendingApplications: applications.filter((a) => a.status === "pending")
      .length,
    successfulReferrals: applications.filter((a) => a.status === "approved")
      .length,
  };
}

// ============================================
// SAVED JOBS (BOOKMARKS)
// ============================================

export async function saveJob(
  userId: string,
  jobId: string
): Promise<SavedJob> {
  const savedJobDoc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.SAVED_JOBS,
    ID.unique(),
    {
      userId,
      jobId,
    }
  );
  return savedJobDoc as unknown as SavedJob;
}

export async function unsaveJob(userId: string, jobId: string): Promise<void> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.SAVED_JOBS,
    [Query.equal("userId", userId), Query.equal("jobId", jobId), Query.limit(1)]
  );

  if (response.documents.length > 0) {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.SAVED_JOBS,
      response.documents[0].$id
    );
  }
}

export async function getSavedJobs(userId: string): Promise<SavedJob[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.SAVED_JOBS,
    [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]
  );
  return response.documents as unknown as SavedJob[];
}

export async function isJobSaved(
  userId: string,
  jobId: string
): Promise<boolean> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.SAVED_JOBS,
    [Query.equal("userId", userId), Query.equal("jobId", jobId), Query.limit(1)]
  );
  return response.documents.length > 0;
}

// ============================================
// JOB VIEWS TRACKING
// ============================================

export async function incrementJobViews(jobId: string): Promise<void> {
  try {
    const job = await getJobById(jobId);
    if (job) {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.JOBS, jobId, {
        viewCount: (job.viewCount || 0) + 1,
      });
    }
  } catch {
    // Silently fail - views are not critical
  }
}

// ============================================
// REFERRER ANALYTICS
// ============================================

export async function getReferrerAnalytics(
  referrerId: string
): Promise<ReferrerAnalytics> {
  const [jobsResponse, applicationsResponse] = await Promise.all([
    databases.listDocuments(DATABASE_ID, COLLECTIONS.JOBS, [
      Query.equal("referrerId", referrerId),
      Query.limit(100),
    ]),
    databases.listDocuments(DATABASE_ID, COLLECTIONS.APPLICATIONS, [
      Query.limit(1000),
    ]),
  ]);

  const jobs = jobsResponse.documents as unknown as Job[];
  const allApplications =
    applicationsResponse.documents as unknown as Application[];

  const jobIds = jobs.map((j) => j.$id);
  const myApplications = allApplications.filter((a) =>
    jobIds.includes(a.jobId)
  );

  const totalJobs = jobs.length;
  const totalJobViews = jobs.reduce(
    (sum, job) => sum + (job.viewCount || 0),
    0
  );
  const totalViews = totalJobViews;
  const totalApplications = myApplications.length;
  const approvedApplications = myApplications.filter(
    (a) => a.status === "approved"
  ).length;
  const hiredCount = myApplications.filter((a) => a.status === "hired").length;
  const conversionRate =
    totalJobViews > 0 ? (totalApplications / totalJobViews) * 100 : 0;

  const jobStats = jobs.map((job) => ({
    jobId: job.$id,
    role: job.role,
    company: job.company,
    views: job.viewCount || 0,
    applications: myApplications.filter((a) => a.jobId === job.$id).length,
  }));

  return {
    totalJobs,
    totalViews,
    totalJobViews,
    totalApplications,
    approvedApplications,
    hiredCount,
    conversionRate,
    jobStats,
  };
}

// ============================================
// USER PROFILE UPDATES
// ============================================

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    skills?: string[];
    company?: string;
    emailNotifications?: boolean;
    linkedinConnected?: boolean;
    linkedinId?: string;
    linkedinProfileUrl?: string;
  }
): Promise<User> {
  // Fetch current user to get existing values for required fields
  const currentUser = await databases.getDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId
  );
  const existingUser = currentUser as unknown as User;

  // Build update object with all required fields preserved
  const updateData: Record<string, unknown> = {
    // Always include required fields with existing values as fallback
    company: data.company ?? existingUser.company ?? "",
    bio: data.bio ?? existingUser.bio ?? "",
    github: data.github ?? existingUser.github ?? "",
    portfolio: data.portfolio ?? existingUser.portfolio ?? "",
    linkedin: data.linkedin ?? existingUser.linkedin ?? "",
  };

  // Add optional fields only if provided
  if (data.name !== undefined) updateData.name = data.name;
  if (data.skills !== undefined) updateData.skills = data.skills;
  if (data.emailNotifications !== undefined)
    updateData.emailNotifications = data.emailNotifications;

  // LinkedIn OAuth fields
  if (data.linkedinConnected !== undefined)
    updateData.linkedinConnected = data.linkedinConnected;
  if (data.linkedinId !== undefined) updateData.linkedinId = data.linkedinId;
  if (data.linkedinProfileUrl !== undefined)
    updateData.linkedinProfileUrl = data.linkedinProfileUrl;

  const userDoc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId,
    updateData
  );
  return userDoc as unknown as User;
}

// ============================================
// REFERRER VERIFICATION
// ============================================

// Request verification (called by referrer)
export async function requestVerification(userId: string): Promise<User> {
  const userDoc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId,
    {
      verificationRequested: true,
    }
  );
  return userDoc as unknown as User;
}

// Approve verification (called by admin)
export async function approveVerification(userId: string): Promise<User> {
  const userDoc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId,
    {
      isVerified: true,
      verificationRequested: false,
      verifiedAt: new Date().toISOString(),
    }
  );
  return userDoc as unknown as User;
}

// Reject verification (called by admin)
export async function rejectVerification(userId: string): Promise<User> {
  const userDoc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId,
    {
      verificationRequested: false,
    }
  );
  return userDoc as unknown as User;
}

// Get pending verification requests
export async function getPendingVerifications(): Promise<User[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.USERS,
    [
      Query.equal("role", "referrer"),
      Query.equal("verificationRequested", true),
      Query.limit(100),
    ]
  );
  return response.documents as unknown as User[];
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  relatedId?: string
): Promise<Notification> {
  const notificationDoc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.NOTIFICATIONS,
    ID.unique(),
    {
      userId,
      type,
      title,
      message,
      isRead: false,
      relatedId,
    }
  );
  return notificationDoc as unknown as Notification;
}

export async function getNotifications(
  userId: string
): Promise<Notification[]> {
  const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.NOTIFICATIONS,
    [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
      Query.limit(50),
    ]
  );
  return response.documents as unknown as Notification[];
}

export async function markNotificationRead(
  notificationId: string
): Promise<void> {
  await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.NOTIFICATIONS,
    notificationId,
    { isRead: true }
  );
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const notifications = await getNotifications(userId);
  await Promise.all(
    notifications
      .filter((n) => !n.isRead)
      .map((n) => markNotificationRead(n.$id))
  );
}

// ============================================
// LINKEDIN OAUTH
// ============================================

export function getLinkedInOAuthUrl(): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const successUrl = `${baseUrl}/auth/linkedin/callback`;
  const failureUrl = `${baseUrl}/auth/linkedin/callback?error=true`;

  // Appwrite OAuth2 URL for LinkedIn
  const endpoint =
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";

  return `${endpoint}/account/sessions/oauth2/linkedin?project=${projectId}&success=${encodeURIComponent(
    successUrl
  )}&failure=${encodeURIComponent(failureUrl)}`;
}

export async function connectLinkedIn(): Promise<void> {
  // Redirect to LinkedIn OAuth
  const url = getLinkedInOAuthUrl();
  window.location.href = url;
}

export async function handleLinkedInCallback(): Promise<{
  success: boolean;
  userData?: {
    name: string;
    email: string;
    linkedinId: string;
  };
  error?: string;
}> {
  try {
    // Get the current session after OAuth callback
    const session = await account.getSession("current");

    if (!session) {
      return { success: false, error: "No session found" };
    }

    // Get user info
    const authUser = await account.get();

    return {
      success: true,
      userData: {
        name: authUser.name || "",
        email: authUser.email || "",
        linkedinId: session.providerUid || "",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "OAuth callback failed",
    };
  }
}

export async function updateUserLinkedInData(
  userId: string,
  linkedinData: {
    linkedinConnected: boolean;
    linkedinId?: string;
    linkedinProfileUrl?: string;
    name?: string;
  }
): Promise<User> {
  // Fetch current user to preserve required fields
  const currentUser = await databases.getDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId
  );
  const existingUser = currentUser as unknown as User;

  const updateData: Record<string, unknown> = {
    company: existingUser.company ?? "",
    linkedinConnected: linkedinData.linkedinConnected,
  };

  if (linkedinData.linkedinId) {
    updateData.linkedinId = linkedinData.linkedinId;
  }
  if (linkedinData.linkedinProfileUrl) {
    updateData.linkedin = linkedinData.linkedinProfileUrl;
  }
  if (linkedinData.name && !existingUser.name) {
    updateData.name = linkedinData.name;
  }

  const userDoc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId,
    updateData
  );
  return userDoc as unknown as User;
}

export async function disconnectLinkedIn(userId: string): Promise<User> {
  const currentUser = await databases.getDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId
  );
  const existingUser = currentUser as unknown as User;

  const userDoc = await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    userId,
    {
      company: existingUser.company ?? "",
      linkedinConnected: false,
      linkedinId: null,
    }
  );
  return userDoc as unknown as User;
}
