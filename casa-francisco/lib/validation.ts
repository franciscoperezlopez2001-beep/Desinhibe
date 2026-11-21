import { z } from "zod";
import { site } from "@/data/site";
import { isIsoDate, isSlotAvailable, nowInRestaurant } from "@/lib/schedule";

const req = (msg: string) => z.string({ error: msg });

const name = req("Indica tu nombre")
  .trim()
  .min(2, "Indica tu nombre")
  .max(80, "El nombre es demasiado largo");

const email = req("Indica tu email").trim().toLowerCase().max(120).email("Revisa el email");

const phone = req("Indica un teléfono de contacto")
  .trim()
  .min(6, "Indica un teléfono de contacto")
  .max(20, "Revisa el teléfono")
  .regex(/^[+()\d\s.-]+$/, "Revisa el teléfono");

const privacy = z.literal(true, { error: "Debes aceptar la política de privacidad" });

const notes = z.string().trim().max(600, "Máximo 600 caracteres").optional().default("");

export const reservationSchema = z
  .object({
    date: req("Elige una fecha").refine(isIsoDate, "Elige una fecha"),
    time: req("Elige una hora de llegada").regex(/^\d{2}:\d{2}$/, "Elige una hora"),
    party: z.coerce
      .number({ error: "Indica el número de personas" })
      .int()
      .min(1, "Mínimo 1 persona")
      .max(site.reservations.maxPartyOnline, `Para más de ${site.reservations.maxPartyOnline} personas, solicita un evento`),
    room: z.enum(["salon", "bodega", "indiferente"]).default("indiferente"),
    name,
    email,
    phone,
    notes,
    privacy,
  })
  .refine((d) => isSlotAvailable(d.date, d.time), {
    path: ["time"],
    message: "Esa franja ya no está disponible. Elige otra hora.",
  });

export type ReservationInput = z.infer<typeof reservationSchema>;

export const eventSchema = z.object({
  name,
  email,
  phone,
  date: req("Elige una fecha")
    .refine(isIsoDate, "Elige una fecha")
    .refine((d) => d >= nowInRestaurant().date, "La fecha ya ha pasado"),
  guests: z.coerce.number({ error: "Indica el número de invitados" }).int().min(2, "Mínimo 2").max(200, "Máximo 200"),
  eventType: z.enum(["cumpleanos", "empresa", "pedida", "presentacion", "otro"], {
    error: "Elige el tipo de evento",
  }),
  budget: z.string().trim().max(60).optional().default(""),
  message: notes,
  privacy,
});

export type EventInput = z.infer<typeof eventSchema>;

export const contactSchema = z.object({
  name,
  email,
  subject: req("Indica el asunto").trim().min(3, "Indica el asunto").max(120),
  message: req("Escribe tu mensaje").trim().min(10, "Cuéntanos un poco más").max(1500, "Máximo 1500 caracteres"),
  privacy,
});

export type ContactInput = z.infer<typeof contactSchema>;

export const roomLabels = { salon: "El Salón", bodega: "La Bodega", indiferente: "Sin preferencia" } as const;

export const eventTypeLabels = {
  cumpleanos: "Cumpleaños o aniversario",
  empresa: "Comida o cena de empresa",
  pedida: "Pedida o celebración familiar",
  presentacion: "Presentación o evento de marca",
  otro: "Otro",
} as const;

/** Convierte errores de Zod en { campo: mensaje } para el formulario. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
