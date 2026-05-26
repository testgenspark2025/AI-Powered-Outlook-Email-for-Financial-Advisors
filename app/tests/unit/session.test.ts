import { describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken, verifyPassword } from "@/lib/auth/session";

const SECRET = "test-secret-must-be-long-enough-for-hmac";

describe("session token", () => {
  it("creates and verifies a token", async () => {
    const token = await createSessionToken(SECRET);
    const payload = await verifySessionToken(token, SECRET);
    expect(payload).not.toBeNull();
    expect(typeof payload?.iat).toBe("number");
    expect(typeof payload?.nonce).toBe("string");
  });

  it("rejects a tampered token", async () => {
    const token = await createSessionToken(SECRET);
    const [payload] = token.split(".");
    const tampered = `${payload}.AAAA`;
    expect(await verifySessionToken(tampered, SECRET)).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createSessionToken(SECRET);
    expect(await verifySessionToken(token, "different-secret-value-here")).toBeNull();
  });

  it("rejects a non-dotted token", async () => {
    expect(await verifySessionToken("notatoken", SECRET)).toBeNull();
  });
});

describe("password compare", () => {
  it("equal strings compare equal", async () => {
    expect(await verifyPassword("hunter2", "hunter2")).toBe(true);
  });

  it("unequal strings compare unequal", async () => {
    expect(await verifyPassword("hunter2", "wrong")).toBe(false);
  });

  it("different lengths compare unequal", async () => {
    expect(await verifyPassword("a", "aa")).toBe(false);
  });
});
