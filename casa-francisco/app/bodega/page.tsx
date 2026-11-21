import Image from "next/image";
import { Users, Flame, Music2 } from "lucide-react";
import { site } from "@/data/site";
import { PageHero } from "@/components/PageHero";
import { WineList } from "@/components/WineList";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/Button";
import { Pending } from "@/components/Pending";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "La Bodega y carta de vinos",
  description:
    "La Bodega de Casa Francisco: sala bajo bóveda de ladrillo para cenas privadas y una selección de vinos de las principales denominaciones de origen españolas.",
  path: "/bodega",
});

export default function BodegaPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Bodega", path: "/bodega" }])} />
      <PageHero
        crumb="Bodega"
        kicker="Vinos y espacio privado"
        title={
          <>
            Bajo la <em className="italic text-laton-claro">bóveda</em>
          </>
        }
        intro="Ladrillo visto, luz de vela y una selección de vinos pensada para acompañar la brasa."
        image="/images/bodega.jpg"
        imageAlt=""
      />

      <section className="pb-24 md:pb-32">
        <div className="contenedor grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative aspect-[738/414] overflow-hidden [border-radius:50%_50%_0_0/34%_34%_0_0]">
            <Image
              src="/images/bodega.jpg"
              alt="Sala La Bodega con bóveda de ladrillo, lámpara de araña de cristal, velas y lamparitas de mesa"
              fill
              sizes="(min-width: 1024px) 40rem, 100vw"
              className="object-cover"
            />
          </Reveal>
          <div>
            <SectionHeading
              kicker="El espacio"
              title="Una sala con alma propia"
              intro="La Bodega es nuestra sala más íntima. Bajo su bóveda de ladrillo, la lámpara de araña y las velas crean el ambiente perfecto para una cena especial o una celebración privada."
            />
            <Reveal delay={120}>
              <ul className="mt-10 space-y-5">
                <li className="flex gap-4">
                  <Users size={20} strokeWidth={1.3} className="mt-1 shrink-0 text-laton" aria-hidden />
                  <span className="text-marfil/85">
                    Capacidad: {site.privateDining.pending ? <Pending>{site.privateDining.capacity}</Pending> : site.privateDining.capacity}
                  </span>
                </li>
                <li className="flex gap-4">
                  <Flame size={20} strokeWidth={1.3} className="mt-1 shrink-0 text-laton" aria-hidden />
                  <span className="text-marfil/85">Menús de grupo a medida o carta completa</span>
                </li>
                <li className="flex gap-4">
                  <Music2 size={20} strokeWidth={1.3} className="mt-1 shrink-0 text-laton" aria-hidden />
                  <span className="text-marfil/85">Uso privado para cumpleaños, pedidas y cenas de empresa</span>
                </li>
              </ul>
              <ButtonLink href="/eventos" className="mt-10">Reservar La Bodega</ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="vinos-t" className="bg-lino py-24 text-tinta md:py-32">
        <div className="contenedor max-w-5xl">
          <SectionHeading
            tone="claro"
            kicker="Carta de vinos"
            title={<span id="vinos-t">Una selección corta, bien elegida</span>}
            intro="De Rías Baixas a Jerez, pasando por Rioja, Ribera y Priorat. Nuestro equipo de sala os recomendará el vino perfecto para cada plato."
          />
          <div className="mt-14">
            <WineList />
          </div>
          <p className="mt-10 text-sm text-tinta-suave">
            Selección provisional por denominación de origen.{" "}
            <span className="border border-dashed border-laton-oscuro/60 px-1.5 font-mono text-xs text-laton-oscuro">[PENDIENTE: referencias reales de la bodega]</span>
          </p>
        </div>
      </section>
    </>
  );
}
