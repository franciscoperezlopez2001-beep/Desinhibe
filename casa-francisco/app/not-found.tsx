import { ButtonLink } from "@/components/Button";
import { Monogram } from "@/components/Monogram";

export default function NotFound() {
  return (
    <div className="contenedor grid min-h-[80vh] place-items-center pt-28 text-center">
      <div>
        <Monogram className="mx-auto h-20 w-auto text-laton" />
        <p className="etiqueta mt-8 text-arena">Error 404</p>
        <h1 className="mt-4 text-5xl text-marfil md:text-6xl">Esta mesa no existe</h1>
        <p className="mx-auto mt-4 max-w-md text-arena">La página que buscas se ha movido o ya no está disponible.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Volver al inicio</ButtonLink>
          <ButtonLink href="/carta" variant="secundario">Ver la carta</ButtonLink>
        </div>
      </div>
    </div>
  );
}
