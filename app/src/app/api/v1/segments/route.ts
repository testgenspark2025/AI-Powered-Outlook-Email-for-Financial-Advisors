import { listSegments } from "@/lib/db/repos/segments";

export const runtime = "edge";

export function GET() {
  return Response.json({ items: listSegments(), nextCursor: null });
}
