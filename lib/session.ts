import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "session";
export const SESSION_DAYS = 30;

function sign(value: string) {
  return createHmac("sha256", process.env.SESSION_SECRET!).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// Cookie = "<vencimiento en ms>.<firma>".
export function createSession() {
  const expires = String(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  return `${expires}.${sign(expires)}`;
}

export function isValidSession(cookie: string | undefined) {
  if (!cookie) return false;
  const [expires, sig] = cookie.split(".");
  return Boolean(sig) && safeEqual(sig, sign(expires)) && Number(expires) > Date.now();
}

export function isValidPassword(input: string) {
  // Se comparan las firmas para que la comparación sea de largo fijo.
  return safeEqual(sign(input), sign(process.env.APP_PASSWORD!));
}
