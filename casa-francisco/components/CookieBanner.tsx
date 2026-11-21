"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { onConsentChange, readConsent, writeConsent, type Consent } from "./consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Banner de cookies. La analítica (si se configura NEXT_PUBLIC_GA_ID) y el
 * mapa de Google solo se cargan tras el consentimiento.
 */
export function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setVisible(c === null);
    const off = onConsentChange(setConsent);
    const open = () => setVisible(true);
    window.addEventListener("cf-consent-open", open);
    return () => {
      off();
      window.removeEventListener("cf-consent-open", open);
    };
  }, []);

  const choose = (v: "aceptadas" | "rechazadas") => {
    writeConsent(v);
    setVisible(false);
  };

  return (
    <>
      {consent === "aceptadas" && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {visible && (
        <div
          role="region"
          aria-label="Aviso de cookies"
          className="fixed inset-x-3 bottom-[4.5rem] z-[45] mx-auto max-w-xl border border-laton/25 bg-nogal/97 p-4 sm:p-5 shadow-2xl shadow-black/50 backdrop-blur animate-fade-up sm:bottom-6 sm:left-6 sm:right-auto lg:bottom-6"
        >
          <p className="text-[0.8rem] leading-relaxed text-marfil/90 sm:text-sm">
            Usamos cookies técnicas imprescindibles y, solo si nos das permiso, cookies de terceros para mostrar el mapa
            {GA_ID ? " y medir visitas de forma anónima" : ""}.{" "}
            <Link href="/cookies" className="enlace text-laton">Más información sobre cookies</Link>
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex sm:gap-3">
            <button type="button" onClick={() => choose("aceptadas")} className="min-h-11 bg-laton px-5 text-xs font-semibold uppercase tracking-[0.16em] text-ebano transition-colors hover:bg-laton-claro">
              Aceptar
            </button>
            <button type="button" onClick={() => choose("rechazadas")} className="min-h-11 border border-marfil/25 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-marfil transition-colors hover:border-laton">
              Rechazar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
