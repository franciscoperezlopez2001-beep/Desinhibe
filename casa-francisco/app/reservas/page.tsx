import { ExternalLink, Phone } from "lucide-react";
import { site, telHref } from "@/data/site";
import { PageHero } from "@/components/PageHero";
import { ReservationForm } from "@/components/forms/ReservationForm";
import { HoursList } from "@/components/HoursList";
import { ButtonLink, buttonClass } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { bookingWindow } from "@/lib/schedule";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Reservar mesa",
  description: "Reserva tu mesa en Casa Francisco: elige fecha, hora y sala (El Salón o La Bodega). Confirmación por email.",
  path: "/reservas",
});

const EXTERNAL = process.env.NEXT_PUBLIC_EXTERNAL_BOOKING_URL;

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ReservasPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const { min, max } = bookingWindow();

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Reservas", path: "/reservas" }])} />
      <PageHero
        crumb="Reservas"
        kicker="Reservas"
        title={
          <>
            Reserva <em className="italic text-laton-claro">tu mesa</em>
          </>
        }
        intro="Elige el día, la hora y la sala. Te confirmaremos la reserva por email."
        image="/images/salon.jpg"
        imageAlt=""
      />

      <section className="pb-24 md:pb-32">
        <div className="contenedor grid gap-16 lg:grid-cols-[1.4fr_0.6fr] lg:gap-20">
          <div>
            {EXTERNAL ? (
              <div className="border border-laton/30 p-8">
                <p className="text-lg text-marfil/85">Gestionamos las reservas a través de nuestra plataforma de reservas.</p>
                <a href={EXTERNAL} target="_blank" rel="noopener noreferrer" className={buttonClass("primario", "mt-6")}>
                  Reservar ahora <ExternalLink size={16} aria-hidden />
                </a>
              </div>
            ) : (
              <ReservationForm min={min} max={max} initial={{ date: one(sp.fecha), time: one(sp.hora), party: one(sp.personas) }} />
            )}
          </div>

          <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
            <div>
              <h2 className="etiqueta text-laton">Horario</h2>
              <div className="mt-5">
                <HoursList />
              </div>
            </div>
            <div className="border-t border-marfil/10 pt-8">
              <h2 className="etiqueta text-laton">¿Prefieres llamar?</h2>
              <p className="mt-4 text-sm leading-relaxed text-arena">
                Para reservas del mismo día, grupos o peticiones especiales, llámanos.
              </p>
              <ButtonLink href={telHref} variant="secundario" className="mt-5 w-full">
                <Phone size={16} strokeWidth={1.5} aria-hidden /> {site.phone.pending ? "Ver contacto" : site.phone.display}
              </ButtonLink>
            </div>
            <div className="border-t border-marfil/10 pt-8 text-sm leading-relaxed text-arena">
              <h2 className="etiqueta text-laton">Política de reservas</h2>
              <ul className="mt-4 space-y-2">
                <li>Mantenemos la mesa 15 minutos de cortesía.</li>
                <li>Si no puedes venir, avísanos para liberar la mesa.</li>
                <li>Grupos de más de {site.reservations.maxPartyOnline}: consulta nuestros eventos.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
