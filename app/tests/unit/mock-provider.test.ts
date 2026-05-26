import { describe, expect, it } from "vitest";
import { MockProvider } from "@/lib/ai/providers/mock";
import type { DraftReplyInput, FollowUpInput, SummarizeInput } from "@/lib/ai/types";

function buildReplyInput(overrides: Partial<DraftReplyInput> = {}): DraftReplyInput {
  return {
    client: {
      fullName: "Robert Sterling",
      email: "rs@example.com",
      occupation: "CEO",
      segmentName: "Ultra High Net Worth",
      segmentTone: "sophisticated",
      riskProfile: "Conservative",
      clientSince: "2018",
    },
    household: {
      totalMembers: 4,
      householdAssetsLabel: "$72.3M",
      members: [
        { fullName: "Robert Sterling", relation: "Self", assetsLabel: "$67.5M" },
        { fullName: "Sarah Sterling", relation: "Wife", assetsLabel: "$4.2M" },
      ],
    },
    inboundSubject: "Q4 Review",
    inboundBody: "Please schedule a review.",
    advisorDisplayName: "Alex Rivera",
    depth: "medium",
    ...overrides,
  };
}

describe("MockProvider.draftReply", () => {
  it("streams text mentioning the client's first name and segment", async () => {
    const provider = new MockProvider();
    let text = "";
    for await (const token of provider.draftReply(buildReplyInput())) text += token;
    expect(text).toContain("Robert");
    expect(text).toContain("Ultra High Net Worth");
    expect(text).toContain("Alex Rivera");
  });

  it("varies output by depth", async () => {
    const provider = new MockProvider();
    const lightInput = buildReplyInput({ depth: "light" });
    const deepInput = buildReplyInput({ depth: "deep" });
    let light = "";
    let deep = "";
    for await (const t of provider.draftReply(lightInput)) light += t;
    for await (const t of provider.draftReply(deepInput)) deep += t;
    expect(light).toContain("quick acknowledgement");
    expect(deep).toContain("thorough review");
  });
});

describe("MockProvider.summarize", () => {
  it("produces bullet output", async () => {
    const provider = new MockProvider();
    const input: SummarizeInput = {
      subject: "Long message",
      body: "First sentence. Second sentence. Third sentence.",
    };
    const result = await provider.summarize(input);
    expect(result.summary.startsWith("- ")).toBe(true);
    expect(result.meta.model).toBe("mock-1");
  });
});

describe("MockProvider.suggestFollowUps", () => {
  it("returns 3 suggestions from the fixed catalog", async () => {
    const provider = new MockProvider();
    const input: FollowUpInput = {
      client: {
        fullName: "Jennifer Chen",
        email: "jc@example.com",
        segmentName: "Young Professionals",
        segmentTone: "motivational",
      },
      draftBody: "Hi Jen...",
    };
    const { suggestions } = await provider.suggestFollowUps(input);
    expect(suggestions).toHaveLength(3);
    const types = suggestions.map((s) => s.actionType).sort();
    expect(types).toEqual(["reminder", "schedule_meeting", "send_brief"]);
  });
});
