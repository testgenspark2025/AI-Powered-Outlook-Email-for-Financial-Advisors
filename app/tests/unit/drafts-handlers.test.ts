import { beforeEach, describe, expect, it } from "vitest";
import { GET as listDraftsGET, POST as createDraftPOST } from "@/app/api/v1/drafts/route";
import {
  DELETE as draftDELETE,
  GET as draftGET,
  PATCH as draftPATCH,
} from "@/app/api/v1/drafts/[id]/route";
import { GET as emailsGET, POST as sendPOST } from "@/app/api/v1/emails/route";
import { _resetDraftStoreForTests } from "@/lib/db/repos/drafts";

function get(path: string): Request {
  return new Request(`http://localhost${path}`);
}

function post(path: string, body: unknown): Request {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function patch(path: string, body: unknown): Request {
  return new Request(`http://localhost${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  _resetDraftStoreForTests();
});

describe("POST /api/v1/drafts", () => {
  it("creates a draft and returns 201", async () => {
    const res = await createDraftPOST(post("/api/v1/drafts", { subject: "Hi" }));
    expect(res.status).toBe(201);
    const body = (await res.json()) as { id: string; subject: string; status: string };
    expect(body.id).toMatch(/^df_/);
    expect(body.subject).toBe("Hi");
    expect(body.status).toBe("draft");
  });

  it("rejects non-JSON bodies", async () => {
    const req = new Request("http://localhost/api/v1/drafts", { method: "POST", body: "not json" });
    const res = await createDraftPOST(req);
    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/drafts", () => {
  it("lists current drafts", async () => {
    await createDraftPOST(post("/api/v1/drafts", { subject: "First" }));
    await createDraftPOST(post("/api/v1/drafts", { subject: "Second" }));
    const res = await listDraftsGET();
    const body = (await res.json()) as { items: { id: string }[] };
    expect(body.items).toHaveLength(2);
  });
});

describe("PATCH /api/v1/drafts/:id", () => {
  it("updates fields", async () => {
    const created = await createDraftPOST(post("/api/v1/drafts", {}));
    const { id } = (await created.json()) as { id: string };

    const res = await draftPATCH(patch(`/api/v1/drafts/${id}`, { subject: "Updated" }), {
      params: Promise.resolve({ id }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { subject: string };
    expect(body.subject).toBe("Updated");
  });

  it("returns 404 for missing draft", async () => {
    const res = await draftPATCH(patch("/api/v1/drafts/df_missing", { subject: "x" }), {
      params: Promise.resolve({ id: "df_missing" }),
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/v1/drafts/:id", () => {
  it("removes a draft and returns 204", async () => {
    const created = await createDraftPOST(post("/api/v1/drafts", {}));
    const { id } = (await created.json()) as { id: string };
    const res = await draftDELETE(get(`/api/v1/drafts/${id}`), { params: Promise.resolve({ id }) });
    expect(res.status).toBe(204);
    const after = await draftGET(get(`/api/v1/drafts/${id}`), { params: Promise.resolve({ id }) });
    expect(after.status).toBe(404);
  });
});

describe("POST /api/v1/emails (send)", () => {
  it("sends a complete draft, returns 201, and moves to sent folder", async () => {
    const created = await createDraftPOST(
      post("/api/v1/drafts", {
        toAddress: "client@example.com",
        subject: "Quick note",
        body: "Hello!",
      }),
    );
    const { id } = (await created.json()) as { id: string };

    const sendRes = await sendPOST(post("/api/v1/emails", { draftId: id }));
    expect(sendRes.status).toBe(201);
    const sentBody = (await sendRes.json()) as { status: string; sentAt: string };
    expect(sentBody.status).toBe("sent");
    expect(sentBody.sentAt).toBeTruthy();

    const listing = await emailsGET(get("/api/v1/emails?folder=sent"));
    const items = (await listing.json()) as { items: { id: string }[] };
    expect(items.items.map((i) => i.id)).toContain(id);

    const drafts = await listDraftsGET();
    const draftsBody = (await drafts.json()) as { items: { id: string }[] };
    expect(draftsBody.items.find((d) => d.id === id)).toBeUndefined();
  });

  it("rejects sending an incomplete draft", async () => {
    const created = await createDraftPOST(post("/api/v1/drafts", { subject: "" }));
    const { id } = (await created.json()) as { id: string };
    const res = await sendPOST(post("/api/v1/emails", { draftId: id }));
    expect(res.status).toBe(400);
  });

  it("returns 404 when sending an unknown draft", async () => {
    const res = await sendPOST(post("/api/v1/emails", { draftId: "df_missing" }));
    expect(res.status).toBe(404);
  });

  it("returns 400 when draftId is missing", async () => {
    const res = await sendPOST(post("/api/v1/emails", {}));
    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/emails?folder=sent", () => {
  it("returns sent items only", async () => {
    const c = await createDraftPOST(
      post("/api/v1/drafts", { toAddress: "x@y.com", subject: "S", body: "B" }),
    );
    const { id } = (await c.json()) as { id: string };
    await sendPOST(post("/api/v1/emails", { draftId: id }));

    const res = await emailsGET(get("/api/v1/emails?folder=sent"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { items: { status: string }[] };
    expect(body.items.every((i) => i.status === "sent")).toBe(true);
  });
});
