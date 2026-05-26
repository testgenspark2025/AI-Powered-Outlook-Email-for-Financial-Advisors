import { getClient, type Client } from "@/lib/db/repos/clients";

export type DraftStatus = "draft" | "sent";

export type DraftRecord = {
  id: string;
  clientId: string | null;
  inReplyToEmailId: string | null;
  toAddress: string;
  subject: string;
  body: string;
  status: DraftStatus;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
};

export type Draft = DraftRecord & { client: Client | null };

type GlobalStore = {
  drafts: Map<string, DraftRecord>;
  counter: number;
};

const STORE_KEY = "__faDraftStore__";

function getStore(): GlobalStore {
  const g = globalThis as unknown as Record<string, GlobalStore | undefined>;
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = { drafts: new Map(), counter: 0 };
  }
  return g[STORE_KEY]!;
}

function newId(store: GlobalStore): string {
  store.counter += 1;
  return `df_${Date.now().toString(36)}_${store.counter}`;
}

function attach(record: DraftRecord): Draft {
  return { ...record, client: record.clientId ? getClient(record.clientId) : null };
}

export type CreateDraftInput = {
  clientId?: string | null;
  inReplyToEmailId?: string | null;
  toAddress?: string;
  subject?: string;
  body?: string;
};

export function createDraft(input: CreateDraftInput): Draft {
  const store = getStore();
  const now = new Date().toISOString();
  const record: DraftRecord = {
    id: newId(store),
    clientId: input.clientId ?? null,
    inReplyToEmailId: input.inReplyToEmailId ?? null,
    toAddress: input.toAddress ?? "",
    subject: input.subject ?? "",
    body: input.body ?? "",
    status: "draft",
    createdAt: now,
    updatedAt: now,
    sentAt: null,
  };
  store.drafts.set(record.id, record);
  return attach(record);
}

export type UpdateDraftInput = Partial<{
  toAddress: string;
  subject: string;
  body: string;
  clientId: string | null;
}>;

export function updateDraft(id: string, patch: UpdateDraftInput): Draft | null {
  const store = getStore();
  const existing = store.drafts.get(id);
  if (!existing || existing.status !== "draft") return null;
  const next: DraftRecord = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  store.drafts.set(id, next);
  return attach(next);
}

export function getDraft(id: string): Draft | null {
  const record = getStore().drafts.get(id);
  return record ? attach(record) : null;
}

export function listDrafts(): Draft[] {
  return Array.from(getStore().drafts.values())
    .filter((r) => r.status === "draft")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(attach);
}

export function listSent(): Draft[] {
  return Array.from(getStore().drafts.values())
    .filter((r) => r.status === "sent")
    .sort((a, b) => (b.sentAt ?? b.updatedAt).localeCompare(a.sentAt ?? a.updatedAt))
    .map(attach);
}

export function deleteDraft(id: string): boolean {
  const store = getStore();
  const existing = store.drafts.get(id);
  if (!existing || existing.status !== "draft") return false;
  return store.drafts.delete(id);
}

export function sendDraft(id: string): Draft | null {
  const store = getStore();
  const existing = store.drafts.get(id);
  if (!existing || existing.status !== "draft") return null;
  const now = new Date().toISOString();
  const next: DraftRecord = { ...existing, status: "sent", sentAt: now, updatedAt: now };
  store.drafts.set(id, next);
  return attach(next);
}

export function _resetDraftStoreForTests(): void {
  const g = globalThis as unknown as Record<string, GlobalStore | undefined>;
  g[STORE_KEY] = { drafts: new Map(), counter: 0 };
}
