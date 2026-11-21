/**
 * Muestra un dato pendiente de facilitar por el restaurante con un estilo
 * claramente provisional, para que nunca se confunda con información real.
 */
export function Pending({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block border border-dashed border-laton/50 px-1.5 py-0.5 font-mono text-[0.72em] tracking-normal text-laton-claro ${className}`}
      title="Dato pendiente de confirmar por el restaurante"
    >
      {children}
    </span>
  );
}

export function PendingNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 flex items-start gap-2 text-xs text-arena">
      <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-laton/70" />
      {children}
    </p>
  );
}
