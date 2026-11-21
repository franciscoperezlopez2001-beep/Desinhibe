import { reservationSchema, roomLabels } from "@/lib/validation";
import { handleSubmission } from "@/lib/submission";
import { detailsTable, escapeHtml, layout, RESTAURANT_EMAIL, sendEmail } from "@/lib/email";
import { formatLongDate } from "@/lib/schedule";
import { site } from "@/data/site";

export async function POST(req: Request) {
  return handleSubmission(req, {
    key: "reservas",
    schema: reservationSchema,
    table: "reservations",
    toRow: (d) => ({
      date: d.date,
      time: d.time,
      party: d.party,
      room: d.room,
      name: d.name,
      email: d.email,
      phone: d.phone,
      notes: d.notes,
    }),
    notify: async (record, d) => {
      const rows: [string, unknown][] = [
        ["Fecha", formatLongDate(d.date)],
        ["Hora", d.time],
        ["Personas", d.party],
        ["Sala", roomLabels[d.room]],
        ["Nombre", d.name],
        ["Teléfono", d.phone],
        ["Email", d.email],
        ["Observaciones", d.notes],
      ];
      await Promise.all([
        RESTAURANT_EMAIL &&
          sendEmail({
            to: RESTAURANT_EMAIL,
            replyTo: d.email,
            subject: `Nueva reserva · ${d.date} ${d.time} · ${d.party} pax · ${d.name}`,
            html: layout("Nueva solicitud de reserva", `${detailsTable(rows)}<p style="color:#7a6e60;font-size:13px">ID: ${record.id}. Gestiónala en el panel /admin.</p>`),
          }),
        sendEmail({
          to: d.email,
          subject: `Hemos recibido tu reserva · ${site.name}`,
          html: layout(
            "Gracias por tu reserva",
            `<p>Hola ${escapeHtml(d.name)},</p>
             <p>Hemos recibido tu solicitud. Te escribiremos en breve para <strong>confirmarla</strong>.</p>
             ${detailsTable(rows.slice(0, 4))}
             <p>Si necesitas cambiar algo, responde a este email.</p>
             <p>Te esperamos en la mesa.</p>`,
          ),
        }),
      ]);
    },
  });
}
