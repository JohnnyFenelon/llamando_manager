import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";
import { BEDROCK_MODEL } from "@/lib/ai";
import { getSession } from "@/lib/session";

export const maxDuration = 60;

const PlanSchema = z.object({
  schedules: z
    .array(
      z.object({
        day: z.string(),
        morning: z.string(),
        afternoon: z.string(),
        night: z.string(),
        weekend: z.string(),
      }),
    )
    .describe("Seven rows, one per day Mon-Sun, listing agent first names per shift, or '-' if none."),
  forecast: z
    .array(
      z.object({
        week: z.string(),
        calls: z.number(),
        projectedSales: z.number(),
        requiredHours: z.number(),
        efficiency: z.string(),
      }),
    )
    .describe("Four rows, Week 1-4."),
  suggestions: z
    .string()
    .describe("A markdown bullet list of 4-5 concrete optimization recommendations."),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "supervisor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      weeklyUsersTarget = 12000,
      agentsMorning = 12,
      agentsAfternoon = 15,
      agentsNight = 8,
      agentsWeekend = 6,
      agentsTotalMonth = 25,
      pursueTarget = 150,
      leadsPurchased = 1800,
      agents = ["Yuki", "Chen", "Aarav", "Sarah", "John", "Marcus"],
    } = body;

    const { output } = await generateText({
      model: BEDROCK_MODEL,
      system:
        "You are a workforce optimization engine for an outbound sales call center, running on Amazon Bedrock. " +
        "Given operational parameters, produce a realistic weekly agent shift schedule, a 4-week sales forecast, " +
        "and concrete optimization recommendations. Distribute the named agents across shifts sensibly. " +
        "Afternoon answer rates are highest (14:00-17:30). Be quantitative in the suggestions.",
      prompt: `Operational parameters:
- Weekly user/traffic target: ${weeklyUsersTarget}
- Agents per shift: morning ${agentsMorning}, afternoon ${agentsAfternoon}, night ${agentsNight}, weekend ${agentsWeekend}
- Total agents in rotation: ${agentsTotalMonth}
- Monthly sales target (closed_won): ${pursueTarget}
- Leads purchased this month: ${leadsPurchased}
- Available agent names: ${agents.join(", ")}

Required conversion rate is roughly ${((pursueTarget / leadsPurchased) * 100).toFixed(1)}%.
Generate the schedule (Mon-Sun), the 4-week forecast, and the recommendations.`,
      output: Output.object({ schema: PlanSchema }),
      maxOutputTokens: 2000,
    });

    // Map to the shape the client expects.
    return NextResponse.json({
      schedule: output.schedules,
      forecast: output.forecast,
      strategy: output.suggestions,
    });
  } catch (error) {
    console.error("[v0] Planner error:", error);
    return NextResponse.json(
      { error: "Bedrock planning run failed. Please try again." },
      { status: 500 },
    );
  }
}
