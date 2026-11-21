import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primario" | "secundario" | "fantasma" | "oscuro";

const base =
  "inline-flex items-center justify-center gap-2.5 min-h-12 px-7 text-[0.8rem] font-semibold uppercase tracking-[0.18em] transition-all duration-500 ease-[var(--ease-lujo)] disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primario: "bg-laton text-ebano hover:bg-laton-claro active:scale-[0.98]",
  secundario: "border border-laton/60 text-marfil hover:border-laton hover:bg-laton/10 active:scale-[0.98]",
  fantasma: "text-laton hover:text-laton-claro px-0 min-h-11",
  oscuro: "bg-ebano text-marfil hover:bg-nogal active:scale-[0.98]",
};

export function buttonClass(variant: Variant = "primario", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function ButtonLink({
  variant = "primario",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={buttonClass(variant, className)} {...props}>
      {children}
    </Link>
  );
}
