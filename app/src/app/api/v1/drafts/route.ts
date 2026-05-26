import { createDraft, listDrafts, type CreateDraftInput } from "@/lib/db/repos/drafts";
import { Problems } from "@/lib/api/problems";

export const runtime = "edge";

export function GET() {
  return Response.json({ items: listDrafts(), nextCursor: null });
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return Problems.validation("Body must be JSON");
  }
  if (raw === null || typeof raw !== "object") {
    return Problems.validation("Body must be a JSON object");
  }
  const body = raw as Record<string, unknown>;
  const input: CreateDraftInput = {
    clientId: typeof body.clientId === "string" ? body.clientId : null,
    inReplyToEmailId: typeof body.inReplyToEmailId === "string" ? body.inReplyToEmailId : null,
    toAddress: typeof body.toAddress === "string" ? body.toAddress : "",
    subject: typeof body.subject === "string" ? body.subject : "",
    body: typeof body.body === "string" ? body.body : "",
  };
  const draft = createDraft(input);
  return Response.json(draft, { status: 201 });
}
