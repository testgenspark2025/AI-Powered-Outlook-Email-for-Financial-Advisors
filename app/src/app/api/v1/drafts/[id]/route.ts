import { deleteDraft, getDraft, updateDraft, type UpdateDraftInput } from "@/lib/db/repos/drafts";
import { Problems } from "@/lib/api/problems";

export const runtime = "edge";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const draft = getDraft(id);
  if (!draft) return Problems.notFound(`Draft ${id} not found`);
  return Response.json(draft);
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
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
  const patch: UpdateDraftInput = {};
  if (typeof body.toAddress === "string") patch.toAddress = body.toAddress;
  if (typeof body.subject === "string") patch.subject = body.subject;
  if (typeof body.body === "string") patch.body = body.body;
  if (typeof body.clientId === "string" || body.clientId === null) {
    patch.clientId = body.clientId as string | null;
  }
  const updated = updateDraft(id, patch);
  if (!updated) return Problems.notFound(`Draft ${id} not found or already sent`);
  return Response.json(updated);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ok = deleteDraft(id);
  if (!ok) return Problems.notFound(`Draft ${id} not found or already sent`);
  return new Response(null, { status: 204 });
}
