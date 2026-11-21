"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/data/menu";
import { wines, wineTypes, type Wine } from "@/data/wines";

export function WineList() {
  const [filter, setFilter] = useState<(typeof wineTypes)[number]["id"]>("todos");

  const list = useMemo<Wine[]>(() => {
    if (filter === "todos") return wines;
    if (filter === "copa") return wines.filter((w) => w.glass);
    return wines.filter((w) => w.type === filter);
  }, [filter]);

  return (
    <div>
      <div role="group" aria-label="Filtrar vinos" className="flex flex-wrap gap-2">
        {wineTypes.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={filter === t.id}
            onClick={() => setFilter(t.id)}
            className={`min-h-11 border px-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
              filter === t.id ? "border-laton bg-laton text-ebano" : "border-tinta/20 text-tinta hover:border-laton-oscuro"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">{list.length} vinos</p>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">Carta de vinos</caption>
          <thead>
            <tr className="etiqueta border-b border-tinta/20 text-[0.62rem] text-tinta-suave">
              <th scope="col" className="py-3 font-semibold">Vino</th>
              <th scope="col" className="py-3 text-right font-semibold">Copa</th>
              <th scope="col" className="py-3 text-right font-semibold">Botella</th>
            </tr>
          </thead>
          <tbody>
            {list.map((w) => (
              <tr key={w.name + w.origin} className="border-b border-tinta/10 align-top">
                <td className="py-4 pr-4">
                  <p className="font-serif text-xl text-ebano">{w.name}</p>
                  <p className="mt-0.5 text-sm text-tinta-suave">{w.origin} · {w.grape}</p>
                </td>
                <td className="py-4 text-right font-serif text-lg tabular-nums text-laton-oscuro">{w.glass ? formatPrice(w.glass) : "—"}</td>
                <td className="py-4 pl-6 text-right font-serif text-lg tabular-nums text-laton-oscuro">{w.bottle ? formatPrice(w.bottle) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
