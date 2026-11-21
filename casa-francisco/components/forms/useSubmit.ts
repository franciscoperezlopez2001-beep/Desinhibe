"use client";

import { useState } from "react";

export type FormState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; id?: string }
  | { status: "error"; message: string; errors?: Record<string, string> };

/** Envía un formulario como JSON y gestiona estados de carga, éxito y error. */
export function useSubmit(endpoint: string) {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [resetKey, setResetKey] = useState(0);

  async function submit(form: HTMLFormElement, extra: Record<string, unknown> = {}) {
    setState({ status: "sending" });
    const fd = new FormData(form);
    const payload: Record<string, unknown> = { ...extra };
    fd.forEach((value, key) => {
      payload[key] = value;
    });
    payload.privacy = fd.get("privacy") === "on";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setState({ status: "success", id: data.id });
        return true;
      }
      setState({
        status: "error",
        message: data.message || "No se ha podido enviar. Inténtalo de nuevo.",
        errors: data.errors,
      });
      setResetKey((k) => k + 1);
      // Lleva el foco al primer campo con error
      const first = data.errors && Object.keys(data.errors)[0];
      if (first) requestAnimationFrame(() => form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
    } catch {
      setState({ status: "error", message: "Sin conexión. Revisa tu red e inténtalo de nuevo." });
      setResetKey((k) => k + 1);
    }
    return false;
  }

  const errors = state.status === "error" ? state.errors ?? {} : {};
  return { state, setState, submit, errors, resetKey };
}
