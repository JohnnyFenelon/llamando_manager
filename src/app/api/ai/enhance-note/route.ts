import { NextResponse } from "next/server";
import { generateText } from "ai";
import { withBedrock } from "@/lib/ai";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, kind } = await req.json().catch(() => ({}));
    const raw = String(text || "").trim();
    if (!raw) {
      return NextResponse.json({ error: "Note text is required." }, { status: 400 });
    }

    const context =
      kind === "profile"
        ? "a concise CRM customer-profile note"
        : "a concise, professional outbound call summary";

    const { text: enhanced } = await withBedrock((model) =>
      generateText({
        model,
        system:
          "You are a CRM assistant for an outbound sales call center. Rewrite the agent's rough notes into " +
          context +
          ". Keep it under 2 sentences, professional, action-oriented, in the same language as the input. Return only the rewritten note with no preamble or quotes.",
        prompt: raw,
        maxOutputTokens: 200,
        maxRetries: 1,
      }),
    );

    return NextResponse.json({ enhanced: enhanced.trim() });
  } catch (error) {
    console.error("[v0] Enhance note error:", error);
    return NextResponse.json(
      { error: "AI enhancement failed. Please try again." },
      { status: 500 },
    );
  }
}
