import { beforeEach, describe, expect, it } from "vitest";
import {
  _resetDraftStoreForTests,
  createDraft,
  deleteDraft,
  getDraft,
  listDrafts,
  listSent,
  sendDraft,
  updateDraft,
} from "@/lib/db/repos/drafts";

describe("drafts repo", () => {
  beforeEach(() => {
    _resetDraftStoreForTests();
  });

  it("creates an empty draft", () => {
    const d = createDraft({});
    expect(d.id).toMatch(/^df_/);
    expect(d.status).toBe("draft");
    expect(d.toAddress).toBe("");
    expect(d.subject).toBe("");
    expect(d.body).toBe("");
    expect(d.createdAt).toBe(d.updatedAt);
  });

  it("creates a draft pre-filled from a reply", () => {
    const d = createDraft({
      clientId: "cl_sterling",
      inReplyToEmailId: "em_sterling_q4",
      toAddress: "rsterling@sterlingfamily.com",
      subject: "RE: Q4",
      body: "Hi Robert,",
    });
    expect(d.clientId).toBe("cl_sterling");
    expect(d.client?.fullName).toBe("Robert Sterling");
    expect(d.subject).toBe("RE: Q4");
  });

  it("updates a draft and bumps updatedAt", async () => {
    const d = createDraft({});
    const original = d.updatedAt;
    await new Promise((r) => setTimeout(r, 5));
    const u = updateDraft(d.id, { subject: "Hello" });
    expect(u?.subject).toBe("Hello");
    expect(u?.updatedAt).not.toBe(original);
  });

  it("returns null when updating an unknown draft", () => {
    expect(updateDraft("df_missing", { subject: "x" })).toBeNull();
  });

  it("lists drafts newest-updated first", async () => {
    const a = createDraft({ subject: "A" });
    await new Promise((r) => setTimeout(r, 2));
    const b = createDraft({ subject: "B" });
    await new Promise((r) => setTimeout(r, 2));
    updateDraft(a.id, { body: "edited" });
    const all = listDrafts();
    expect(all.map((d) => d.id)).toEqual([a.id, b.id]);
  });

  it("deletes a draft", () => {
    const d = createDraft({});
    expect(deleteDraft(d.id)).toBe(true);
    expect(getDraft(d.id)).toBeNull();
    expect(deleteDraft(d.id)).toBe(false);
  });

  it("moves a sent draft to listSent and excludes it from listDrafts", () => {
    const d = createDraft({ toAddress: "a@b.com", subject: "Hi", body: "Body" });
    const sent = sendDraft(d.id);
    expect(sent?.status).toBe("sent");
    expect(sent?.sentAt).toBeTruthy();
    expect(listDrafts()).toHaveLength(0);
    expect(listSent().map((s) => s.id)).toEqual([d.id]);
  });

  it("cannot update or send a draft that is already sent", () => {
    const d = createDraft({ toAddress: "a@b.com", subject: "Hi", body: "Body" });
    sendDraft(d.id);
    expect(updateDraft(d.id, { subject: "x" })).toBeNull();
    expect(sendDraft(d.id)).toBeNull();
    expect(deleteDraft(d.id)).toBe(false);
  });
});
