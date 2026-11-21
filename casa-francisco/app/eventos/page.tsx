import Image from "next/image";
import { Check } from "lucide-react";
import { groupMenus } from "@/data/tasting";
import { site } from "@/data/site";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Pending } from "@/components/Pending";
import { EventForm } from "@/components/forms/EventForm";
import { JsonLd } from "@/components/JsonLd";
import { bookingWindow } from "@/lib/schedule";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Eventos privados y grupos",
  description:
    "Celebra tu evento en Casa Francisco: La Bodega en exclusiva, menús de grupo desde 55 € por persona para cumpleaños, pedidas y cenas de empresa.",
  path: "/eventos",
});

const occasions = ["Cumpleaños y aniversarios", "Pedidas y celebraciones familiares", "Comidas y cenas de empresa", "Presentaciones y eventos de marca"];

export default function EventosPage() {
  const { min } = bookingWindow();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Eventos", path: "/eventos" }])} />
      <PageHero
        crumb="Eventos"
        kicker="Eventos privados y grupos"
        title={
          <>
            Celebraciones <em className="italic text-laton-claro">a fuego lento</em>
          </>
        }
        intro="Un espacio propio, un menú pensado para vosotros y un equipo que se ocupa de todo."
        image="/images/bodega.jpg"
        imageAlt=""
      />

      <section className="pb-24 md:pb-32">
        <div className="contenedor grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              kicker="La Bodega en exclusiva"
              title="Vuestro propio rincón bajo la bóveda"
              intro={
                <>
                  Cerramos La Bodega para vosotros. Capacidad:{" "}
                  {site.privateDining.pending ? <Pending>{site.privateDining.capacity}</Pending> : site.privateDining.capacity} sentados.
                </>
              }
            />
            <Reveal delay={120}>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {occasions.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-marfil/85">
                    <Check size={16} className="mt-1 shrink-0 text-laton" aria-hidden /> {o}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="relative mx-auto aspect-[509/392] w-full max-w-[32rem] overflow-hidden lg:mx-0">
            <Image
              src="/images/parrillada.jpg"
              alt="Parrillada para compartir servida en la mesa de un grupo"
              fill
              sizes="(min-width: 1024px) 40rem, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="menus-grupo" className="bg-lino py-24 text-tinta md:py-32">
        <div className="contenedor">
          <SectionHeading tone="claro" align="center" kicker="Menús de grupo" title={<span id="menus-grupo">Para compartir mesa</span>} />
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
            {groupMenus.map((m, i) => (
              <Reveal key={m.name} delay={i * 120} className="flex flex-col border border-tinta/15 bg-white/40 p-8 md:p-10">
                <h3 className="font-serif text-4xl text-ebano">{m.name}</h3>
                <p className="mt-2 text-tinta-suave">{m.summary}</p>
                <p className="mt-6 font-serif text-5xl text-laton-oscuro">
                  {m.price} €<span className="ml-2 font-sans text-sm text-tinta-suave">/ persona</span>
                </p>
                <ul className="mt-8 flex-1 space-y-3 border-t border-tinta/10 pt-6">
                  {m.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[0.95rem] leading-relaxed text-tinta">
                      <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rotate-45 bg-laton-oscuro" />
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-tinta-suave">Menús para grupos a partir de 8 personas. IVA incluido. Adaptables a alergias y dietas.</p>
        </div>
      </section>

      <section id="solicitud" aria-labelledby="solicitud-t" className="py-24 md:py-32">
        <div className="contenedor grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <SectionHeading
            kicker="Solicitud"
            title={<span id="solicitud-t">Cuéntanos tu evento</span>}
            intro="Te responderemos en 48 horas laborables con una propuesta a medida, sin compromiso."
          />
          <EventForm min={min} />
        </div>
      </section>
    </>
  );
}
