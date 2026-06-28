import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const customerId = body.customerId ? String(body.customerId) : null;
    const outcome = body.outcome ? String(body.outcome) : null;
    const notes = body.notes ? String(body.notes) : null;
    const duration = Number.isFinite(Number(body.durationSeconds))
      ? Math.max(0, Math.floor(Number(body.durationSeconds)))
      : 0;

    await query(
      `INSERT INTO call_logs (customer_id, agent_name, outcome, notes, duration_seconds)
       VALUES ($1, $2, $3, $4, $5)`,
      [customerId, session.name, outcome, notes, duration],
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[v0] Call log error:", error);
    return NextResponse.json({ error: "Failed to record call" }, { status: 500 });
  }
}
