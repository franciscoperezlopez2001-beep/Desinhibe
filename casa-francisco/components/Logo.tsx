import Link from "next/link";
import { Monogram } from "./Monogram";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${className}`}>
      <Monogram className="h-9 w-auto shrink-0 sm:h-10 text-laton transition-colors duration-500 group-hover:text-laton-claro" />
      <span className="flex flex-col whitespace-nowrap leading-none">
        <span className="font-serif text-[1.3rem] sm:text-[1.45rem] tracking-[0.02em] text-marfil">Casa Francisco</span>
        <span className="etiqueta mt-1 text-[0.58rem] text-arena">Brasa · Bodega</span>
      </span>
    </Link>
  );
}
