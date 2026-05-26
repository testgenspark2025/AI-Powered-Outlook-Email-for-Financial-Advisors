import { getEmail } from "@/lib/db/repos/emails";
import { Problems } from "@/lib/api/problems";

export const runtime = "edge";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const email = getEmail(id);
  if (!email) return Problems.notFound(`Email ${id} not found`);
  return Response.json(email);
}
