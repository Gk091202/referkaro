/**
 * Appwrite Database Setup Script
 *
 * This script creates the necessary database and collections for referkaro.
 * Run this once after setting up your Appwrite project.
 *
 * Prerequisites:
 * 1. Create an Appwrite project
 * 2. Get your API key with Database permissions
 * 3. Set the environment variables in .env.local
 *
 * Usage: npx ts-node scripts/setup-appwrite.ts
 */

import { Client, Databases, ID, Permission, Role } from "node-appwrite";

// Configuration
const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
const API_KEY = process.env.APPWRITE_API_KEY || "";

const DATABASE_ID = "referkaro_db";
const COLLECTIONS = {
  USERS: "users",
  JOBS: "jobs",
  APPLICATIONS: "applications",
};

async function setup() {
  console.log("🚀 Starting Appwrite setup for referkaro...\n");

  if (!PROJECT_ID || !API_KEY) {
    console.error("❌ Missing environment variables. Please set:");
    console.error("   - NEXT_PUBLIC_APPWRITE_PROJECT_ID");
    console.error("   - APPWRITE_API_KEY");
    process.exit(1);
  }

  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  const databases = new Databases(client);

  try {
    // Create Database
    console.log("📦 Creating database...");
    try {
      await databases.create(DATABASE_ID, "referkaro Database");
      console.log("   ✅ Database created");
    } catch (error: any) {
      if (error.code === 409) {
        console.log("   ⚠️  Database already exists");
      } else {
        throw error;
      }
    }

    // Create Users Collection
    console.log("\n👥 Creating users collection...");
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.USERS,
        "Users",
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
        ]
      );
      console.log("   ✅ Users collection created");

      // Create user attributes
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.USERS,
        "email",
        255,
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.USERS,
        "name",
        255,
        true
      );
      await databases.createEnumAttribute(
        DATABASE_ID,
        COLLECTIONS.USERS,
        "role",
        ["applicant", "referrer", "admin"],
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.USERS,
        "company",
        255,
        false
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.USERS,
        "bio",
        1000,
        false
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.USERS,
        "linkedIn",
        500,
        false
      );
      await databases.createBooleanAttribute(
        DATABASE_ID,
        COLLECTIONS.USERS,
        "isActive",
        true,
        true
      );
      console.log("   ✅ User attributes created");
    } catch (error: any) {
      if (error.code === 409) {
        console.log("   ⚠️  Users collection already exists");
      } else {
        throw error;
      }
    }

    // Create Jobs Collection
    console.log("\n💼 Creating jobs collection...");
    try {
      await databases.createCollection(DATABASE_ID, COLLECTIONS.JOBS, "Jobs", [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]);
      console.log("   ✅ Jobs collection created");

      // Create job attributes
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.JOBS,
        "company",
        255,
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.JOBS,
        "role",
        255,
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.JOBS,
        "description",
        5000,
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.JOBS,
        "referralNotes",
        2000,
        true
      );
      await databases.createEnumAttribute(
        DATABASE_ID,
        COLLECTIONS.JOBS,
        "location",
        ["remote", "hybrid", "onsite"],
        true
      );
      await databases.createEnumAttribute(
        DATABASE_ID,
        COLLECTIONS.JOBS,
        "status",
        ["pending", "approved", "rejected"],
        true,
        "pending"
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.JOBS,
        "referrerId",
        36,
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.JOBS,
        "referrerName",
        255,
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.JOBS,
        "referrerEmail",
        255,
        true
      );
      console.log("   ✅ Job attributes created");

      // Create indexes
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for attributes
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.JOBS,
        "status_idx",
        "key",
        ["status"]
      );
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.JOBS,
        "referrer_idx",
        "key",
        ["referrerId"]
      );
      console.log("   ✅ Job indexes created");
    } catch (error: any) {
      if (error.code === 409) {
        console.log("   ⚠️  Jobs collection already exists");
      } else {
        throw error;
      }
    }

    // Create Applications Collection
    console.log("\n📝 Creating applications collection...");
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.APPLICATIONS,
        "Applications",
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
        ]
      );
      console.log("   ✅ Applications collection created");

      // Create application attributes
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.APPLICATIONS,
        "jobId",
        36,
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.APPLICATIONS,
        "applicantId",
        36,
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.APPLICATIONS,
        "applicantName",
        255,
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.APPLICATIONS,
        "applicantEmail",
        255,
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.APPLICATIONS,
        "message",
        5000,
        true
      );
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTIONS.APPLICATIONS,
        "resumeLink",
        500,
        true
      );
      await databases.createEnumAttribute(
        DATABASE_ID,
        COLLECTIONS.APPLICATIONS,
        "status",
        ["pending", "approved", "rejected"],
        true,
        "pending"
      );
      console.log("   ✅ Application attributes created");

      // Create indexes
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for attributes
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.APPLICATIONS,
        "job_idx",
        "key",
        ["jobId"]
      );
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.APPLICATIONS,
        "applicant_idx",
        "key",
        ["applicantId"]
      );
      await databases.createIndex(
        DATABASE_ID,
        COLLECTIONS.APPLICATIONS,
        "status_idx",
        "key",
        ["status"]
      );
      console.log("   ✅ Application indexes created");
    } catch (error: any) {
      if (error.code === 409) {
        console.log("   ⚠️  Applications collection already exists");
      } else {
        throw error;
      }
    }

    console.log("\n✨ Setup complete!\n");
    console.log("Next steps:");
    console.log("1. Update your .env.local with:");
    console.log(`   NEXT_PUBLIC_APPWRITE_DATABASE_ID=${DATABASE_ID}`);
    console.log(
      `   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=${COLLECTIONS.USERS}`
    );
    console.log(
      `   NEXT_PUBLIC_APPWRITE_JOBS_COLLECTION_ID=${COLLECTIONS.JOBS}`
    );
    console.log(
      `   NEXT_PUBLIC_APPWRITE_APPLICATIONS_COLLECTION_ID=${COLLECTIONS.APPLICATIONS}`
    );
    console.log("\n2. Create an admin user manually through Appwrite console");
    console.log("   - Create a user with the auth service");
    console.log(
      '   - Add a document to the users collection with role: "admin"'
    );
    console.log("\n3. Run the development server: npm run dev");
  } catch (error) {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  }
}

setup();
