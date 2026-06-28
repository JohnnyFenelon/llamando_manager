import { NextResponse } from "next/server";
import { generateText, type ModelMessage } from "ai";
import { withBedrock } from "@/lib/ai";
import { getSession } from "@/lib/session";

export const maxDuration = 30;

interface ChatTurn {
  // The client may send either {role, content} (AI SDK style) or {sender, text}.
  role?: "user" | "assistant";
  content?: string;
  sender?: "ai" | "user";
  text?: string;
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const turns: ChatTurn[] = Array.isArray(body.messages) ? body.messages : [];
    const pursueTarget = Number(body.pursueTarget) || 150;

    if (turns.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const messages: ModelMessage[] = turns
      .map((m) => {
        const content = (m.content ?? m.text ?? "").trim();
        const role =
          m.role === "assistant" || m.sender === "ai" ? "assistant" : "user";
        return { role, content } as ModelMessage;
      })
      .filter((m) => m.content);

    if (messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const { text } = await withBedrock((model) =>
      generateText({
        model,
        system:
          `You are an AI Sales Coach for an outbound BPO call center, powered by Amazon Bedrock. ` +
          `The agent's monthly target is ${pursueTarget} closed sales. ` +
          `Help draft cold-calling scripts, objection-handling tactics, and conversion strategies. ` +
          `Be practical and concise. Use markdown for structure. Reply in the language the agent uses.`,
        messages,
        maxOutputTokens: 1500,
        maxRetries: 1,
        providerOptions: {
          // On the Gemini fallback, disable "thinking" so the token budget is
          // always spent on the actual answer (prevents empty-output 500s).
          google: { thinkingConfig: { thinkingBudget: 0 } },
        },
      }),
    );

    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error("[v0] AI chat error:", error);
    return NextResponse.json(
      { error: "The AI coach is unavailable right now. Please try again." },
      { status: 500 },
    );
  }
}
