import type {
  DraftNewInput,
  DraftReplyInput,
  FollowUpInput,
  FollowUpSuggestion,
  LlmCallMeta,
  LlmProvider,
  SummarizeInput,
} from "@/lib/ai/types";

const MOCK_MODEL = "mock-1";

function approxTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

async function* streamWords(text: string, delayMs = 8): AsyncIterable<string> {
  for (const chunk of text.split(/(\s+)/)) {
    if (!chunk) continue;
    yield chunk;
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
  }
}

function pickAssets(input: { household: { householdAssetsLabel?: string | null } }): string {
  return input.household.householdAssetsLabel ?? "your portfolio";
}

function householdNamesFragment(
  input: { household: { members: { fullName: string }[] } },
  max = 2,
): string {
  const names = input.household.members.slice(0, max).map((m) => m.fullName.split(" ")[0]);
  if (names.length === 0) return "your family";
  if (names.length === 1) return names[0]!;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function depthPhrase(d: string): string {
  switch (d) {
    case "light":
      return "a quick acknowledgement";
    case "deep":
      return "a thorough review incorporating recent context";
    default:
      return "a thoughtful, personalised response";
  }
}

export class MockProvider implements LlmProvider {
  readonly id = "mock";

  async *draftReply(input: DraftReplyInput): AsyncIterable<string> {
    const first = input.client.fullName.split(" ")[0] ?? input.client.fullName;
    const text = [
      `Dear ${first},`,
      "",
      `Thank you for your note regarding "${input.inboundSubject}".`,
      `As a ${input.client.segmentName} client, I want to provide ${depthPhrase(input.depth)}.`,
      `Given the household's ${pickAssets(input)} across ${input.household.totalMembers} member${input.household.totalMembers === 1 ? "" : "s"} (${householdNamesFragment(input)}), I have a few thoughts to share.`,
      "",
      `Happy to schedule a call this week to walk through the details.`,
      "",
      `Best regards,`,
      input.advisorDisplayName ?? "Your Advisor",
    ].join("\n");
    yield* streamWords(text);
  }

  async *draftNew(input: DraftNewInput): AsyncIterable<string> {
    const first = input.client.fullName.split(" ")[0] ?? input.client.fullName;
    const hint = input.intentHint ? ` regarding ${input.intentHint}` : "";
    const text = [
      `Dear ${first},`,
      "",
      `I hope this note finds you well${hint}.`,
      `Reviewing your household (${pickAssets(input)}, ${input.household.totalMembers} member${input.household.totalMembers === 1 ? "" : "s"}) I wanted to share ${depthPhrase(input.depth)}.`,
      "",
      `Please let me know a good time for a brief call.`,
      "",
      `Best regards,`,
      input.advisorDisplayName ?? "Your Advisor",
    ].join("\n");
    yield* streamWords(text);
  }

  async summarize(input: SummarizeInput): Promise<{ summary: string; meta: LlmCallMeta }> {
    const start = Date.now();
    const sentences = input.body.split(/(?<=[.!?])\s+/).slice(0, 2);
    const bullets = sentences
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `- ${s.slice(0, 140)}`)
      .join("\n");
    const summary = bullets || `- ${input.subject}`;
    return {
      summary,
      meta: {
        model: MOCK_MODEL,
        tokensIn: approxTokens(input.body) + approxTokens(input.subject),
        tokensOut: approxTokens(summary),
        latencyMs: Date.now() - start,
      },
    };
  }

  async suggestFollowUps(
    input: FollowUpInput,
  ): Promise<{ suggestions: FollowUpSuggestion[]; meta: LlmCallMeta }> {
    const start = Date.now();
    const first = input.client.fullName.split(" ")[0] ?? input.client.fullName;
    const suggestions: FollowUpSuggestion[] = [
      {
        actionType: "schedule_meeting",
        title: `Schedule review with ${first}`,
        rationale: "Confirm next steps within two weeks.",
      },
      {
        actionType: "send_brief",
        title: `Send a ${input.client.segmentName} brief`,
        rationale: "Reinforces relevant context for this segment.",
      },
      {
        actionType: "reminder",
        title: `30-day check-in reminder`,
        rationale: "Maintain proactive cadence.",
      },
    ];
    return {
      suggestions,
      meta: {
        model: MOCK_MODEL,
        tokensIn: approxTokens(input.draftBody),
        tokensOut: approxTokens(JSON.stringify(suggestions)),
        latencyMs: Date.now() - start,
      },
    };
  }
}
