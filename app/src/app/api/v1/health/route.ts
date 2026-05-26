export const runtime = "edge";

export function GET() {
  return Response.json({ status: "ok", version: "0.1.0" });
}
