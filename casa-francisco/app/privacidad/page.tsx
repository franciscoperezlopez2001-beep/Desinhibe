import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = { ...pageMetadata({ title: "Política de privacidad", description: "Política de privacidad de Casa Francisco.", path: "/privacidad" }), robots: { index: false } };

export default function Page() {
  return (
    <LegalPage title="Política de privacidad">
      <h2>Responsable del tratamiento</h2>
      <p>[PENDIENTE: razón social, NIF, domicilio y email del responsable.]</p>
      <h2>Qué datos recogemos</h2>
      <ul>
        <li><strong>Reservas:</strong> nombre, email, teléfono, fecha, hora, número de personas, sala y observaciones (que pueden incluir alergias).</li>
        <li><strong>Eventos:</strong> nombre, email, teléfono, fecha, número de invitados, tipo de evento, presupuesto y mensaje.</li>
        <li><strong>Contacto:</strong> nombre, email, asunto y mensaje.</li>
      </ul>
      <h2>Finalidad y base legal</h2>
      <p>Gestionar tu reserva o solicitud y comunicarnos contigo sobre ella. Base legal: tu consentimiento y la aplicación de medidas precontractuales a petición tuya. [PENDIENTE: validar con asesoría.]</p>
      <h2>Proveedores que tratan los datos</h2>
      <ul>
        <li>Alojamiento de la base de datos: Supabase. [PENDIENTE: región del proyecto]</li>
        <li>Envío de emails: Resend.</li>
        <li>Protección anti-spam: Cloudflare Turnstile.</li>
        <li>Alojamiento web: [PENDIENTE: p. ej. Vercel]</li>
      </ul>
      <h2>Conservación</h2>
      <p>[PENDIENTE: plazo de conservación de reservas y solicitudes.]</p>
      <h2>Tus derechos</h2>
      <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a [PENDIENTE: email], y reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>
    </LegalPage>
  );
}
