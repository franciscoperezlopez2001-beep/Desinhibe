"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { eventTypeLabels } from "@/lib/validation";
import { Field, Honeypot, PrivacyCheck, aria } from "./Field";
import { FormAlert } from "./FormAlert";
import { Turnstile } from "./Turnstile";
import { useSubmit } from "./useSubmit";
import { buttonClass } from "../Button";

export function EventForm({ min }: { min: string }) {
  const [token, setToken] = useState("");
  const { state, submit, errors, resetKey } = useSubmit("/api/eventos");

  if (state.status === "success") {
    return (
      <div role="status" className="animate-fade-up border border-laton/30 bg-nogal/60 p-8 sm:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-laton text-laton">
          <Check size={22} strokeWidth={1.4} aria-hidden />
        </span>
        <h3 className="mt-6 font-serif text-4xl text-marfil">Solicitud recibida</h3>
        <p className="mt-3 max-w-md leading-relaxed text-marfil/80">
          Gracias por pensar en Casa Francisco. Te contactaremos en un plazo de 48 horas laborables con una propuesta a medida.
        </p>
      </div>
    );
  }

  const sending = state.status === "sending";
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget, { turnstileToken: token });
      }}
      className="tema-oscuro relative space-y-8"
    >
      <Honeypot />
      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="name" label="Nombre y apellidos" error={errors.name} className="sm:col-span-2">
          <input {...aria("name", errors.name)} autoComplete="name" required maxLength={80} className="campo" />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input {...aria("email", errors.email)} type="email" autoComplete="email" required maxLength={120} className="campo" />
        </Field>
        <Field id="phone" label="Teléfono" error={errors.phone}>
          <input {...aria("phone", errors.phone)} type="tel" autoComplete="tel" required maxLength={20} className="campo" />
        </Field>
        <Field id="eventType" label="Tipo de evento" error={errors.eventType}>
          <select {...aria("eventType", errors.eventType)} defaultValue="" required className="campo">
            <option value="" disabled>Elige una opción</option>
            {Object.entries(eventTypeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>
        <Field id="date" label="Fecha prevista" error={errors.date}>
          <input {...aria("date", errors.date)} type="date" min={min} required className="campo [color-scheme:dark]" />
        </Field>
        <Field id="guests" label="Número de invitados" error={errors.guests}>
          <input {...aria("guests", errors.guests)} type="number" min={2} max={200} inputMode="numeric" required className="campo" />
        </Field>
        <Field id="budget" label="Presupuesto orientativo por persona" error={errors.budget} optional>
          <select {...aria("budget", errors.budget)} defaultValue="" className="campo">
            <option value="">Sin definir</option>
            <option>Hasta 55 €</option>
            <option>55 – 75 €</option>
            <option>75 – 100 €</option>
            <option>Más de 100 €</option>
          </select>
        </Field>
        <Field id="message" label="Cuéntanos tu idea" error={errors.message} optional className="sm:col-span-2">
          <textarea {...aria("message", errors.message)} rows={4} maxLength={600} className="campo resize-y" />
        </Field>
      </div>
      <PrivacyCheck error={errors.privacy} />
      <Turnstile onToken={setToken} resetKey={resetKey} />
      {state.status === "error" && <FormAlert message={state.message} />}
      <button type="submit" disabled={sending} className={buttonClass("primario", "w-full sm:w-auto")}>
        {sending ? (<><Loader2 size={16} className="animate-spin" aria-hidden /> Enviando…</>) : "Solicitar propuesta"}
      </button>
    </form>
  );
}
