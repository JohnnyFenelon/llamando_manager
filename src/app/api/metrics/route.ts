import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [callsToday, closedToday, avgDuration, totalClosedWon, pipeline] =
      await Promise.all([
        query<{ count: string }>(
          `SELECT COUNT(*)::text AS count FROM call_logs WHERE created_at >= date_trunc('day', now())`,
        ),
        query<{ count: string }>(
          `SELECT COUNT(*)::text AS count FROM call_logs
            WHERE outcome = 'closed_won' AND created_at >= date_trunc('day', now())`,
        ),
        query<{ avg: string | null }>(
          `SELECT COALESCE(ROUND(AVG(duration_seconds)), 0)::text AS avg FROM call_logs
            WHERE created_at >= date_trunc('day', now()) AND duration_seconds > 0`,
        ),
        query<{ count: string }>(
          `SELECT COUNT(*)::text AS count FROM customers WHERE status = 'closed_won'`,
        ),
        query<{ status: string; count: string }>(
          `SELECT status, COUNT(*)::text AS count FROM customers GROUP BY status`,
        ),
      ]);

    return NextResponse.json({
      callsToday: Number(callsToday.rows[0]?.count ?? 0),
      closedLeadsToday: Number(closedToday.rows[0]?.count ?? 0),
      avgDurationSeconds: Number(avgDuration.rows[0]?.avg ?? 0),
      totalClosedWon: Number(totalClosedWon.rows[0]?.count ?? 0),
      pipeline: pipeline.rows.reduce<Record<string, number>>((acc, r) => {
        acc[r.status] = Number(r.count);
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("[v0] Metrics error:", error);
    return NextResponse.json({ error: "Failed to load metrics" }, { status: 500 });
  }
}
