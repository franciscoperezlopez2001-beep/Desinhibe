import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDown, Flame, Sprout, Wine, Star } from "lucide-react";
import { site } from "@/data/site";
import { signatureDishes } from "@/data/menu";
import { tastingMenu } from "@/data/tasting";
import { ButtonLink } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { MenuItem } from "@/components/MenuItem";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { QuickReserve } from "@/components/forms/QuickReserve";
import { MapEmbed } from "@/components/MapEmbed";
import { HoursList } from "@/components/HoursList";
import { Pending } from "@/components/Pending";
import { bookingWindow } from "@/lib/schedule";
import { pageMetadata } from "@/lib/seo";
import { telHref } from "@/data/site";

export const revalidate = 3600;

export const metadata = {
  ...pageMetadata({
    title: "Restaurante de brasa y bodega",
    description:
      "Casa Francisco: cocina española de brasa de encina, producto de temporada, menú degustación y una bodega bajo bóveda de ladrillo. Reserva tu mesa online.",
    path: "/",
  }),
  title: { absolute: `${site.name} | Restaurante de brasa y bodega` },
};

const pillars = [
  {
    icon: Flame,
    title: "La brasa",
    text: "Encina seca, paciencia y fuego vivo. Carnes maduradas en casa, pescado salvaje y verdura que sabe a humo.",
  },
  {
    icon: Sprout,
    title: "La temporada",
    text: "La carta cambia cuando cambia el mercado. Cocinamos lo que está en su mejor momento, y nada más.",
  },
  {
    icon: Wine,
    title: "La bodega",
    text: "Una selección de denominaciones españolas pensada para la brasa, servida bajo una bóveda de ladrillo.",
  },
];

const gallery: GalleryImage[] = [
  {
    src: "/images/salon.jpg",
    alt: "Comedor de Casa Francisco con lámparas esféricas de latón, banquetas de piel y paredes de mosaico de madera",
    caption: "El Salón",
    width: 452,
    height: 678,
  },
  {
    src: "/images/bodega.jpg",
    alt: "Sala La Bodega bajo bóveda de ladrillo visto, con lámpara de araña de cristal y mesas a la luz de las velas",
    caption: "La Bodega",
    width: 738,
    height: 414,
  },
  {
    src: "/images/parrillada.jpg",
    alt: "Parrillada para compartir con entraña, chorizo criollo, pollo y pimiento asado sobre tabla de madera",
    caption: "Parrillada Casa Francisco",
    width: 509,
    height: 392,
  },
  {
    src: "/images/tournedo.jpg",
    alt: "Tournedó de ternera con puré de patata, espárrago verde y jugo de asado en plato de cerámica artesana",
    caption: "Tournedó de ternera",
    width: 618,
    height: 495,
  },
];

