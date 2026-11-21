import { contactSchema } from "@/lib/validation";
import { handleSubmission } from "@/lib/submission";
import { detailsTable, layout, RESTAURANT_EMAIL, sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  return handleSubmission(req, {
    key: "contacto",
    schema: contactSchema,
    table: "contact_messages",
    toRow: (d) => ({ name: d.name, email: d.email, subject: d.subject, message: d.message }),
    notify: async (record, d) => {
      if (!RESTAURANT_EMAIL) return;
      await sendEmail({
        to: RESTAURANT_EMAIL,
        replyTo: d.email,
        subject: `Contacto web · ${d.subject}`,
        html: layout(
          "Nuevo mensaje desde la web",
          `${detailsTable([["Nombre", d.name], ["Email", d.email], ["Asunto", d.subject], ["Mensaje", d.message]])}<p style="color:#7a6e60;font-size:13px">ID: ${record.id}</p>`,
        ),
      });
    },
  });
}
