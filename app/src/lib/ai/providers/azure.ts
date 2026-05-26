import type {
  DraftNewInput,
  DraftReplyInput,
  FollowUpInput,
  FollowUpSuggestion,
  LlmCallMeta,
  LlmProvider,
  SummarizeInput,
} from "@/lib/ai/types";

export class AzureProvider implements LlmProvider {
  readonly id = "azure";

  async *draftReply(_input: DraftReplyInput): AsyncIterable<string> {
    throw new Error("Azure provider is not implemented in Sprint 0; set LLM_PROVIDER=mock");
    yield "";
  }

  async *draftNew(_input: DraftNewInput): AsyncIterable<string> {
    throw new Error("Azure provider is not implemented in Sprint 0; set LLM_PROVIDER=mock");
    yield "";
  }

  async summarize(_input: SummarizeInput): Promise<{ summary: string; meta: LlmCallMeta }> {
    throw new Error("Azure provider is not implemented in Sprint 0; set LLM_PROVIDER=mock");
  }

  async suggestFollowUps(
    _input: FollowUpInput,
  ): Promise<{ suggestions: FollowUpSuggestion[]; meta: LlmCallMeta }> {
    throw new Error("Azure provider is not implemented in Sprint 0; set LLM_PROVIDER=mock");
  }
}
