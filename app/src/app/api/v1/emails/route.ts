import { listEmails, type EmailFolder } from "@/lib/db/repos/emails";
import { Problems } from "@/lib/api/problems";

export const runtime = "edge";

const ALLOWED: EmailFolder[] = ["inbox", "junk", "archive", "deleted"];

export function GET(req: Request) {
  const url = new URL(req.url);
  const folder = (url.searchParams.get("folder") ?? "inbox") as EmailFolder;
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
  return Response.json({ items: listEmails({ folder, segmentId }), nextCursor: null });
}
