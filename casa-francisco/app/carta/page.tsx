import Image from "next/image";
import { menu, menuFootnote } from "@/data/menu";
import { PageHero } from "@/components/PageHero";
import { CartaNav } from "@/components/CartaNav";
import { MenuItem } from "@/components/MenuItem";
import { Reveal } from "@/components/Reveal";
import { AllergenLegend } from "@/components/Allergens";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, menuJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Carta",
  description:
    "Carta de Casa Francisco: entrantes, verduras a la brasa, pescado salvaje, carnes maduradas sobre encina y postres caseros. Precios con IVA incluido.",
  path: "/carta",
});

export default function CartaPage() {
  return (
    <>
      <JsonLd data={[menuJsonLd(), breadcrumbJsonLd([{ name: "Carta", path: "/carta" }])]} />
      <PageHero
        crumb="Carta"
        kicker="Cocina de temporada"
        title={
          <>
            La carta <em className="italic text-laton-claro">de la casa</em>
          </>
        }
        intro="Producto del mercado, brasa de encina y recetas que respetan el sabor. La carta cambia con las estaciones."
        image="/images/parrillada.jpg"
        imageAlt=""
      />

      <CartaNav sections={menu.map((s) => ({ id: s.id, title: s.title }))} />

      <div className="contenedor max-w-5xl py-16 md:py-24">
        {menu.map((section) => (
          <div key={section.id}>
            <section id={section.id} aria-labelledby={`${section.id}-t`} className="grid gap-6 py-12 md:grid-cols-[14rem_1fr] md:gap-12 md:py-16">
              <Reveal>
                <p className="font-serif text-5xl italic text-laton/70">{section.kicker}</p>
                <h2 id={`${section.id}-t`} className="mt-2 text-4xl leading-tight text-marfil">
                  {section.title}
                </h2>
                {section.intro && <p className="mt-3 text-sm leading-relaxed text-arena">{section.intro}</p>}
                {/* Fotos de los platos de esta sección, junto a su nombre y a tamaño real */}
                {section.dishes.some((d) => d.image) && (
                  <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-6">
                    {section.dishes
                      .filter((d) => d.image)
                      .map((d) => (
                        <figure key={d.id}>
                          <Image
                            src={d.image!}
                            alt={`${d.name}: ${d.description}`}
                            width={d.imageSize?.[0] ?? 600}
                            height={d.imageSize?.[1] ?? 450}
                            sizes="(min-width: 768px) 14rem, 50vw"
                            className="h-auto w-full"
                          />
                          <figcaption className="mt-2 font-serif text-base italic leading-snug text-arena">{d.name}</figcaption>
                        </figure>
                      ))}
                  </div>
                )}
              </Reveal>
              <div className="divide-y divide-marfil/10">
                {section.dishes.map((dish, i) => (
                  <Reveal key={dish.id} delay={Math.min(i, 4) * 50}>
                    <MenuItem dish={dish} />
                  </Reveal>
                ))}
              </div>
            </section>
          </div>
        ))}

        <p className="border-t border-marfil/10 pt-8 text-center font-serif text-lg italic text-arena">{menuFootnote}</p>
      </div>

      <section className="bg-lino py-16 text-tinta md:py-20">
        <div className="contenedor max-w-5xl">
          <AllergenLegend tone="claro" />
        </div>
      </section>

      <section className="py-20 text-center md:py-28">
        <div className="contenedor">
          <h2 className="text-4xl text-marfil md:text-5xl">¿Os apetece probarlo todo?</h2>
          <p className="mx-auto mt-4 max-w-lg text-arena">Nuestro menú degustación recorre la carta en nueve pases.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/reservas">Reservar mesa</ButtonLink>
            <ButtonLink href="/menu-degustacion" variant="secundario">Menú degustación</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
