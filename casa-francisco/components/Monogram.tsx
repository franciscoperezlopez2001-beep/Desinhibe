/** Monograma "CF" dentro de un arco: eco de la bóveda de ladrillo de La Bodega. */
export function Monogram({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 44 52"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      <path d="M2 51V22a20 20 0 0 1 40 0v29" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 51V22.5a15.5 15.5 0 0 1 31 0V51" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
      <text
        x="22"
        y="37"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="17"
        fontWeight="500"
        letterSpacing="0.5"
      >
        CF
      </text>
    </svg>
  );
}
