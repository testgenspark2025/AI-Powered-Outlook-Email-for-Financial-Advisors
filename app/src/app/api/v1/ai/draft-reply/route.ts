import { z } from "zod";
import { draftReply } from "@/lib/ai/gateway";
import { Problems } from "@/lib/api/problems";

export const runtime = "edge";

const Body = z.object({
  emailId: z.string().min(1),
  depth: z.enum(["light", "medium", "deep"]),
});

import type { DraftReplyInput } from "@/lib/ai/types";

const DEMO_REQUEST: Omit<DraftReplyInput, "depth"> = {
  client: {
    fullName: "Robert Sterling",
    email: "rsterling@sterlingfamily.com",
    occupation: "CEO & Founder",
    segmentName: "Ultra High Net Worth",
    segmentTone: "sophisticated",
    riskProfile: "Conservative",
    clientSince: "March 2018",
  },
  household: {
    totalMembers: 4,
    householdAssetsLabel: "$72.3M",
    members: [
      { fullName: "Robert Sterling", relation: "Self", assetsLabel: "$67.5M" },
      { fullName: "Sarah Sterling", relation: "Wife", assetsLabel: "$4.2M" },
    ],
  },
  inboundSubject: "Q4 Family Office Review & Tax Strategy Discussion",
  inboundBody: "I'd like to schedule our quarterly review...",
};

export async function POST(req: Request): Promise<Response> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Problems.validation("Body must be JSON");
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return Problems.validation(parsed.error.issues[0]?.message ?? "Invalid body");

  const iter = draftReply({ ...DEMO_REQUEST, depth: parsed.data.depth });
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const token of iter) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "token", value: token })}\n\n`),
          );
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done", meta: { operation: "draft_reply", depth: parsed.data.depth } })}\n\n`),
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "stream error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
