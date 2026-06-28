import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/session";
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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    // Optionally prepend a timestamped note rather than overwrite.
    const prependNote: string | undefined = body.prependNote
      ? String(body.prependNote)
      : undefined;

    const result = await query<CustomerRow>(
      `UPDATE customers
          SET status         = COALESCE($2, status),
              assigned_agent = COALESCE($3, assigned_agent),
              interest       = COALESCE($4, interest),
              notes          = CASE
                                 WHEN $5::text IS NOT NULL
                                 THEN $5 || ' (' || to_char(now(), 'MM/DD/YYYY') || ') | ' || notes
                                 ELSE COALESCE($6, notes)
                               END,
              updated_at     = now()
        WHERE id = $1
        RETURNING id, name, phone, email, status, assigned_agent, interest, notes`,
      [
        id,
        body.status ?? null,
        body.assignedAgent ?? null,
        body.interest ?? null,
        prependNote ?? null,
        body.notes ?? null,
      ],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ customer: toCustomer(result.rows[0]) });
  } catch (error) {
    console.error("[v0] Update customer error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await query<{ id: string }>(
      `DELETE FROM customers WHERE id = $1 RETURNING id`,
      [id],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ deleted: result.rows[0].id });
  } catch (error) {
    console.error("[v0] Delete customer error:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
