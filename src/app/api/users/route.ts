import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { query } from "@/lib/db";
import { requireSupervisor, SessionError } from "@/lib/session";
import type { AppUser } from "@/lib/types";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "agent" | "supervisor";
  status: "Active" | "Inactive";
}

function toUser(row: UserRow): AppUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
  };
}

export async function GET() {
  try {
    await requireSupervisor();
    const result = await query<UserRow>(
      `SELECT id, name, email, role, status FROM app_users ORDER BY created_at ASC`,
    );
    return NextResponse.json({ users: result.rows.map(toUser) });
  } catch (error) {
    if (error instanceof SessionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[v0] List users error:", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireSupervisor();

    const body = await req.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const password = String(body.password || "");
    const role = body.role === "supervisor" ? "supervisor" : "agent";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 },
      );
    }
    if (password.length < 4) {
      return NextResponse.json(
        { error: "Password must be at least 4 characters." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
      const result = await query<UserRow>(
        `INSERT INTO app_users (id, name, email, password_hash, role, status)
         VALUES ($1, $2, $3, $4, $5, 'Active')
         RETURNING id, name, email, role, status`,
        ["u_" + nanoid(10), name, email, passwordHash, role],
      );
      return NextResponse.json({ user: toUser(result.rows[0]) }, { status: 201 });
    } catch (e: unknown) {
      // Unique violation on email
      if (typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "23505") {
        return NextResponse.json(
          { error: "A user with that email already exists." },
          { status: 409 },
        );
      }
      throw e;
    }
  } catch (error) {
    if (error instanceof SessionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[v0] Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
