import { eventSchema, eventTypeLabels } from "@/lib/validation";
import { handleSubmission } from "@/lib/submission";
import { detailsTable, layout, RESTAURANT_EMAIL, sendEmail } from "@/lib/email";
import { formatLongDate } from "@/lib/schedule";
import { site } from "@/data/site";

export async function POST(req: Request) {
  return handleSubmission(req, {
    key: "eventos",
    schema: eventSchema,
    table: "event_requests",
    toRow: (d) => ({
      date: d.date,
      guests: d.guests,
      event_type: d.eventType,
      budget: d.budget,
      name: d.name,
      email: d.email,
      phone: d.phone,
      message: d.message,
    }),
    notify: async (record, d) => {
      const rows: [string, unknown][] = [
        ["Tipo de evento", eventTypeLabels[d.eventType]],
        ["Fecha", formatLongDate(d.date)],
        ["Invitados", d.guests],
        ["Presupuesto", d.budget],
        ["Nombre", d.name],
        ["Teléfono", d.phone],
        ["Email", d.email],
        ["Mensaje", d.message],
      ];
      await Promise.all([
        RESTAURANT_EMAIL &&
          sendEmail({
            to: RESTAURANT_EMAIL,
            replyTo: d.email,
            subject: `Solicitud de evento · ${d.date} · ${d.guests} pax · ${d.name}`,
            html: layout("Nueva solicitud de evento", `${detailsTable(rows)}<p style="color:#7a6e60;font-size:13px">ID: ${record.id}</p>`),
          }),
        sendEmail({
          to: d.email,
          subject: `Hemos recibido tu solicitud de evento · ${site.name}`,
          html: layout(
            "Gracias por pensar en nosotros",
            `<p>Hemos recibido tu solicitud. Nuestro equipo de eventos te contactará en un plazo de 48 horas laborables con una propuesta.</p>${detailsTable(rows.slice(0, 3))}`,
          ),
        }),
      ]);
    },
  });
}
