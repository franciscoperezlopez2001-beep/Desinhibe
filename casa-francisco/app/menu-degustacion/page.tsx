import Image from "next/image";
import { Clock, Users, CalendarCheck, Wine, UtensilsCrossed } from "lucide-react";
import { tastingMenu, romanNumerals } from "@/data/tasting";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Menú degustación Fuego Lento",
  description: `Menú degustación "Fuego Lento" de Casa Francisco: nueve pases de huerta, mar y brasa por ${tastingMenu.price} € por persona. Maridaje de vinos opcional.`,
  path: "/menu-degustacion",
});

const conditionIcons = [Users, UtensilsCrossed, CalendarCheck, Clock];

export default function TastingPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Menú degustación", path: "/menu-degustacion" }])} />
      <PageHero
        crumb="Menú degustación"
        kicker="Menú degustación"
        title={<em className="italic">{tastingMenu.name}</em>}
        intro="Nueve pases para recorrer, sin prisa, lo mejor de la temporada: de la huerta al mar y del mar a la brasa."
        image="/images/salon.jpg"
        imageAlt=""
      >
        <ButtonLink href="/reservas">Reservar el menú</ButtonLink>
      </PageHero>

      <section className="pb-24 md:pb-32">
        <div className="contenedor grid gap-16 lg:grid-cols-[1fr_22rem] lg:gap-24">
          <ol className="border-t border-marfil/10">
            {tastingMenu.courses.map((c, i) => (
              <Reveal as="li" key={c.stage} delay={i * 50} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-b border-marfil/10 py-7 md:grid-cols-[5rem_10rem_1fr] md:gap-8">
                <span className="font-serif text-3xl italic text-laton md:text-4xl" aria-hidden>
                  {romanNumerals[i]}
                </span>
                <span className="etiqueta col-start-2 text-[0.62rem] text-arena md:col-start-auto">
                  <span className="sr-only">Pase {i + 1}: </span>
                  {c.stage}
                </span>
                <span className="col-start-2 font-serif text-2xl leading-snug text-marfil md:col-start-auto md:text-[1.7rem]">{c.dish}</span>
              </Reveal>
            ))}
          </ol>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal className="border border-laton/30 p-8">
              <p className="etiqueta text-laton">Precio</p>
              <p className="mt-3 font-serif text-6xl text-marfil">
                {tastingMenu.price} €<span className="ml-2 font-sans text-sm text-arena">/ persona</span>
              </p>
              <dl className="mt-8 space-y-4 border-t border-marfil/10 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2.5 text-arena"><Wine size={16} strokeWidth={1.4} className="text-laton" aria-hidden /> Maridaje de vinos</dt>
                  <dd className="font-serif text-2xl text-marfil">+{tastingMenu.pairing} €</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2.5 text-arena"><Wine size={16} strokeWidth={1.4} className="text-laton" aria-hidden /> Maridaje premium</dt>
                  <dd className="font-serif text-2xl text-marfil">+{tastingMenu.pairingPremium} €</dd>
                </div>
              </dl>
              <ul className="mt-8 space-y-3 border-t border-marfil/10 pt-6 text-sm text-marfil/80">
                {tastingMenu.conditions.map((c, i) => {
                  const Icon = conditionIcons[i] ?? CalendarCheck;
                  return (
                    <li key={c} className="flex gap-3">
                      <Icon size={16} strokeWidth={1.4} className="mt-0.5 shrink-0 text-laton" aria-hidden /> {c}
                    </li>
                  );
                })}
              </ul>
              <ButtonLink href="/reservas" className="mt-8 w-full">Reservar</ButtonLink>
              <p className="mt-4 text-xs leading-relaxed text-arena">Indica en las observaciones de la reserva que deseáis el menú degustación y cualquier alergia.</p>
            </Reveal>
            <Reveal as="figure" delay={120} className="mt-6">
              <Image
                src="/images/bodega.jpg"
                alt="La Bodega de Casa Francisco: bóveda de ladrillo, lámpara de araña y mesas a la luz de las velas"
                width={738}
                height={414}
                sizes="22rem"
                className="h-auto w-full"
              />
              <figcaption className="mt-2 font-serif text-base italic text-arena">El menú también se puede disfrutar en La Bodega.</figcaption>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
