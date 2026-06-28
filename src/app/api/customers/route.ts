import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { query } from "@/lib/db";
import { getSession, SessionError } from "@/lib/session";
import type { Customer } from "@/lib/types";

type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: Customer["status"];
  assigned_agent: string;
  interest: string;
  notes: string;
}

function toCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email ?? "N/A",
    status: row.status,
    assignedAgent: row.assigned_agent,
    interest: row.interest,
    notes: row.notes,
  };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await query<CustomerRow>(
      `SELECT id, name, phone, email, status, assigned_agent, interest, notes
         FROM customers
        ORDER BY created_at DESC`,
    );

    return NextResponse.json({ customers: result.rows.map(toCustomer) });
  } catch (error) {
    if (error instanceof SessionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[v0] List customers error:", error);
    return NextResponse.json({ error: "Failed to load customers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required." },
        { status: 400 },
      );
    }

    const id = "c_" + nanoid(10);
    const result = await query<CustomerRow>(
      `INSERT INTO customers (id, name, phone, email, status, assigned_agent, interest, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, phone, email, status, assigned_agent, interest, notes`,
      [
        id,
        name,
        phone,
        body.email ? String(body.email).trim() : null,
        body.status || "new",
        body.assignedAgent || "Unassigned",
        body.interest || "Medium",
        body.notes ? String(body.notes) : "No notes added yet.",
      ],
    );

    return NextResponse.json({ customer: toCustomer(result.rows[0]) }, { status: 201 });
  } catch (error) {
    console.error("[v0] Create customer error:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
