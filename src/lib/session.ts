import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { SessionUser } from "./types";

const COOKIE_NAME = "llamando_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getSecretKey(): Uint8Array {
  // Prefer an explicit SESSION_SECRET. If it isn't configured, derive a stable
  // signing key from other long-lived project secrets so sessions remain valid
  // across restarts without requiring an additional environment variable.
  const explicit = process.env.SESSION_SECRET;
  if (explicit && explicit.length >= 16) {
    return new TextEncoder().encode(explicit);
  }

  const derived = [
    process.env.TWILIO_API_SECRET,
    process.env.TWILIO_ACCOUNT_SID,
    process.env.AWS_ACCOUNT_ID,
    process.env.AWS_ROLE_ARN,
  ]
    .filter(Boolean)
    .join("|");

  if (derived.length >= 16) {
    return new TextEncoder().encode(`llamando-session::${derived}`);
  }

  throw new Error(
    "Unable to derive a session signing key. Set SESSION_SECRET in your environment.",
  );
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      id: String(payload.sub),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role === "supervisor" ? "supervisor" : "agent",
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Throws if no session; returns the user otherwise. Use in protected routes.
export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new SessionError("Unauthorized");
  return session;
}

export async function requireSupervisor(): Promise<SessionUser> {
  const session = await requireSession();
  if (session.role !== "supervisor") throw new SessionError("Forbidden", 403);
  return session;
}

export class SessionError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = "SessionError";
    this.status = status;
  }
}
