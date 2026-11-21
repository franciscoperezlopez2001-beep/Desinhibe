import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = { ...pageMetadata({ title: "Aviso legal", description: "Aviso legal de Casa Francisco.", path: "/aviso-legal" }), robots: { index: false } };

export default function Page() {
  return (
    <LegalPage title="Aviso legal">
      <h2>Titular de la web</h2>
      <ul>
        <li>Razón social: [PENDIENTE]</li>
        <li>NIF/CIF: [PENDIENTE]</li>
        <li>Domicilio: [PENDIENTE]</li>
        <li>Email de contacto: [PENDIENTE]</li>
        <li>Datos registrales: [PENDIENTE]</li>
      </ul>
      <h2>Objeto</h2>
      <p>Esta web informa sobre el restaurante Casa Francisco, su carta, menús y espacios, y permite solicitar reservas y eventos.</p>
      <h2>Precios</h2>
      <p>Los precios publicados incluyen IVA y pueden variar según temporada y mercado. Prevalecen los precios de la carta física del restaurante.</p>
      <h2>Propiedad intelectual</h2>
      <p>[PENDIENTE: confirmar la titularidad de textos, logotipo y fotografías utilizadas.]</p>
    </LegalPage>
  );
}
