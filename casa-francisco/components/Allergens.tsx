import { allergenInfo, type Allergen } from "@/data/menu";

export function AllergenBadges({ list, tone = "oscuro" }: { list: Allergen[]; tone?: "oscuro" | "claro" }) {
  if (!list.length) return null;
  const style = tone === "claro" ? "border-tinta/25 text-tinta-suave" : "border-marfil/20 text-arena";
  return (
    <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Alérgenos">
      {list.map((a) => (
        <li
          key={a}
          title={allergenInfo[a].label}
          className={`grid h-6 min-w-6 place-items-center rounded-full border px-1 text-[0.58rem] font-semibold tracking-wide ${style}`}
        >
          <span aria-hidden>{allergenInfo[a].code}</span>
          <span className="sr-only">{allergenInfo[a].label}</span>
        </li>
      ))}
    </ul>
  );
}

export function AllergenLegend({ tone = "oscuro" }: { tone?: "oscuro" | "claro" }) {
  const entries = Object.values(allergenInfo);
  const style = tone === "claro" ? "border-tinta/25 text-tinta-suave" : "border-marfil/20 text-arena";
  return (
    <div>
      <h2 className={`etiqueta ${tone === "claro" ? "text-laton-oscuro" : "text-laton"}`}>Alérgenos</h2>
      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-7">
        {entries.map((a) => (
          <li key={a.code} className={`flex items-center gap-2 text-xs ${tone === "claro" ? "text-tinta-suave" : "text-arena"}`}>
            <span aria-hidden className={`grid h-6 min-w-6 place-items-center rounded-full border px-1 text-[0.58rem] font-semibold ${style}`}>{a.code}</span>
            {a.label}
          </li>
        ))}
      </ul>
      <p className={`mt-5 text-xs leading-relaxed ${tone === "claro" ? "text-tinta-suave" : "text-arena"}`}>
        Si tienes alguna alergia o intolerancia, avísanos al reservar y al llegar: adaptamos los platos siempre que es posible.
        <span className="ml-1 border border-dashed border-current/50 px-1 font-mono">[PENDIENTE: validar alérgenos con cocina]</span>
      </p>
    </div>
  );
}
