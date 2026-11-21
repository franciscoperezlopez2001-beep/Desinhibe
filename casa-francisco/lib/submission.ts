import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { fieldErrors } from "@/lib/validation";
import { insertRecord, StorageNotConfiguredError, type StoredRecord, type Table } from "@/lib/storage";
import { clientIp, isSameOrigin, rateLimit, verifyTurnstile } from "@/lib/security";

/**
 * Flujo común de los formularios:
 * origen → honeypot → límite por IP → Turnstile → validación Zod → guardado → emails.
 */
export async function handleSubmission<S extends z.ZodType>(
  req: Request,
  opts: {
    key: string;
    schema: S;
    table: Table;
    toRow: (data: z.infer<S>) => Record<string, unknown>;
    notify: (record: StoredRecord, data: z.infer<S>) => Promise<unknown>;
  },
) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, message: "Origen no permitido." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Petición no válida." }, { status: 400 });
  }

  // Honeypot: los bots rellenan el campo oculto. Respondemos OK sin guardar nada.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(req);
  if (!rateLimit(`${opts.key}:${ip}`)) {
    return NextResponse.json(
      { ok: false, message: "Has enviado varias solicitudes seguidas. Espera unos minutos e inténtalo de nuevo." },
      { status: 429 },
    );
  }

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json(
      { ok: false, message: "No hemos podido verificar que no eres un robot. Recarga la página e inténtalo de nuevo." },
      { status: 400 },
    );
  }

  const parsed = opts.schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Revisa los campos marcados.", errors: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  try {
    const record = await insertRecord(opts.table, opts.toRow(parsed.data));
    // Un fallo de email no debe perder la solicitud: ya está guardada.
    await opts.notify(record, parsed.data).catch((e) => console.error("notify error", e));
    return NextResponse.json({ ok: true, id: record.id });
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      console.error(e.message);
      return NextResponse.json(
        { ok: false, message: "El sistema de solicitudes online no está disponible ahora mismo. Por favor, llámanos por teléfono." },
        { status: 503 },
      );
    }
    console.error("submission error", e);
    return NextResponse.json(
      { ok: false, message: "Ha ocurrido un error al guardar tu solicitud. Inténtalo de nuevo o llámanos." },
      { status: 500 },
    );
  }
}
