import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { google } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

// Gemini fallback model, used when every Bedrock key is exhausted.
const GEMINI_MODEL_ID = "gemini-2.5-flash";

// Amazon Bedrock model. Nova Pro is Amazon's flagship multimodal model.
// In us-* regions Bedrock requires the cross-region inference profile id.
export const BEDROCK_MODEL_ID = (process.env.AWS_REGION || "us-east-1").startsWith("us")
  ? "us.amazon.nova-pro-v1:0"
  : "amazon.nova-pro-v1:0";

// Collect every Bedrock API key (bearer token) available in the environment.
// Multiple keys let us rotate when one hits its per-day token quota.
function getBedrockApiKeys(): string[] {
  return [
    process.env.AWS_BEARER_TOKEN_BEDROCK,
    process.env.AWS_BEARER_TOKEN_BEDROCK_2,
    process.env.AWS_BEARER_TOKEN_BEDROCK_3,
  ].filter((k): k is string => Boolean(k && k.trim()));
}

// Build a Bedrock language model bound to a specific API key.
function bedrockModelForKey(apiKey: string): LanguageModel {
  const provider = createAmazonBedrock({
    apiKey,
    region: process.env.AWS_REGION || "us-east-1",
  });
  return provider(BEDROCK_MODEL_ID);
}

// Detect quota / rate-limit errors so we know when to rotate to the next key.
function isQuotaError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("too many tokens") ||
    msg.includes("too many requests") ||
    msg.includes("throttl") ||
    msg.includes("rate limit") ||
    msg.includes("quota") ||
    msg.includes("429")
  );
}

/**
 * Runs an AI SDK call (generateText/streamText) against Amazon Bedrock, rotating
 * through every available API key when one is exhausted by its daily quota.
 * If all Bedrock keys are exhausted (or none are configured), it falls back to
 * Google Gemini when GOOGLE_GENERATIVE_AI_API_KEY is set.
 */
export async function withBedrock<T>(
  fn: (model: LanguageModel) => Promise<T>,
): Promise<T> {
  const keys = getBedrockApiKeys();
  const hasGeminiFallback = Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  let lastError: unknown;

  for (const key of keys) {
    try {
      return await fn(bedrockModelForKey(key));
    } catch (err) {
      lastError = err;
      // Rotate to the next key only on quota/rate errors. For any other Bedrock
      // failure, stop rotating — but still allow the Gemini fallback below.
      if (!isQuotaError(err)) {
        if (!hasGeminiFallback) throw err;
        break;
      }
      console.log("[v0] Bedrock key exhausted, rotating to next provider/key...");
    }
  }

  // Fall back to Gemini when Bedrock is unavailable, throttled, or errored.
  if (hasGeminiFallback) {
    console.log("[v0] Falling back to Google Gemini for AI request.");
    return await fn(google(GEMINI_MODEL_ID));
  }

  if (!lastError) {
    throw new Error(
      "No AI provider configured. Set AWS_BEARER_TOKEN_BEDROCK or GOOGLE_GENERATIVE_AI_API_KEY.",
    );
  }
  throw lastError;
}
