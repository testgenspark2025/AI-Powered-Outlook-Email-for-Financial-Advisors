import { getClientWithHousehold } from "@/lib/db/repos/clients";
import { Problems } from "@/lib/api/problems";

export const runtime = "edge";

export function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return Promise.resolve(ctx.params).then(({ id }) => {
    const client = getClientWithHousehold(id);
    if (!client) return Problems.notFound(`Client ${id} not found`);
    return Response.json(client);
  });
}
