import { describe, expect, it } from "vitest";
import { GET as listClientsGET } from "@/app/api/v1/clients/route";
import { GET as getClientGET } from "@/app/api/v1/clients/[id]/route";
import { GET as listEmailsGET } from "@/app/api/v1/emails/route";
import { GET as getEmailGET } from "@/app/api/v1/emails/[id]/route";
import { GET as listSegmentsGET } from "@/app/api/v1/segments/route";

function url(path: string): Request {
  return new Request(`http://localhost${path}`);
}

describe("GET /api/v1/segments", () => {
  it("returns segments list", async () => {
    const res = await listSegmentsGET();
    expect(res.status).toBe(200);
    const body = (await res.json()) as { items: unknown[] };
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
  });
});

describe("GET /api/v1/clients", () => {
  it("returns all clients", async () => {
    const res = await listClientsGET(url("/api/v1/clients"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { items: { id: string }[] };
    expect(body.items).toHaveLength(5);
  });

  it("filters by segmentId", async () => {
    const res = await listClientsGET(url("/api/v1/clients?segmentId=1"));
    const body = (await res.json()) as { items: { id: string }[] };
    expect(body.items).toHaveLength(1);
    expect(body.items[0]!.id).toBe("cl_sterling");
  });

  it("rejects invalid segmentId", async () => {
    const res = await listClientsGET(url("/api/v1/clients?segmentId=foo"));
    expect(res.status).toBe(400);
    expect(res.headers.get("Content-Type")).toContain("problem+json");
  });
});

describe("GET /api/v1/clients/:id", () => {
  it("returns client with household", async () => {
    const res = await getClientGET(url("/api/v1/clients/cl_sterling"), {
      params: Promise.resolve({ id: "cl_sterling" }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { fullName: string; household: { members: unknown[] } };
    expect(body.fullName).toBe("Robert Sterling");
    expect(body.household.members.length).toBeGreaterThan(0);
  });

  it("returns 404 for unknown client", async () => {
    const res = await getClientGET(url("/api/v1/clients/cl_missing"), {
      params: Promise.resolve({ id: "cl_missing" }),
    });
    expect(res.status).toBe(404);
  });
});

describe("GET /api/v1/emails", () => {
  it("returns inbox by default", async () => {
    const res = await listEmailsGET(url("/api/v1/emails"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { items: { folder: string }[] };
    expect(body.items.every((e) => e.folder === "inbox")).toBe(true);
  });

  it("rejects invalid folder", async () => {
    const res = await listEmailsGET(url("/api/v1/emails?folder=trash"));
    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/emails/:id", () => {
  it("returns email detail with client + household", async () => {
    const res = await getEmailGET(url("/api/v1/emails/em_sterling_q4"), {
      params: Promise.resolve({ id: "em_sterling_q4" }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { subject: string; client: { household: { name: string } } };
    expect(body.subject).toMatch(/Q4 Family Office/);
    expect(body.client.household.name).toBeTruthy();
  });

  it("returns 404 for unknown email", async () => {
    const res = await getEmailGET(url("/api/v1/emails/em_missing"), {
      params: Promise.resolve({ id: "em_missing" }),
    });
    expect(res.status).toBe(404);
  });
});
