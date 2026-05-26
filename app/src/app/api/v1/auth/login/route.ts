import { z } from "zod";
import {
  createSessionToken,
  sessionCookieAttributes,
  verifyPassword,
} from "@/lib/auth/session";
import { Problems } from "@/lib/api/problems";

export const runtime = "edge";

const Body = z.object({ password: z.string().min(1) });

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.SESSION_SECRET;
  const expected = process.env.SHARED_PASSWORD;
  if (!secret || !expected) {
    return Problems.internal("Auth is not configured (missing SESSION_SECRET or SHARED_PASSWORD)");
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Problems.validation("Body must be JSON");
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) return Problems.validation(parsed.error.issues[0]?.message ?? "Invalid body");

  const ok = await verifyPassword(parsed.data.password, expected);
  if (!ok) return Problems.unauthorized();

  const token = await createSessionToken(secret);
  const isProd = process.env.NODE_ENV === "production";
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": sessionCookieAttributes(token, isProd) },
  });
}
