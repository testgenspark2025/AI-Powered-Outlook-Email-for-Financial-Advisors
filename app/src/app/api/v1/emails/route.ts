import { listEmails, type EmailFolder } from "@/lib/db/repos/emails";
import { getDraft, listSent, sendDraft } from "@/lib/db/repos/drafts";
import { Problems } from "@/lib/api/problems";

export const runtime = "edge";

const ALLOWED = ["inbox", "junk", "archive", "deleted", "sent"] as const;
type ListFolder = (typeof ALLOWED)[number];

export function GET(req: Request) {
  const url = new URL(req.url);
  const folder = (url.searchParams.get("folder") ?? "inbox") as ListFolder;
  if (!ALLOWED.includes(folder)) {
    return Problems.validation(`folder must be one of ${ALLOWED.join(", ")}`);
  }
  const segmentParam = url.searchParams.get("segmentId");
  let segmentId: number | undefined;
  if (segmentParam !== null) {
    const n = Number(segmentParam);
    if (!Number.isInteger(n) || n < 1) return Problems.validation("segmentId must be a positive integer");
    segmentId = n;
  }

  if (folder === "sent") {
    const items = listSent().filter((d) =>
      segmentId ? d.client?.segmentId === segmentId : true,
    );
    return Response.json({ items, nextCursor: null });
  }

  return Response.json({
    items: listEmails({ folder: folder as EmailFolder, segmentId }),
    nextCursor: null,
  });
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
  const { draftId } = raw as { draftId?: unknown };
  if (typeof draftId !== "string" || draftId.length === 0) {
    return Problems.validation("draftId is required");
  }
  const existing = getDraft(draftId);
  if (!existing || existing.status !== "draft") {
    return Problems.notFound(`Draft ${draftId} not found or already sent`);
  }
  if (!existing.toAddress.trim() || !existing.subject.trim() || !existing.body.trim()) {
    return Problems.validation("Cannot send: toAddress, subject, and body are required");
  }
  const sent = sendDraft(draftId);
  if (!sent) return Problems.notFound(`Draft ${draftId} not found or already sent`);
  return Response.json(sent, { status: 201 });
}
