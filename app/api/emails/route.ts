import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; 

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Get count from query params, default to 15
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '15');

    // Initialize Gmail client
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken as string });
    const gmail = google.gmail({ version: "v1", auth });

    // Fetch message IDs based on count
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: count,
    });

    const messages = res.data.messages || [];

    // Fetch full message details for each ID
    const emailDetails = await Promise.all(
      messages.map(async (msg) => {
        const msgRes = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });

        const headers = msgRes.data.payload?.headers || [];
        const from = headers.find((h) => h.name === "From")?.value || "Unknown";
        const subject =
          headers.find((h) => h.name === "Subject")?.value || "No Subject";
        const date = headers.find((h) => h.name === "Date")?.value || "";

        return {
          id: msg.id,
          from,
          subject,
          date,
          snippet: msgRes.data.snippet,
        };
      })
    );

    return NextResponse.json({ emails: emailDetails });
  } catch (error: any) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails", details: error.message },
      { status: 500 }
    );
  }
}
