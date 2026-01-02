import { Client, Account, Databases, ID, Query } from "appwrite";

// Appwrite client configuration
const client = new Client();

const endpoint =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";

if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

// Services
export const account = new Account(client);
export const databases = new Databases(client);

// IDs
export const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "referkaro_db";
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || "users",
  JOBS: process.env.NEXT_PUBLIC_APPWRITE_JOBS_COLLECTION_ID || "jobs",
  APPLICATIONS:
    process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS_COLLECTION_ID ||
    "applications",
};

export { client, ID, Query };
