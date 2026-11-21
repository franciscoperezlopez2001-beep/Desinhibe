"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Phone } from "lucide-react";
import { telHref } from "@/data/site";

/** Barra fija inferior en móvil: las dos acciones que más convierten. */
export function MobileActionBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-laton/20 bg-ebano/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <Link href={telHref} className="flex min-h-14 items-center justify-center gap-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-marfil active:bg-nogal">
        <Phone size={17} strokeWidth={1.5} className="text-laton" aria-hidden /> Llamar
      </Link>
      <Link href="/reservas" className="flex min-h-14 items-center justify-center gap-2.5 bg-laton text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ebano active:bg-laton-claro">
        <CalendarDays size={17} strokeWidth={1.5} aria-hidden /> Reservar
      </Link>
    </div>
  );
}
