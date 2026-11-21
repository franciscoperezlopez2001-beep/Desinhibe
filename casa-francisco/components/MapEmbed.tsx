"use client";

import { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { site } from "@/data/site";
import { onConsentChange, readConsent } from "./consent";

/**
 * Mapa de Google que solo se carga tras consentimiento o clic (privacidad y
 * rendimiento). Si la dirección aún no se ha facilitado, muestra un aviso.
 */
export function MapEmbed() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (readConsent() === "aceptadas") setLoad(true);
    return onConsentChange((v) => v === "aceptadas" && setLoad(true));
  }, []);

  const query = site.geo
    ? `${site.geo.lat},${site.geo.lng}`
    : `${site.name}, ${site.address.street}, ${site.address.postalCode} ${site.address.locality}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

  if (site.address.pending) {
    return (
      <div className="relative grid aspect-[4/3] w-full place-items-center overflow-hidden border border-dashed border-laton/40 bg-nogal p-8 text-center md:aspect-auto md:h-full md:min-h-[26rem]">
        <div>
          <MapPin className="mx-auto text-laton" size={30} strokeWidth={1.2} aria-hidden />
          <p className="mt-4 font-serif text-2xl text-marfil">Mapa pendiente</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-arena">
            Se mostrará automáticamente al completar la dirección en <code className="text-laton-claro">data/site.ts</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-nogal md:aspect-auto md:h-full md:min-h-[26rem]">
      {load ? (
        <iframe
          title={`Mapa de ubicación de ${site.name}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
          className="absolute inset-0 h-full w-full grayscale-[0.6] contrast-[1.05]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-8 text-center">
          <div>
            <MapPin className="mx-auto text-laton" size={30} strokeWidth={1.2} aria-hidden />
            <p className="mx-auto mt-4 max-w-xs text-sm text-arena">El mapa lo sirve Google y puede instalar cookies.</p>
            <button type="button" onClick={() => setLoad(true)} className="mt-5 min-h-11 border border-laton/60 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-marfil hover:bg-laton/10">
              Cargar mapa
            </button>
          </div>
        </div>
      )}
      <a
        href={directions}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-2 bg-laton px-4 text-xs font-semibold uppercase tracking-[0.16em] text-ebano hover:bg-laton-claro"
      >
        <Navigation size={15} strokeWidth={1.6} aria-hidden /> Cómo llegar
      </a>
    </div>
  );
}
