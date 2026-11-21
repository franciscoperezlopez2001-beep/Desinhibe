import "server-only";
import { site } from "@/data/site";

/**
 * Envío de emails transaccionales con Resend (API HTTP, sin SDK).
 * Sin RESEND_API_KEY, en desarrollo el email se muestra en consola.
 */

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM;
export const RESTAURANT_EMAIL = process.env.RESTAURANT_EMAIL;

export const emailConfigured = Boolean(API_KEY && FROM && RESTAURANT_EMAIL);

interface Mail {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(mail: Mail): Promise<boolean> {
  if (!API_KEY || !FROM) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[email · modo desarrollo] Para: ${mail.to}\nAsunto: ${mail.subject}\n`);
    }
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [mail.to],
      subject: mail.subject,
      html: mail.html,
      reply_to: mail.replyTo,
    }),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text().catch(() => ""));
    return false;
  }
  return true;
}

/* ───────────── Plantillas ───────────── */

export function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function layout(title: string, body: string) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#F3EDE4;font-family:Georgia,serif;color:#14100D">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e3d8c6">
        <tr><td style="background:#14100D;padding:28px 32px;text-align:center">
          <div style="color:#C29A5B;letter-spacing:4px;font-size:12px">CASA FRANCISCO</div>
          <div style="color:#EDE6DA;font-size:24px;margin-top:8px">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:28px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#2a211b">${body}</td></tr>
        <tr><td style="padding:18px 32px;border-top:1px solid #eee3d2;font-family:Arial,sans-serif;font-size:12px;color:#7a6e60">
          ${escapeHtml(site.name)} · ${escapeHtml(site.tagline)}
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

export function detailsTable(rows: [string, unknown][]) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:16px 0">
  ${rows
    .filter(([, v]) => v !== undefined && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee3d2;color:#7a6e60;width:40%">${escapeHtml(k)}</td><td style="padding:8px 0;border-bottom:1px solid #eee3d2">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}
  </table>`;
}
