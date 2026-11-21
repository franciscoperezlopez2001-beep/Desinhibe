import type { ReactNode } from "react";

export function Field({
  id,
  label,
  error,
  hint,
  children,
  className = "",
  optional,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  optional?: boolean;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="etiqueta flex items-baseline justify-between text-[0.64rem] opacity-80">
        {label}
        {optional && <span className="font-sans text-[0.6rem] normal-case tracking-normal opacity-70">opcional</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs opacity-60">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-[#e0908a]">
          {error}
        </p>
      )}
    </div>
  );
}

/** Atributos ARIA para enlazar un campo con su error o ayuda. */
export function aria(id: string, error?: string, hint?: boolean) {
  return {
    id,
    name: id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  };
}

/** Campo trampa para bots: invisible para personas y lectores de pantalla. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="website">No rellenes este campo</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function PrivacyCheck({ error, tone = "oscuro" }: { error?: string; tone?: "oscuro" | "claro" }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed opacity-90">
        <input
          type="checkbox"
          name="privacy"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "privacy-error" : undefined}
          className={`mt-1 h-4 w-4 shrink-0 accent-[#C29A5B] ${tone === "claro" ? "" : ""}`}
        />
        <span>
          He leído y acepto la{" "}
          <a href="/privacidad" target="_blank" className="enlace underline-offset-2 text-laton">
            política de privacidad
          </a>
          . Usaremos tus datos solo para gestionar esta solicitud.
        </span>
      </label>
      {error && (
        <p id="privacy-error" role="alert" className="mt-1.5 text-xs text-[#e0908a]">
          {error}
        </p>
      )}
    </div>
  );
}
