import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    
    // Support reading credentials from either the request body or environment variables
    const accountSid = body.accountSid || process.env.TWILIO_ACCOUNT_SID;
    const authToken = body.authToken || process.env.TWILIO_AUTH_TOKEN;
    const twimlAppSid = body.twimlAppSid || process.env.TWILIO_TWIML_APP_SID;
    const apiKey = body.apiKey || process.env.TWILIO_API_KEY;
    const apiSecret = body.apiSecret || process.env.TWILIO_API_SECRET;

    if (!accountSid) {
      return NextResponse.json({ error: "Missing Account SID (Account SID requerido)" }, { status: 400 });
    }

    if (!twimlAppSid) {
      return NextResponse.json({ error: "Missing TwiML App SID (TwiML App SID requerido)" }, { status: 400 });
    }

    // Twilio Voice Device registration requires an agent identity name
    const identity = body.identity || "agent_" + Math.floor(Math.random() * 9000 + 1000);

    let token;

    // Use API Key & Secret if available, otherwise fallback to Auth Token
    if (apiKey && apiSecret) {
      token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
    } else if (authToken) {
      // AccessToken class accepts accountSid, apiKey, apiSecret.
      // Under Twilio rules, you can use the Account SID as the API Key
      // and the Auth Token as the API Secret for quick token generation.
      token = new AccessToken(accountSid, accountSid, authToken, { identity });
    } else {
      return NextResponse.json({ error: "Missing Twilio Auth Token or API Key/Secret (Falta Auth Token o API Key/Secret)" }, { status: 400 });
    }

    // Add voice grant to enable outbound WebRTC calls
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true, // Allow inbound client calls if needed
    });

    token.addGrant(voiceGrant);

    return NextResponse.json({
      token: token.toJwt(),
      identity: identity
    });
  } catch (error: any) {
    console.error("Twilio Token Endpoint Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate token" }, { status: 500 });
  }
}
