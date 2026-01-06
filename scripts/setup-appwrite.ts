import { Client, Databases, ID, Permission, Role } from "node-appwrite";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
const apiKey = process.env.APPWRITE_API_KEY || "";

if (!projectId || !apiKey) {
  console.error("❌ Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID or APPWRITE_API_KEY in .env");
  process.exit(1);
}

client
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "referkaro_db";

const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "users",
  JOBS: process.env.NEXT_PUBLIC_APPWRITE_JOBS_COLLECTION_ID || "jobs",
  APPLICATIONS: process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS_COLLECTION_ID || "applications",
  SAVED_JOBS: process.env.NEXT_PUBLIC_APPWRITE_SAVED_JOBS_COLLECTION_ID || "saved_jobs",
  NOTIFICATIONS: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID || "notifications",
};

async function createDatabase() {
  try {
    await databases.create(DATABASE_ID, "ReferKaro Database");
    console.log("✅ Database created");
  } catch (error: any) {
    if (error.code === 409) {
      console.log("ℹ️  Database already exists");
    } else {
      throw error;
    }
  }
}

async function createUsersCollection() {
  const collectionId = COLLECTIONS.USERS;
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      collectionId,
      "Users",
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log("✅ Users collection created");

    // Create attributes
    await databases.createStringAttribute(DATABASE_ID, collectionId, "email", 255, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "name", 255, true);
    await databases.createEnumAttribute(DATABASE_ID, collectionId, "role", ["applicant", "referrer", "admin"], true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "company", 255, false);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "bio", 2000, false);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "linkedin", 500, false);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "github", 500, false);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "portfolio", 500, false);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "skills", 5000, false, undefined, true);
    await databases.createBooleanAttribute(DATABASE_ID, collectionId, "isActive", true, true);
    await databases.createBooleanAttribute(DATABASE_ID, collectionId, "isVerified", false, false);
    await databases.createBooleanAttribute(DATABASE_ID, collectionId, "verificationRequested", false, false);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "verifiedAt", 255, false);
    await databases.createBooleanAttribute(DATABASE_ID, collectionId, "emailNotifications", false, true);
    await databases.createBooleanAttribute(DATABASE_ID, collectionId, "linkedinConnected", false, false);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "linkedinId", 255, false);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "linkedinProfileUrl", 500, false);

    console.log("✅ Users attributes created");

    // Create indexes
    await databases.createIndex(DATABASE_ID, collectionId, "email_idx", "key", ["email"]);
    await databases.createIndex(DATABASE_ID, collectionId, "role_idx", "key", ["role"]);
    console.log("✅ Users indexes created");

  } catch (error: any) {
    if (error.code === 409) {
      console.log("ℹ️  Users collection already exists");
    } else {
      throw error;
    }
  }
}

async function createJobsCollection() {
  const collectionId = COLLECTIONS.JOBS;
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      collectionId,
      "Jobs",
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log("✅ Jobs collection created");

    // Create attributes
    await databases.createStringAttribute(DATABASE_ID, collectionId, "company", 255, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "role", 255, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "description", 10000, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "referralNotes", 5000, true);
    await databases.createEnumAttribute(DATABASE_ID, collectionId, "location", ["remote", "hybrid", "onsite"], true);
    await databases.createEnumAttribute(DATABASE_ID, collectionId, "status", ["pending", "approved", "rejected"], true, "pending");
    await databases.createStringAttribute(DATABASE_ID, collectionId, "referrerId", 255, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "referrerName", 255, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "referrerEmail", 255, true);
    await databases.createBooleanAttribute(DATABASE_ID, collectionId, "isReferrerVerified", false, false);
    await databases.createIntegerAttribute(DATABASE_ID, collectionId, "viewCount", false, 0);

    console.log("✅ Jobs attributes created");

    // Create indexes
    await databases.createIndex(DATABASE_ID, collectionId, "status_idx", "key", ["status"]);
    await databases.createIndex(DATABASE_ID, collectionId, "referrerId_idx", "key", ["referrerId"]);
    await databases.createIndex(DATABASE_ID, collectionId, "company_idx", "key", ["company"]);
    await databases.createIndex(DATABASE_ID, collectionId, "location_idx", "key", ["location"]);
    console.log("✅ Jobs indexes created");

  } catch (error: any) {
    if (error.code === 409) {
      console.log("ℹ️  Jobs collection already exists");
    } else {
      throw error;
    }
  }
}

