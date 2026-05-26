import { MockProvider } from "@/lib/ai/providers/mock";
import { AzureProvider } from "@/lib/ai/providers/azure";
import type {
  DraftNewInput,
  DraftReplyInput,
  FollowUpInput,
  LlmProvider,
  SummarizeInput,
} from "@/lib/ai/types";

let cached: LlmProvider | null = null;

export function resolveProvider(): LlmProvider {
  if (cached) return cached;
  const selected = (process.env.LLM_PROVIDER ?? "mock").toLowerCase();
  cached = selected === "azure" ? new AzureProvider() : new MockProvider();
  return cached;
}

export function __resetProviderForTests(): void {
  cached = null;
}

export function draftReply(input: DraftReplyInput): AsyncIterable<string> {
  return resolveProvider().draftReply(input);
}

export function draftNew(input: DraftNewInput): AsyncIterable<string> {
  return resolveProvider().draftNew(input);
}

export function summarizeEmail(input: SummarizeInput) {
  return resolveProvider().summarize(input);
}

export function suggestFollowUps(input: FollowUpInput) {
  return resolveProvider().suggestFollowUps(input);
}
