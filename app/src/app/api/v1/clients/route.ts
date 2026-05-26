import { listClients } from "@/lib/db/repos/clients";
import { Problems } from "@/lib/api/problems";

export const runtime = "edge";

export function GET(req: Request) {
  const url = new URL(req.url);
  const segmentParam = url.searchParams.get("segmentId");
  let segmentId: number | undefined;
  if (segmentParam !== null) {
    const n = Number(segmentParam);
    if (!Number.isInteger(n) || n < 1) return Problems.validation("segmentId must be a positive integer");
    segmentId = n;
  }
  return Response.json({ items: listClients({ segmentId }), nextCursor: null });
}
