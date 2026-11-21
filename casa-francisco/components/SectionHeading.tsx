import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeading({
  kicker,
  title,
  intro,
  align = "left",
  tone = "oscuro",
  as: Tag = "h2",
}: {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "oscuro" | "claro";
  as?: "h1" | "h2";
}) {
  const centered = align === "center";
  return (
    <Reveal className={`${centered ? "mx-auto text-center" : ""} max-w-2xl`}>
      <p className={`etiqueta flex items-center gap-4 ${centered ? "justify-center" : ""} ${tone === "claro" ? "text-laton-oscuro" : "text-laton"}`}>
        <span aria-hidden className="h-px w-10 bg-current opacity-60" />
        {kicker}
        {centered && <span aria-hidden className="h-px w-10 bg-current opacity-60" />}
      </p>
      <Tag className={`mt-5 text-[2.4rem] leading-[1.05] sm:text-5xl md:text-[3.5rem] ${tone === "claro" ? "text-ebano" : "text-marfil"}`}>
        {title}
      </Tag>
      {intro && (
        <p className={`mt-6 text-base leading-relaxed sm:text-lg ${tone === "claro" ? "text-tinta-suave" : "text-arena"}`}>{intro}</p>
      )}
    </Reveal>
  );
}
