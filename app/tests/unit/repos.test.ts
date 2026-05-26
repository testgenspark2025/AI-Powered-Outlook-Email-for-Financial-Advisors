import { describe, expect, it } from "vitest";
import { listClients, getClient, getClientWithHousehold } from "@/lib/db/repos/clients";
import { listEmails, getEmail } from "@/lib/db/repos/emails";
import { listSegments, getSegment } from "@/lib/db/repos/segments";

describe("segments repo", () => {
  it("lists segments", () => {
    const all = listSegments();
    expect(all.length).toBeGreaterThan(0);
    expect(all[0]).toHaveProperty("id");
    expect(all[0]).toHaveProperty("name");
  });

  it("looks up segments by id", () => {
    expect(getSegment(1)?.name).toBe("Ultra High Net Worth");
    expect(getSegment(999_999)).toBeNull();
  });
});

describe("clients repo", () => {
  it("lists all 5 clients with segments attached", () => {
    const all = listClients();
    expect(all).toHaveLength(5);
    for (const c of all) {
      expect(c.segment).toBeTruthy();
      expect(c.segment.id).toBe(c.segmentId);
    }
  });

  it("filters by segmentId", () => {
    const uhnw = listClients({ segmentId: 1 });
    expect(uhnw).toHaveLength(1);
    expect(uhnw[0]!.fullName).toBe("Robert Sterling");
  });

  it("returns null for unknown clients", () => {
    expect(getClient("cl_does_not_exist")).toBeNull();
  });

  it("attaches household to a single client", () => {
    const c = getClientWithHousehold("cl_sterling");
    expect(c).not.toBeNull();
    expect(c!.household.members.length).toBeGreaterThan(1);
    expect(c!.household.members[0]!.fullName).toBe("Robert Sterling");
  });
});

describe("emails repo", () => {
  it("lists inbox sorted by receivedAt desc", () => {
    const all = listEmails({ folder: "inbox" });
    expect(all.length).toBeGreaterThan(0);
    for (let i = 1; i < all.length; i++) {
      expect(all[i - 1]!.receivedAt >= all[i]!.receivedAt).toBe(true);
    }
  });

  it("filters by client segment", () => {
    const onlyChen = listEmails({ folder: "inbox", segmentId: 6 });
    expect(onlyChen.every((e) => e.client?.segmentId === 6)).toBe(true);
    expect(onlyChen.length).toBeGreaterThan(0);
  });

  it("returns email detail with client + household", () => {
    const e = getEmail("em_sterling_q4");
    expect(e).not.toBeNull();
    expect(e!.client?.fullName).toBe("Robert Sterling");
    expect(e!.client?.household.members.length).toBeGreaterThan(0);
  });

  it("returns null for unknown email", () => {
    expect(getEmail("em_does_not_exist")).toBeNull();
  });
});
