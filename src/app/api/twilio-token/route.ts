import { NextResponse } from "next/server";
import twilio from "twilio";
import { getSession } from "@/lib/session";

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

// Issues a short-lived Amazon Connect / WebRTC voice access token.
// All telephony credentials are read from server-side environment variables only —
// nothing sensitive is ever accepted from the client.
export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;

    if (!accountSid || !twimlAppSid) {
      return NextResponse.json(
        { error: "Calling service is not configured. Contact your administrator." },
        { status: 503 },
      );
    }

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Calling service is not configured (missing API key). Contact your administrator." },
        { status: 503 },
      );
    }

    // Derive a stable, sanitized identity from the authenticated session.
    const identity = ("agent_" + session.id).replace(/[^a-zA-Z0-9_]/g, "_");

    const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
    token.addGrant(
      new VoiceGrant({
        outgoingApplicationSid: twimlAppSid,
        incomingAllow: true,
      }),
    );

    return NextResponse.json({ token: token.toJwt(), identity });
  } catch (error) {
    console.error("[v0] Voice token error:", error);
    return NextResponse.json(
      { error: "Failed to generate voice token" },
      { status: 500 },
    );
  }
}
