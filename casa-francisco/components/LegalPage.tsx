import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="contenedor max-w-3xl pb-24 pt-36 md:pt-44">
      <p className="etiqueta text-laton">Información legal</p>
      <h1 className="mt-4 text-5xl text-marfil md:text-6xl">{title}</h1>
      <div role="note" className="mt-10 flex gap-3 border border-dashed border-laton/50 p-5 text-sm leading-relaxed text-laton-claro">
        <AlertTriangle size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden />
        <p>
          <strong>[PENDIENTE: revisión legal]</strong> Este texto es una estructura de partida que describe el funcionamiento
          técnico real de la web. Debe completarlo y validarlo un profesional jurídico con los datos del titular antes de publicar.
        </p>
      </div>
      <div className="mt-12 space-y-8 leading-relaxed text-marfil/80 [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-marfil [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </div>
  );
}
