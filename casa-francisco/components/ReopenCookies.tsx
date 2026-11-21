"use client";

import { reopenBanner } from "./consent";

export function ReopenCookies() {
  return (
    <button type="button" onClick={reopenBanner} className="min-h-11 border border-laton/60 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-marfil hover:bg-laton/10">
      Cambiar preferencias de cookies
    </button>
  );
}
