import "server-only";

/* ───────────── Límite de peticiones por IP ─────────────
 * En memoria: suficiente para un servidor único. En Vercel (serverless) cada
 * instancia tiene su propia memoria; Turnstile es la protección principal. */

const buckets = new Map<string, number[]>();

export function rateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear();
  return true;
}

export function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/* ───────────── Cloudflare Turnstile ───────────── */

export const turnstileEnabled = Boolean(process.env.TURNSTILE_SECRET_KEY);

export async function verifyTurnstile(token: unknown, ip: string) {
  if (!turnstileEnabled) return true;
  if (typeof token !== "string" || !token) return false;
  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY!,
    response: token,
    remoteip: ip,
  });
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/* ───────────── Mismo origen ───────────── */

export function isSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // algunos navegadores no la envían en same-origin
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}
