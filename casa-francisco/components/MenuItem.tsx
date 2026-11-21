import { formatPrice, type Dish } from "@/data/menu";
import { AllergenBadges } from "./Allergens";

export function MenuItem({ dish, tone = "oscuro" }: { dish: Dish; tone?: "oscuro" | "claro" }) {
  const claro = tone === "claro";
  return (
    <article className="group py-5">
      <div className={`flex items-baseline gap-3 ${claro ? "text-ebano" : "text-marfil"}`}>
        <h3 className="font-serif text-[1.35rem] leading-snug sm:text-2xl">
          {dish.name}
          {dish.note && <span className={`etiqueta ml-3 align-middle text-[0.6rem] ${claro ? "text-laton-oscuro" : "text-laton"}`}>{dish.note}</span>}
        </h3>
        <span aria-hidden className={`guia ${claro ? "text-tinta" : "text-marfil"}`} />
        <p className={`shrink-0 font-serif text-xl tabular-nums ${claro ? "text-laton-oscuro" : "text-laton"}`}>
          {formatPrice(dish.price)}
          {dish.unit && <span className={`ml-1 font-sans text-xs ${claro ? "text-tinta-suave" : "text-arena"}`}>{dish.unit}</span>}
        </p>
      </div>
      <p className={`mt-1.5 max-w-xl text-[0.95rem] leading-relaxed ${claro ? "text-tinta-suave" : "text-arena"}`}>{dish.description}</p>
      <AllergenBadges list={dish.allergens} tone={tone} />
    </article>
  );
}
