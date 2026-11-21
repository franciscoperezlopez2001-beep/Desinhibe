import { ArrowRight } from "lucide-react";
import { site } from "@/data/site";
import { buttonClass } from "../Button";

/** Reserva rápida: lleva a /reservas con fecha y personas ya rellenas. Funciona sin JavaScript. */
export function QuickReserve({ min, max }: { min: string; max: string }) {
  return (
    <form action="/reservas" method="get" className="tema-oscuro grid gap-6 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <div>
        <label htmlFor="qr-fecha" className="etiqueta text-[0.64rem] text-arena">Fecha</label>
        <input id="qr-fecha" name="fecha" type="date" min={min} max={max} defaultValue={min} required className="campo [color-scheme:dark] text-lg" />
      </div>
      <div>
        <label htmlFor="qr-personas" className="etiqueta text-[0.64rem] text-arena">Personas</label>
        <select id="qr-personas" name="personas" defaultValue="2" className="campo text-lg">
          {Array.from({ length: site.reservations.maxPartyOnline }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "persona" : "personas"}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className={buttonClass("primario", "w-full md:w-auto")}>
        Ver horas disponibles <ArrowRight size={16} strokeWidth={1.6} aria-hidden />
      </button>
    </form>
  );
}
