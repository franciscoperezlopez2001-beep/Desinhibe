import { Mail, MapPin, Phone } from "lucide-react";
import { site, telHref, mailHref } from "@/data/site";
import { PageHero } from "@/components/PageHero";
import { MapEmbed } from "@/components/MapEmbed";
import { HoursList } from "@/components/HoursList";
import { Pending } from "@/components/Pending";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contacto y ubicación",
  description: "Cómo llegar a Casa Francisco, horario, teléfono y formulario de contacto.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contacto", path: "/contacto" }])} />
      <PageHero
        crumb="Contacto"
        kicker="Contacto"
        title={
          <>
            Ven a <em className="italic text-laton-claro">vernos</em>
          </>
        }
        intro="Estamos para ayudarte con reservas, eventos o cualquier consulta."
        image="/images/bodega.jpg"
        imageAlt=""
      />

      <section className="pb-20">
        <div className="contenedor">
        <div className="grid gap-px overflow-hidden border border-marfil/10 bg-marfil/10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-ebano">
            <MapEmbed />
          </div>
          <div className="space-y-10 bg-ebano px-5 py-10 sm:px-8 lg:px-12">
            <ul className="space-y-6">
              <li className="flex gap-4">
                <MapPin size={20} strokeWidth={1.3} className="mt-1 shrink-0 text-laton" aria-hidden />
                <div>
                  <p className="etiqueta text-[0.62rem] text-arena">Dirección</p>
                  <address className="mt-1.5 not-italic text-lg text-marfil">
                    {site.address.pending ? <Pending>Dirección pendiente</Pending> : `${site.address.street}, ${site.address.postalCode} ${site.address.locality}`}
                  </address>
                </div>
              </li>
              <li id="telefono" className="flex gap-4">
                <Phone size={20} strokeWidth={1.3} className="mt-1 shrink-0 text-laton" aria-hidden />
                <div>
                  <p className="etiqueta text-[0.62rem] text-arena">Teléfono</p>
                  <p className="mt-1.5 text-lg text-marfil">
                    {site.phone.pending ? <Pending>Teléfono pendiente</Pending> : <a href={telHref} className="enlace">{site.phone.display}</a>}
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail size={20} strokeWidth={1.3} className="mt-1 shrink-0 text-laton" aria-hidden />
                <div>
                  <p className="etiqueta text-[0.62rem] text-arena">Email</p>
                  <p className="mt-1.5 text-lg text-marfil">
                    {site.email.pending ? <Pending>Email pendiente</Pending> : <a href={mailHref} className="enlace">{site.email.value}</a>}
                  </p>
                </div>
              </li>
            </ul>
            <div className="border-t border-marfil/10 pt-8">
              <h2 className="etiqueta text-laton">Horario</h2>
              <div className="mt-4"><HoursList /></div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section id="formulario" aria-labelledby="form-t" className="py-20 md:py-28">
        <div className="contenedor grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <SectionHeading kicker="Escríbenos" title={<span id="form-t">¿En qué podemos ayudarte?</span>} intro="Para reservar mesa, usa mejor el formulario de reservas: es más rápido." />
          <ContactForm />
        </div>
      </section>
    </>
  );
}
