"use client";

import { useEffect, useRef, useState } from "react";

/** Índice fijo de la carta con resaltado de la sección visible. */
export function CartaNav({ sections }: { sections: { id: string; title: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  // Mantiene visible la pestaña activa en móvil (solo desplaza el índice, no la página)
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !el) return;
    list.scrollTo({ left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="Secciones de la carta" className="sticky top-[4.4rem] z-30 border-y border-laton/15 bg-ebano/95 backdrop-blur-md">
      <ul ref={listRef} className="contenedor flex gap-7 overflow-x-auto py-4 [scrollbar-width:none] md:justify-center md:gap-10">
        {sections.map((s) => (
          <li key={s.id} data-id={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`enlace whitespace-nowrap text-[0.75rem] font-semibold uppercase tracking-[0.2em] transition-colors ${
                active === s.id ? "text-laton" : "text-marfil/70 hover:text-marfil"
              }`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
