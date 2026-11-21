"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, createSession, destroySession, isAdmin } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/security";
import { updateStatus, type Status, type Table } from "@/lib/storage";
import { detailsTable, escapeHtml, layout, sendEmail } from "@/lib/email";
import { formatLongDate } from "@/lib/schedule";
import { site } from "@/data/site";

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000)) {
    return { error: "Demasiados intentos. Espera 15 minutos." };
  }
  if (!checkPassword(String(formData.get("password") ?? ""))) {
    return { error: "Contraseña incorrecta." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin");
}

const TABLES: Table[] = ["reservations", "event_requests", "contact_messages"];
const STATUSES: Status[] = ["pendiente", "confirmada", "cancelada"];

export async function setStatus(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const table = String(formData.get("table")) as Table;
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as Status;
  if (!TABLES.includes(table) || !STATUSES.includes(status) || !id) return;

  const row = await updateStatus(table, id, status);

  // Al confirmar o cancelar una reserva, avisamos al cliente por email
  if (row && table === "reservations" && status !== "pendiente" && typeof row.email === "string") {
    const confirmed = status === "confirmada";
    await sendEmail({
      to: row.email,
      subject: confirmed ? `Reserva confirmada · ${site.name}` : `Reserva cancelada · ${site.name}`,
      html: layout(
        confirmed ? "Tu reserva está confirmada" : "Tu reserva ha sido cancelada",
        `<p>Hola ${escapeHtml(row.name)},</p>
         <p>${confirmed ? "Tu mesa está confirmada. ¡Te esperamos!" : "Lamentamos comunicarte que no podemos atender tu reserva en la fecha solicitada. Si lo deseas, responde a este email y buscamos otra opción."}</p>
         ${detailsTable([
           ["Fecha", formatLongDate(String(row.date))],
           ["Hora", row.time],
           ["Personas", row.party],
         ])}`,
      ),
    }).catch((e) => console.error(e));
  }
  revalidatePath("/admin");
}
