import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Cabecera de páginas interiores: foto con velo, migas de pan y titular. */
export function PageHero({
  kicker,
  title,
  intro,
  image,
  imageAlt,
  crumb,
  children,
}: {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  image: string;
  imageAlt: string;
  crumb: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        quality={45}
        sizes="(min-width: 768px) 70vw, 100vw"
        className="-z-20 object-cover opacity-45 blur-[2px] scale-105"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ebano/80 via-ebano/75 to-ebano" />
      <div className="contenedor">
        <nav aria-label="Migas de pan" className="animate-rise">
          <ol className="flex items-center gap-2 text-xs text-arena">
            <li><Link href="/" className="enlace hover:text-marfil">Inicio</Link></li>
            <li aria-hidden><ChevronRight size={12} /></li>
            <li aria-current="page" className="text-marfil/80">{crumb}</li>
          </ol>
        </nav>
        <p className="etiqueta mt-10 flex items-center gap-4 text-laton animate-rise" style={{ animationDelay: "100ms" }}>
          <span aria-hidden className="h-px w-10 bg-current opacity-60" />
          {kicker}
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl leading-[1.02] text-marfil animate-rise sm:text-6xl md:text-7xl" style={{ animationDelay: "180ms" }}>
          {title}
        </h1>
        {intro && (
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-marfil/75 animate-rise" style={{ animationDelay: "260ms" }}>
            {intro}
          </p>
        )}
        {children && <div className="mt-9 animate-rise" style={{ animationDelay: "340ms" }}>{children}</div>}
      </div>
    </section>
  );
}
