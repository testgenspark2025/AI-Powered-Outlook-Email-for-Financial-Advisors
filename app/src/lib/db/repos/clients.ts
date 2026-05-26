import { CLIENT_SEEDS, HOUSEHOLD_SEEDS, type ClientSeed, type HouseholdSeed } from "@/lib/db/seed/clients.seed";
import { getSegment, type Segment } from "@/lib/db/repos/segments";

export type Client = ClientSeed & { segment: Segment };

export type ClientWithHousehold = Client & { household: HouseholdSeed };

function withSegment(c: ClientSeed): Client {
  const segment = getSegment(c.segmentId);
  if (!segment) throw new Error(`Missing segment id=${c.segmentId} for client ${c.id}`);
  return { ...c, segment };
}

export function listClients(opts: { segmentId?: number } = {}): Client[] {
  return CLIENT_SEEDS.filter((c) => (opts.segmentId ? c.segmentId === opts.segmentId : true)).map(
    withSegment,
  );
}

export function getClient(id: string): Client | null {
  const c = CLIENT_SEEDS.find((x) => x.id === id);
  return c ? withSegment(c) : null;
}

export function getClientWithHousehold(id: string): ClientWithHousehold | null {
  const client = getClient(id);
  if (!client) return null;
  const household = HOUSEHOLD_SEEDS.find((h) => h.id === client.householdId);
  if (!household) throw new Error(`Missing household for client ${id}`);
  return { ...client, household };
}