export default function HomePage() {
  const { min, max } = bookingWindow();

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-20 pt-32 lg:items-center lg:pb-16">
        {/* Halo de luz cálida, como el de las lámparas de latón */}
        <div aria-hidden className="absolute -right-40 top-1/4 -z-10 hidden h-[40rem] w-[40rem] rounded-full bg-laton/10 blur-[120px] lg:block" />

        <div className="contenedor grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative z-10 max-w-2xl">
            <p className="etiqueta flex items-center gap-4 text-laton animate-rise">
              <span aria-hidden className="h-px w-10 bg-current opacity-60" />
              Cocina de brasa · Bodega bajo bóveda
            </p>
            <h1 className="mt-7 text-[3.4rem] leading-[0.95] text-marfil animate-rise sm:text-7xl xl:text-[6.2rem]" style={{ animationDelay: "120ms" }}>
              Fuego, bodega <em className="block font-normal italic text-laton-claro">y tiempo.</em>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-marfil/80 animate-rise" style={{ animationDelay: "240ms" }}>
              Producto de temporada, brasa de encina y una bodega bajo bóveda para celebrar sin prisa.
            </p>
            <div className="mt-10 flex flex-col gap-3 animate-rise sm:flex-row" style={{ animationDelay: "360ms" }}>
              <ButtonLink href="/reservas">Reservar mesa</ButtonLink>
              <ButtonLink href="/carta" variant="secundario">
                Ver la carta
              </ButtonLink>
            </div>
          </div>

          {/* Foto: fondo a sangre en móvil, marco en arco en escritorio */}
          <div className="absolute inset-0 -z-20 lg:relative lg:inset-auto lg:z-0 lg:mx-auto lg:w-full lg:max-w-[28rem]">
            <div className="relative h-full w-full overflow-hidden lg:aspect-[2/3] lg:rounded-t-full lg:border lg:border-laton/30 lg:p-2.5">
              <div className="relative h-full w-full overflow-hidden lg:rounded-t-full">
                <Image
                  src="/images/salon.jpg"
                  alt="Comedor de Casa Francisco con lámparas esféricas de latón y banquetas de piel"
                  fill
                  priority
                  sizes="(min-width: 1024px) 28rem, 100vw"
                  className="object-cover animate-kenburns"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ebano via-ebano/70 to-ebano/30 lg:hidden" />
              </div>
            </div>
            <p className="etiqueta absolute -left-10 bottom-16 hidden origin-bottom-left -rotate-90 text-[0.6rem] text-arena lg:block">
              El Salón
            </p>
          </div>
        </div>

        <a href="#manifiesto" aria-label="Seguir bajando" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-arena transition-colors hover:text-laton lg:flex">
          <span className="etiqueta text-[0.58rem]">Descubrir</span>
          <ArrowDown size={16} strokeWidth={1.3} className="animate-bounce" />
        </a>
      </section>

      {/* ───────────── MANIFIESTO ───────────── */}
      <section id="manifiesto" className="bg-lino py-24 text-tinta md:py-36">
        <div className="contenedor grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionHeading
              tone="claro"
              kicker="La casa"
              title={
                <>
                  Cocinamos como se hacía antes: <em className="italic text-laton-oscuro">con tiempo.</em>
                </>
              }
            />
            <Reveal delay={120} className="mt-8 space-y-5 text-lg leading-relaxed text-tinta-suave">
              <p>
                En Casa Francisco el fuego marca el ritmo. Encendemos la brasa de encina antes de que llegue nadie y la dejamos hablar:
                un buen corte de vaca madurada, una lubina salvaje recién llegada de lonja, una alcachofa que pasa del aceite a la llama.
              </p>
              <p>
                Lo demás es la sobremesa. Mesas de madera, luz de vela y una bodega pensada para que la conversación se alargue.
              </p>
            </Reveal>
            <Reveal delay={200} className="mt-10">
              <Link href="/carta" className="enlace inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-laton-oscuro">
                Descubre la carta <ArrowRight size={16} aria-hidden />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={150} className="relative mx-auto w-full max-w-xl">
            <div aria-hidden className="absolute -right-4 -top-4 h-full w-full border border-laton-oscuro/40 md:-right-6 md:-top-6" />
            <div className="relative aspect-[618/495] overflow-hidden">
              <Image
                src="/images/tournedo.jpg"
                alt="Tournedó de ternera con puré de patata, espárrago verde y jugo de asado"
                fill
                sizes="(min-width: 1024px) 36rem, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 font-serif text-lg italic text-tinta-suave">Tournedó de ternera, puré trufado y jugo de asado.</p>
          </Reveal>
        </div>
      </section>

      {/* ───────────── PILARES ───────────── */}
      <section aria-labelledby="pilares-titulo" className="py-24 md:py-32">
        <div className="contenedor">
          <h2 id="pilares-titulo" className="sr-only">Lo que nos define</h2>
          <ul className="grid gap-px bg-marfil/10 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 120} className="bg-ebano px-2 py-10 md:px-10 md:py-4">
                <p.icon size={30} strokeWidth={1} className="text-laton" aria-hidden />
                <p className="etiqueta mt-8 text-[0.6rem] text-arena">{["I", "II", "III"][i]}</p>
                <h3 className="mt-2 font-serif text-4xl text-marfil">{p.title}</h3>
                <p className="mt-4 leading-relaxed text-arena">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── PLATOS DE LA CASA ───────────── */}
      <section aria-labelledby="platos-titulo" className="bg-nogal py-24 md:py-36">
        <div className="contenedor grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              kicker="Platos de la casa"
              title={<span id="platos-titulo">Lo que no se va de la carta</span>}
              intro="Los platos que nuestros clientes vuelven a pedir. El resto cambia con la temporada."
            />
            <Reveal delay={150} className="relative mt-12 aspect-[509/392] overflow-hidden">
              <Image
                src="/images/parrillada.jpg"
                alt="Parrillada Casa Francisco sobre tabla de madera con entraña, chorizo criollo, pollo de corral y pimiento asado"
                fill
                sizes="(min-width: 1024px) 34rem, 100vw"
                className="object-cover"
              />
            </Reveal>
          </div>
          <div>
            <div className="divide-y divide-marfil/10 border-y border-marfil/10">
              {signatureDishes.map((dish, i) => (
                <Reveal key={dish.id} delay={i * 60}>
                  <MenuItem dish={dish} />
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-10">
              <ButtonLink href="/carta" variant="secundario">
                Ver la carta completa <ArrowRight size={16} aria-hidden />
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── MENÚ DEGUSTACIÓN ───────────── */}
      <section aria-labelledby="degustacion-titulo" className="relative isolate overflow-hidden py-24 md:py-36">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(107,30,36,0.35),transparent_70%)]" />
        <div className="contenedor">
          <Reveal className="relative mx-auto max-w-4xl border border-laton/30 px-6 py-16 text-center md:px-16 md:py-20">
            <span aria-hidden className="absolute -top-px left-1/2 h-px w-24 -translate-x-1/2 bg-laton" />
            <p className="etiqueta text-laton">Menú degustación</p>
            <h2 id="degustacion-titulo" className="mt-6 text-6xl italic text-marfil md:text-8xl">
              {tastingMenu.name}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-marfil/75">
              Nueve pases que recorren la huerta, el mar y la brasa. Un viaje sin prisa por lo mejor de la temporada.
            </p>
            <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-3 divide-x divide-marfil/10">
              <div>
                <dt className="etiqueta text-[0.58rem] text-arena">Pases</dt>
                <dd className="mt-2 font-serif text-4xl text-marfil md:text-5xl">{tastingMenu.courses.length}</dd>
              </div>
              <div>
                <dt className="etiqueta text-[0.58rem] text-arena">Por persona</dt>
                <dd className="mt-2 font-serif text-4xl text-laton md:text-5xl">{tastingMenu.price} €</dd>
              </div>
              <div>
                <dt className="etiqueta text-[0.58rem] text-arena">Maridaje</dt>
                <dd className="mt-2 font-serif text-4xl text-marfil md:text-5xl">+{tastingMenu.pairing} €</dd>
              </div>
            </dl>
            <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/reservas">Reservar el menú</ButtonLink>
              <ButtonLink href="/menu-degustacion" variant="secundario">
                Ver los pases
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── LA BODEGA ───────────── */}
      <section aria-labelledby="bodega-titulo" className="pb-24 md:pb-36">
        <div className="contenedor grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <Reveal className="relative aspect-[738/414] overflow-hidden [border-radius:50%_50%_0_0/34%_34%_0_0]">
            <Image
              src="/images/bodega.jpg"
              alt="La Bodega de Casa Francisco: bóveda de ladrillo visto, lámpara de araña de cristal y mesas con velas"
              fill
              sizes="(min-width: 1024px) 46rem, 100vw"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ebano/50 to-transparent" />
          </Reveal>
          <div>
            <SectionHeading
              kicker="Espacio privado"
              title={<span id="bodega-titulo">La Bodega</span>}
              intro="Bajo una bóveda de ladrillo, a la luz de las velas y de una lámpara de araña de cristal. Para cenas íntimas, celebraciones y encuentros que merecen su propio espacio."
            />
            <Reveal delay={150} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/eventos">Reservar La Bodega</ButtonLink>
              <ButtonLink href="/bodega" variant="fantasma" className="sm:px-4">
                Nuestros vinos <ArrowRight size={16} aria-hidden />
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── GALERÍA ───────────── */}
      <section aria-labelledby="galeria-titulo" className="border-t border-marfil/10 py-24 md:py-32">
        <div className="contenedor">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading kicker="Galería" title={<span id="galeria-titulo">La casa por dentro</span>} />
          </div>
          <Reveal>
            <div className="mx-auto max-w-5xl">
              <Gallery images={gallery} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── OPINIONES (pendiente de reseñas reales) ───────────── */}
      <section aria-labelledby="opiniones-titulo" className="bg-lino py-20 text-tinta md:py-28">
        <div className="contenedor text-center">
          <div className="flex justify-center gap-1.5 text-laton-oscuro" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} strokeWidth={1.2} />
            ))}
          </div>
          <h2 id="opiniones-titulo" className="mt-6 text-4xl text-ebano md:text-5xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-tinta-suave">
            Este espacio mostrará opiniones reales y verificadas de Google.
          </p>
          <p className="mt-4">
            <span className="inline-block border border-dashed border-laton-oscuro/60 px-3 py-1.5 font-mono text-xs text-laton-oscuro">
              [PENDIENTE: reseñas reales de Google y enlace a la ficha]
            </span>
          </p>
        </div>
      </section>

      {/* ───────────── RESERVA RÁPIDA ───────────── */}
      <section aria-labelledby="reserva-titulo" className="py-24 md:py-32">
        <div className="contenedor">
          <div className="grid gap-12 border border-laton/25 bg-nogal/50 p-6 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:p-14">
            <div>
              <p className="etiqueta text-laton">Reservas</p>
              <h2 id="reserva-titulo" className="mt-4 text-4xl text-marfil md:text-5xl">
                Tu mesa, <em className="italic text-laton-claro">a un clic.</em>
              </h2>
              <p className="mt-4 text-arena">Elige fecha y comensales y te mostramos las horas disponibles.</p>
            </div>
            <QuickReserve min={min} max={max} />
          </div>
        </div>
      </section>

      {/* ───────────── UBICACIÓN Y HORARIO ───────────── */}
      <section aria-labelledby="ubicacion-titulo" className="pb-24 md:pb-32">
        <div className="contenedor">
        <div className="grid gap-px overflow-hidden border border-marfil/10 bg-marfil/10 lg:grid-cols-2">
          <div className="bg-ebano">
            <MapEmbed />
          </div>
          <div className="bg-ebano px-5 py-10 sm:px-8 lg:px-14 lg:py-12">
            <p className="etiqueta text-laton">Ubicación y horario</p>
            <h2 id="ubicacion-titulo" className="mt-4 text-4xl text-marfil md:text-5xl">
              Os esperamos en la mesa
            </h2>
            <address className="mt-6 not-italic text-marfil/85">
              {site.address.pending ? (
                <Pending>Dirección pendiente</Pending>
              ) : (
                <>
                  {site.address.street}, {site.address.postalCode} {site.address.locality}
                </>
              )}
            </address>
            <div className="mt-8">
              <HoursList />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/reservas">Reservar mesa</ButtonLink>
              <ButtonLink href={telHref} variant="secundario">
                {site.phone.pending ? "Contacto" : `Llamar · ${site.phone.display}`}
              </ButtonLink>
            </div>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
