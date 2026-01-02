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

  // Create Appwrite account
  const authAccount = await account.create(
    ID.unique(),
    data.email,
    data.password,
    data.name
  );

  // Create session
  await account.createEmailPasswordSession(data.email, data.password);

  // Create user document in database
  const userDoc = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.USERS,
    authAccount.$id,
    {
      email: data.email,
      name: data.name,
      role: data.role,
    }
  );

  return userDoc as unknown as User;
}

export async function signIn(email: string, password: string) {
  // Create session (don't delete existing - causes extra API calls)
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
    return jobDoc as unknown as Job;
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
  };
}
