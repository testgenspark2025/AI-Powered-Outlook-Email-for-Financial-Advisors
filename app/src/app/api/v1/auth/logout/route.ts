import { clearSessionCookie } from "@/lib/auth/session";

export const runtime = "edge";

export function POST(): Response {
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": clearSessionCookie() },
  });
}
