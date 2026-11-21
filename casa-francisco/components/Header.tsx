"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { nav, site, telHref } from "@/data/site";
import { Logo } from "./Logo";
import { ButtonLink } from "./Button";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú al cambiar de página
  useEffect(() => setOpen(false), [pathname]);

  // Bloqueo de scroll, Escape y foco atrapado dentro del menú móvil
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panel) {
        // El botón de cerrar (en la cabecera) forma parte del ciclo de foco
        const items = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>("a, button")].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a
        href="#contenido"
        className="fixed left-4 top-4 z-[70] -translate-y-24 bg-laton px-4 py-2 text-sm font-semibold text-ebano transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[53] transition-all duration-700 ease-[var(--ease-lujo)] ${
          scrolled && !open
            ? "border-b border-laton/15 bg-ebano/92 py-3 backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-ebano/70 to-transparent py-5 md:py-7"
        }`}
      >
        <div className="contenedor flex items-center justify-between gap-6">
          <Logo className="relative z-[55]" />

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`enlace text-[0.78rem] font-medium uppercase tracking-[0.2em] transition-colors hover:text-laton-claro ${
                      isActive(item.href) ? "text-laton" : "text-marfil/90"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ButtonLink href="/reservas" className="!min-h-11 !px-6">
                Reservar mesa
              </ButtonLink>
            </div>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="relative z-[55] grid h-12 w-12 place-items-center text-marfil transition-colors hover:text-laton lg:hidden"
            >
              {open ? <X size={26} strokeWidth={1.3} /> : <Menu size={26} strokeWidth={1.3} />}
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil a pantalla completa */}
      <div
        id="menu-movil"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        hidden={!open}
        className="fixed inset-0 z-[52] flex flex-col overflow-y-auto bg-ebano px-6 pb-10 pt-28 lg:hidden"
      >
        <nav aria-label="Móvil" className="flex-1">
          <ul className="space-y-1">
            {[{ href: "/", label: "Inicio" }, ...nav].map((item, i) => (
              <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${80 + i * 60}ms` }}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`flex items-baseline gap-4 border-b border-marfil/10 py-4 font-serif text-[2.1rem] leading-none transition-colors hover:text-laton ${
                    pathname === item.href ? "text-laton" : "text-marfil"
                  }`}
                >
                  <span className="etiqueta w-6 text-[0.6rem] text-arena">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 grid gap-3 animate-fade-up" style={{ animationDelay: "520ms" }}>
          <ButtonLink href="/reservas">Reservar mesa</ButtonLink>
          <ButtonLink href={telHref} variant="secundario">
            <Phone size={16} strokeWidth={1.5} aria-hidden /> Llamar
          </ButtonLink>
          <p className="mt-4 text-center text-sm text-arena">{site.tagline}</p>
        </div>
      </div>
    </>
  );
}
