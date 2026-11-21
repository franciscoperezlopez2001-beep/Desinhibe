import { LegalPage } from "@/components/LegalPage";
import { ReopenCookies } from "@/components/ReopenCookies";
import { pageMetadata } from "@/lib/seo";

export const metadata = { ...pageMetadata({ title: "Política de cookies", description: "Política de cookies de Casa Francisco.", path: "/cookies" }), robots: { index: false } };

export default function Page() {
  return (
    <LegalPage title="Política de cookies">
      <p>Esta web solo usa lo siguiente:</p>
      <h2>Técnicas (sin consentimiento)</h2>
      <ul>
        <li><strong>cf-cookies</strong> (almacenamiento local): recuerda tu elección sobre cookies.</li>
        <li><strong>Cloudflare Turnstile</strong>: protege los formularios frente a bots. Solo se carga en páginas con formulario.</li>
        <li><strong>cf_admin</strong>: sesión del panel interno del restaurante. No afecta a los visitantes.</li>
      </ul>
      <h2>De terceros (solo si aceptas)</h2>
      <ul>
        <li><strong>Google Maps</strong>: el mapa de ubicación. Si rechazas, puedes cargarlo manualmente con un clic.</li>
        <li><strong>Google Analytics</strong>: solo si el restaurante lo activa. Medición anónima de visitas.</li>
      </ul>
      <ReopenCookies />
    </LegalPage>
  );
}
