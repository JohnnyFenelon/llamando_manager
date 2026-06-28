import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { withConnection } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { Customer } from "@/lib/types";

interface CustomerRow {
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

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json().catch(() => ({ text: "" }));
    const lines = String(text || "").split("\n");

    const parsed = lines
      .map((line) => line.split(","))
      .filter((parts) => parts.length >= 2 && parts[0].trim() && parts[1].trim())
      .map((parts) => {
        const name = parts[0].trim();
        const phone = parts[1].trim();
        const email = parts[2]
          ? parts[2].trim()
          : `${name.toLowerCase().replace(/\s+/g, "")}@lead.com`;
        return { name, phone, email };
      });

    if (parsed.length === 0) {
      return NextResponse.json(
        { error: "Invalid format. Use: Name, Phone, Email (one per line)." },
        { status: 400 },
      );
    }

    const inserted = await withConnection(async (client) => {
      const rows: CustomerRow[] = [];
      await client.query("BEGIN");
      try {
        for (const lead of parsed) {
          const res = await client.query<CustomerRow>(
            `INSERT INTO customers (id, name, phone, email, status, assigned_agent, interest, notes)
             VALUES ($1, $2, $3, $4, 'new', 'Unassigned', 'Medium', 'Imported via CSV workforce tool.')
             RETURNING id, name, phone, email, status, assigned_agent, interest, notes`,
            ["import_" + nanoid(12), lead.name, lead.phone, lead.email],
          );
          rows.push(res.rows[0]);
        }
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      }
      return rows;
    });

    return NextResponse.json({
      count: inserted.length,
      customers: inserted.map(toCustomer),
    });
  } catch (error) {
    console.error("[v0] Import leads error:", error);
    return NextResponse.json({ error: "Failed to import leads" }, { status: 500 });
  }
}
