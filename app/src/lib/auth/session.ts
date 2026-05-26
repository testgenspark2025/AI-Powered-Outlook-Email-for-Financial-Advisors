const ENCODER = new TextEncoder();
const COOKIE_NAME = "fa_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type SessionPayload = {
  iat: number;
  nonce: string;
};

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    ENCODER.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function base64UrlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]!);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(s: string): Uint8Array {
  const norm = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = norm.length % 4 === 0 ? norm : norm + "=".repeat(4 - (norm.length % 4));
  const bin = atob(pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

export async function createSessionToken(secret: string): Promise<string> {
  const payload: SessionPayload = {
    iat: Math.floor(Date.now() / 1000),
    nonce: crypto.randomUUID(),
  };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(ENCODER.encode(payloadJson));
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, ENCODER.encode(payloadB64));
  return `${payloadB64}.${base64UrlEncode(sig)}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
): Promise<SessionPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts as [string, string];

  const key = await hmacKey(secret);
  const expected = await crypto.subtle.sign("HMAC", key, ENCODER.encode(payloadB64));
  const provided = base64UrlDecode(sigB64);
  if (!timingSafeEqual(new Uint8Array(expected), provided)) return null;

  let payload: SessionPayload;
  try {
    const json = new TextDecoder().decode(base64UrlDecode(payloadB64));
    payload = JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
  if (typeof payload.iat !== "number" || typeof payload.nonce !== "string") return null;

  const ageSeconds = Math.floor(Date.now() / 1000) - payload.iat;
  if (ageSeconds < 0 || ageSeconds > MAX_AGE_SECONDS) return null;

  return payload;
}

export async function verifyPassword(provided: string, expected: string): Promise<boolean> {
  const a = ENCODER.encode(provided);
  const b = ENCODER.encode(expected);
  return timingSafeEqual(a, b);
}

export function sessionCookieAttributes(value: string, secure = true): string {
  const attrs = [
    `${COOKIE_NAME}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${MAX_AGE_SECONDS}`,
  ];
  if (secure) attrs.push("Secure");
  return attrs.join("; ");
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
