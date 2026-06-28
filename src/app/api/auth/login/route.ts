import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { createSession } from "@/lib/session";

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: "agent" | "supervisor";
  status: string;
}

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json().catch(() => ({}));

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/email and password are required." },
        { status: 400 },
      );
    }

    // Match by email (case-insensitive) or exact name.
    const result = await query<UserRow>(
      `SELECT id, name, email, password_hash, role, status
         FROM app_users
        WHERE lower(email) = lower($1) OR lower(name) = lower($1)
        LIMIT 1`,
      [identifier],
    );

    const user = result.rows[0];

    // Constant-ish time: still run a compare to reduce user-enumeration signal.
    const hash = user?.password_hash || "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinv";
    const valid = await bcrypt.compare(password, hash);

    if (!user || !valid || user.status !== "Active") {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("[v0] Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 },
    );
  }
}
