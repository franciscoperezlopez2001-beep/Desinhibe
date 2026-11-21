"use client";

export type Consent = "aceptadas" | "rechazadas" | null;
const KEY = "cf-cookies";
const EVENT = "cf-consent";

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "aceptadas" || v === "rechazadas" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Exclude<Consent, null>) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* almacenamiento bloqueado: el banner volverá a mostrarse */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
}

export function onConsentChange(cb: (v: Consent) => void) {
  const handler = (e: Event) => cb((e as CustomEvent).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

export function reopenBanner() {
  window.dispatchEvent(new CustomEvent("cf-consent-open"));
}
