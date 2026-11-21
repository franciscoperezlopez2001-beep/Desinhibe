"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Field, Honeypot, PrivacyCheck, aria } from "./Field";
import { FormAlert } from "./FormAlert";
import { Turnstile } from "./Turnstile";
import { useSubmit } from "./useSubmit";
import { buttonClass } from "../Button";

export function ContactForm() {
  const [token, setToken] = useState("");
  const { state, submit, errors, resetKey } = useSubmit("/api/contacto");

  if (state.status === "success") {
    return (
      <div role="status" className="animate-fade-up border border-laton/30 bg-nogal/60 p-8">
        <Check size={26} strokeWidth={1.4} className="text-laton" aria-hidden />
        <h3 className="mt-4 font-serif text-3xl text-marfil">Mensaje enviado</h3>
        <p className="mt-2 text-marfil/80">Te responderemos lo antes posible. Para reservas, usa mejor el formulario de reservas.</p>
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
        <Field id="name" label="Nombre" error={errors.name}>
          <input {...aria("name", errors.name)} autoComplete="name" required maxLength={80} className="campo" />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input {...aria("email", errors.email)} type="email" autoComplete="email" required maxLength={120} className="campo" />
        </Field>
        <Field id="subject" label="Asunto" error={errors.subject} className="sm:col-span-2">
          <input {...aria("subject", errors.subject)} required maxLength={120} className="campo" />
        </Field>
        <Field id="message" label="Mensaje" error={errors.message} className="sm:col-span-2">
          <textarea {...aria("message", errors.message)} rows={5} required maxLength={1500} className="campo resize-y" />
        </Field>
      </div>
      <PrivacyCheck error={errors.privacy} />
      <Turnstile onToken={setToken} resetKey={resetKey} />
      {state.status === "error" && <FormAlert message={state.message} />}
      <button type="submit" disabled={sending} className={buttonClass("primario", "w-full sm:w-auto")}>
        {sending ? (<><Loader2 size={16} className="animate-spin" aria-hidden /> Enviando…</>) : "Enviar mensaje"}
      </button>
    </form>
  );
}