async function createApplicationsCollection() {
  const collectionId = COLLECTIONS.APPLICATIONS;
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      collectionId,
      "Applications",
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log("✅ Applications collection created");

    // Create attributes
    await databases.createStringAttribute(DATABASE_ID, collectionId, "jobId", 255, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "applicantId", 255, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "applicantName", 255, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "applicantEmail", 255, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "message", 5000, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "resumeLink", 1000, true);
    await databases.createEnumAttribute(
      DATABASE_ID, 
      collectionId, 
      "status", 
      ["pending", "reviewing", "shortlisted", "interviewing", "hired", "approved", "rejected"], 
      true, 
      "pending"
    );
    await databases.createStringAttribute(DATABASE_ID, collectionId, "statusUpdatedAt", 255, false);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "statusHistory", 10000, false);

    console.log("✅ Applications attributes created");

    // Create indexes
    await databases.createIndex(DATABASE_ID, collectionId, "jobId_idx", "key", ["jobId"]);
    await databases.createIndex(DATABASE_ID, collectionId, "applicantId_idx", "key", ["applicantId"]);
    await databases.createIndex(DATABASE_ID, collectionId, "status_idx", "key", ["status"]);
    console.log("✅ Applications indexes created");

  } catch (error: any) {
    if (error.code === 409) {
      console.log("ℹ️  Applications collection already exists");
    } else {
      throw error;
    }
  }
}

async function createSavedJobsCollection() {
  const collectionId = COLLECTIONS.SAVED_JOBS;
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      collectionId,
      "Saved Jobs",
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log("✅ Saved Jobs collection created");

    // Create attributes
    await databases.createStringAttribute(DATABASE_ID, collectionId, "userId", 255, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "jobId", 255, true);

    console.log("✅ Saved Jobs attributes created");

    // Create indexes
    await databases.createIndex(DATABASE_ID, collectionId, "userId_idx", "key", ["userId"]);
    await databases.createIndex(DATABASE_ID, collectionId, "jobId_idx", "key", ["jobId"]);
    await databases.createIndex(DATABASE_ID, collectionId, "user_job_idx", "unique", ["userId", "jobId"]);
    console.log("✅ Saved Jobs indexes created");

  } catch (error: any) {
    if (error.code === 409) {
      console.log("ℹ️  Saved Jobs collection already exists");
    } else {
      throw error;
    }
  }
}

async function createNotificationsCollection() {
  const collectionId = COLLECTIONS.NOTIFICATIONS;
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      collectionId,
      "Notifications",
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log("✅ Notifications collection created");

    // Create attributes
    await databases.createStringAttribute(DATABASE_ID, collectionId, "userId", 255, true);
    await databases.createEnumAttribute(
      DATABASE_ID, 
      collectionId, 
      "type", 
      [
        "application_received",
        "application_status_update",
        "application_approved",
        "application_rejected",
        "job_approved",
        "job_rejected",
        "new_job_match"
      ], 
      true
    );
    await databases.createStringAttribute(DATABASE_ID, collectionId, "title", 255, true);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "message", 1000, true);
    await databases.createBooleanAttribute(DATABASE_ID, collectionId, "isRead", true, false);
    await databases.createStringAttribute(DATABASE_ID, collectionId, "relatedId", 255, false);

    console.log("✅ Notifications attributes created");

    // Create indexes
    await databases.createIndex(DATABASE_ID, collectionId, "userId_idx", "key", ["userId"]);
    await databases.createIndex(DATABASE_ID, collectionId, "isRead_idx", "key", ["isRead"]);
    console.log("✅ Notifications indexes created");

  } catch (error: any) {
    if (error.code === 409) {
      console.log("ℹ️  Notifications collection already exists");
    } else {
      throw error;
    }
  }
}

async function setup() {
  console.log("🚀 Starting Appwrite setup...\n");
  
  try {
    await createDatabase();
    
    // Wait a bit for database to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await createUsersCollection();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await createJobsCollection();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await createApplicationsCollection();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await createSavedJobsCollection();
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await createNotificationsCollection();
    
    console.log("\n✅ Appwrite setup complete!");
    console.log("\n📝 Next steps:");
    console.log("1. Update your .env file with the correct values");
    console.log("2. Run 'npm run dev' to start the development server");
    
  } catch (error) {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  }
}

setup();
