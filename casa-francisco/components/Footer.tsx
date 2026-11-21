import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import { nav, site, telHref, mailHref } from "@/data/site";
import { Monogram } from "./Monogram";
import { HoursList } from "./HoursList";
import { Pending } from "./Pending";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-laton/15 bg-ebano pb-28 pt-20 lg:pb-10">
      <div className="contenedor">
        <div className="flex flex-col items-center text-center">
          <Monogram className="h-16 w-auto text-laton" />
          <p className="mt-6 font-serif text-3xl italic text-marfil sm:text-4xl">{site.tagline}</p>
        </div>

        <div className="mt-16 grid gap-12 border-t border-marfil/10 pt-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="etiqueta text-laton">Visítanos</h2>
            <address className="mt-5 space-y-3 not-italic text-[0.95rem] leading-relaxed text-marfil/85">
              <p className="flex gap-3">
                <MapPin size={18} strokeWidth={1.4} className="mt-0.5 shrink-0 text-laton" aria-hidden />
                <span>
                  {site.address.pending ? (
                    <Pending>Dirección pendiente</Pending>
                  ) : (
                    <>
                      {site.address.street}
                      <br />
                      {site.address.postalCode} {site.address.locality}
                    </>
                  )}
                </span>
              </p>
              <p className="flex gap-3">
                <Phone size={18} strokeWidth={1.4} className="mt-0.5 shrink-0 text-laton" aria-hidden />
                {site.phone.pending ? <Pending>Teléfono pendiente</Pending> : <a className="enlace" href={telHref}>{site.phone.display}</a>}
              </p>
              <p className="flex gap-3">
                <Mail size={18} strokeWidth={1.4} className="mt-0.5 shrink-0 text-laton" aria-hidden />
                {site.email.pending ? <Pending>Email pendiente</Pending> : <a className="enlace" href={mailHref}>{site.email.value}</a>}
              </p>
            </address>
          </div>

          <div>
            <h2 className="etiqueta text-laton">Horario</h2>
            <div className="mt-5 text-marfil/85">
              <HoursList compact />
            </div>
          </div>

          <div>
            <h2 className="etiqueta text-laton">La casa</h2>
            <ul className="mt-5 space-y-2.5 text-[0.95rem]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link className="enlace text-marfil/85 hover:text-laton-claro" href={item.href}>
                    {item.label === "Degustación" ? "Menú degustación" : item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="enlace text-marfil/85 hover:text-laton-claro" href="/reservas">
                  Reservas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="etiqueta text-laton">Síguenos</h2>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-marfil/75">
              Platos de temporada, vinos nuevos en La Bodega y fechas especiales.
            </p>
            <div className="mt-5 flex gap-3">
              {site.social.instagram ? (
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Casa Francisco" className="grid h-11 w-11 place-items-center border border-laton/40 text-laton transition-colors hover:bg-laton hover:text-ebano">
                  <Instagram size={18} strokeWidth={1.4} />
                </a>
              ) : null}
              {site.social.facebook ? (
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook de Casa Francisco" className="grid h-11 w-11 place-items-center border border-laton/40 text-laton transition-colors hover:bg-laton hover:text-ebano">
                  <Facebook size={18} strokeWidth={1.4} />
                </a>
              ) : null}
              {site.social.pending && <Pending>Redes sociales pendientes</Pending>}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-marfil/10 pt-8 text-xs text-arena sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. Todos los derechos reservados.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link className="enlace hover:text-marfil" href="/aviso-legal">Aviso legal</Link></li>
            <li><Link className="enlace hover:text-marfil" href="/privacidad">Privacidad</Link></li>
            <li><Link className="enlace hover:text-marfil" href="/cookies">Cookies</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
