import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

const PUBLIC_PATHS = new Set(["/login"]);
const PUBLIC_API_PATHS = new Set([
  "/api/v1/health",
  "/api/v1/auth/login",
  "/api/v1/auth/logout",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname) || PUBLIC_API_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secret = process.env.SESSION_SECRET;
  const valid = token && secret ? await verifySessionToken(token, secret) : null;

  if (valid) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Missing or invalid session cookie",
      },
      { status: 401, headers: { "Content-Type": "application/problem+json" } },
    );
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
