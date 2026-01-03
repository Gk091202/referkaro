// LinkedIn OAuth 2.0 Configuration and Helpers

const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "";
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "";
const REDIRECT_URI =
  process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI ||
  "http://localhost:3000/auth/linkedin/callback";

// LinkedIn OAuth URLs
const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";

// Generate a random state for CSRF protection
export function generateState(): string {
  const array = new Uint8Array(32);
  if (typeof window !== "undefined") {
    window.crypto.getRandomValues(array);
  } else {
    // Server-side fallback
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

// Generate LinkedIn OAuth authorization URL
export function getLinkedInAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: "openid profile email",
  });

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
}

// Exchange authorization code for access token (server-side only)
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  expires_in: number;
  id_token?: string;
}> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: LINKEDIN_CLIENT_ID,
    client_secret: LINKEDIN_CLIENT_SECRET,
  });

  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  return response.json();
}

// Fetch LinkedIn user profile using access token
export async function getLinkedInProfile(accessToken: string): Promise<{
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture?: string;
  email?: string;
  email_verified?: boolean;
}> {
  const response = await fetch(LINKEDIN_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch LinkedIn profile: ${error}`);
  }

  return response.json();
}

export { LINKEDIN_CLIENT_ID, REDIRECT_URI };
