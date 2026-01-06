import { NextRequest, NextResponse } from "next/server";

const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "";
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || "";
const REDIRECT_URI =
  process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI ||
  "http://localhost:3000/auth/linkedin/callback";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";
const LINKEDIN_ME_URL = "https://api.linkedin.com/v2/me";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "LinkedIn credentials not configured" },
        { status: 500 }
      );
    }

    // Exchange code for access token
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    });

    const tokenResponse = await fetch(LINKEDIN_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return NextResponse.json(
        { error: "Failed to exchange authorization code" },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile from LinkedIn
    const profileResponse = await fetch(LINKEDIN_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error("Profile fetch failed:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch LinkedIn profile" },
        { status: 400 }
      );
    }

    const profile = await profileResponse.json();

    // Try to get vanity name from /v2/me endpoint
    let vanityName = "";
    let profileUrl = "";
    
    try {
      const meResponse = await fetch(`${LINKEDIN_ME_URL}?projection=(id,vanityName)`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (meResponse.ok) {
        const meData = await meResponse.json();
        vanityName = meData.vanityName || "";
        if (vanityName) {
          profileUrl = `https://www.linkedin.com/in/${vanityName}`;
        }
      }
    } catch (err) {
      console.log("Could not fetch vanity name from /v2/me:", err);
    }

    // Return LinkedIn profile data
    return NextResponse.json({
      linkedinId: profile.sub,
      name: profile.name,
      firstName: profile.given_name,
      lastName: profile.family_name,
      email: profile.email,
      picture: profile.picture,
      emailVerified: profile.email_verified,
      vanityName: vanityName,
      profileUrl: profileUrl,
    });
  } catch (error) {
    console.error("LinkedIn OAuth error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
