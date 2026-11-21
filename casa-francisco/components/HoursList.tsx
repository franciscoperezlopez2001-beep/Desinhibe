import { site, weekdayNames, type Weekday } from "@/data/site";
import { PendingNote } from "./Pending";

// Orden de lunes a domingo
const order: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

function label(d: Weekday) {
  const services = site.hours.services[d];
  return services.length ? services.map((s) => `${s.from}–${s.to}`).join(" · ") : "Cerrado";
}

/** Agrupa días consecutivos con el mismo horario: "Martes – Jueves". */
function grouped() {
  const groups: { days: Weekday[]; text: string }[] = [];
  for (const d of order) {
    const text = label(d);
    const last = groups[groups.length - 1];
    if (last && last.text === text) last.days.push(d);
    else groups.push({ days: [d], text });
  }
  return groups.map((g) => ({
    name: g.days.length > 1 ? `${weekdayNames[g.days[0]]} – ${weekdayNames[g.days[g.days.length - 1]]}` : weekdayNames[g.days[0]],
    text: g.text,
  }));
}

export function HoursList({ tone = "oscuro", compact = false }: { tone?: "oscuro" | "claro"; compact?: boolean }) {
  const muted = tone === "claro" ? "text-tinta-suave" : "text-arena";
  const line = tone === "claro" ? "border-tinta/10" : "border-marfil/10";

  const rows = compact ? grouped() : order.map((d) => ({ name: weekdayNames[d], text: label(d) }));

  return (
    <div>
      <dl className={compact ? "space-y-3 text-sm" : "text-[0.95rem]"}>
        {rows.map((r) => {
          const closed = r.text === "Cerrado";
          return compact ? (
            <div key={r.name}>
              <dt className={muted}>{r.name}</dt>
              <dd className={`mt-0.5 tabular-nums ${closed ? `${muted} italic` : ""}`}>{r.text}</dd>
            </div>
          ) : (
            <div key={r.name} className={`flex justify-between gap-6 border-b py-2.5 ${line}`}>
              <dt className={muted}>{r.name}</dt>
              <dd className={`text-right tabular-nums ${closed ? `${muted} italic` : ""}`}>{r.text}</dd>
            </div>
          );
        })}
      </dl>
      {site.hours.pending && <PendingNote>Horario orientativo pendiente de confirmar. Las horas indican la última llegada aceptada.</PendingNote>}
    </div>
  );
}
