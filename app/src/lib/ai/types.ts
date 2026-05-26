export type Depth = "light" | "medium" | "deep";

export type ClientContext = {
  fullName: string;
  email: string;
  occupation?: string | null;
  segmentName: string;
  segmentTone: string;
  riskProfile?: string | null;
  clientSince?: string | null;
};

export type HouseholdContext = {
  totalMembers: number;
  householdAssetsLabel?: string | null;
  members: {
    fullName: string;
    relation: string | null;
    assetsLabel?: string | null;
  }[];
};

export type DraftReplyInput = {
  client: ClientContext;
  household: HouseholdContext;
  inboundSubject: string;
  inboundBody: string;
  advisorDisplayName?: string;
  depth: Depth;
};

export type DraftNewInput = {
  client: ClientContext;
  household: HouseholdContext;
  intentHint?: string;
  advisorDisplayName?: string;
  depth: Depth;
};

export type SummarizeInput = {
  subject: string;
  body: string;
};

export type FollowUpSuggestion = {
  actionType: "schedule_meeting" | "send_brief" | "reminder";
  title: string;
  rationale: string;
};

export type FollowUpInput = {
  client: ClientContext;
  draftBody: string;
};

export type LlmCallMeta = {
  model: string;
  depth?: Depth;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
};

export interface LlmProvider {
  readonly id: "mock" | "azure";
  draftReply(input: DraftReplyInput): AsyncIterable<string>;
  draftNew(input: DraftNewInput): AsyncIterable<string>;
  summarize(input: SummarizeInput): Promise<{ summary: string; meta: LlmCallMeta }>;
  suggestFollowUps(input: FollowUpInput): Promise<{
    suggestions: FollowUpSuggestion[];
    meta: LlmCallMeta;
  }>;
}
