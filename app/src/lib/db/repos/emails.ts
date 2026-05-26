import { EMAIL_SEEDS, type EmailSeed } from "@/lib/db/seed/emails.seed";
import { getClient, getClientWithHousehold, type Client, type ClientWithHousehold } from "@/lib/db/repos/clients";

export type EmailFolder = EmailSeed["folder"];

export type Email = EmailSeed & { client: Client | null };

export type EmailDetail = EmailSeed & { client: ClientWithHousehold | null };

function attachClient(e: EmailSeed): Email {
  return { ...e, client: getClient(e.clientId) };
}

export function listEmails(opts: { folder: EmailFolder; segmentId?: number } = { folder: "inbox" }): Email[] {
  return EMAIL_SEEDS.filter((e) => e.folder === opts.folder)
    .map(attachClient)
    .filter((e) => (opts.segmentId ? e.client?.segmentId === opts.segmentId : true))
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
}

export function getEmail(id: string): EmailDetail | null {
  const e = EMAIL_SEEDS.find((x) => x.id === id);
  if (!e) return null;
  return { ...e, client: getClientWithHousehold(e.clientId) };
}
