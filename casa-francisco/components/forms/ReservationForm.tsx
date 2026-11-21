"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarPlus, Check, Loader2 } from "lucide-react";
import { site } from "@/data/site";
import { formatLongDate, slotsFor, weekdayOf } from "@/lib/schedule";
import { roomLabels } from "@/lib/validation";
import { Field, Honeypot, PrivacyCheck, aria } from "./Field";
import { FormAlert } from "./FormAlert";
import { Turnstile } from "./Turnstile";
import { useSubmit } from "./useSubmit";
import { buttonClass } from "../Button";

interface Props {
  initial: { date?: string; time?: string; party?: string };
  min: string;
  max: string;
}

export function ReservationForm({ initial, min, max }: Props) {
  const [date, setDate] = useState(initial.date && initial.date >= min && initial.date <= max ? initial.date : "");
  const [time, setTime] = useState(initial.time ?? "");
  const [party, setParty] = useState(initial.party ?? "2");
  const [room, setRoom] = useState<keyof typeof roomLabels>("indiferente");
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState<{ name: string; date: string; time: string; party: string; room: string } | null>(null);
  const { state, submit, errors, resetKey } = useSubmit("/api/reservas");

  const groups = useMemo(() => (date ? slotsFor(date) : []), [date]);
  const closedDay = date && groups.length === 0;
  const timeIsValid = groups.some((g) => g.slots.includes(time));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = String(new FormData(form).get("name") ?? "");
    const ok = await submit(form, { turnstileToken: token });
    if (ok) {
      setSummary({ name, date, time, party, room: roomLabels[room] });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (state.status === "success" && summary) {
    return <Confirmation {...summary} />;
  }

  const sending = state.status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="tema-oscuro relative space-y-12">
      <Honeypot />

      {/* Paso 1 */}
      <fieldset className="space-y-8">
        <legend className="flex items-baseline gap-4 font-serif text-3xl text-marfil">
          <span className="etiqueta text-[0.62rem] text-laton">01</span> Tu mesa
        </legend>

        <div className="grid gap-8 sm:grid-cols-2">
          <Field id="date" label="Fecha" error={errors.date}>
            <input
              {...aria("date", errors.date)}
              type="date"
              required
              min={min}
              max={max}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              className="campo [color-scheme:dark]"
            />
          </Field>
          <Field id="party" label="Personas" error={errors.party}>
            <select {...aria("party", errors.party)} value={party} onChange={(e) => setParty(e.target.value)} className="campo">
              {Array.from({ length: site.reservations.maxPartyOnline }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "persona" : "personas"}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className="-mt-4 text-xs text-arena">
          ¿Más de {site.reservations.maxPartyOnline} personas?{" "}
          <Link href="/eventos" className="enlace text-laton">
            Solicita un evento o menú de grupo
          </Link>
          .
        </p>

        {/* Horas */}
        <div>
          <p id="time-label" className="etiqueta text-[0.64rem] opacity-80">Hora de llegada</p>
          {!date && <p className="mt-3 text-sm text-arena">Elige primero una fecha para ver las horas disponibles.</p>}
          {closedDay && (
            <p className="mt-3 text-sm text-laton-claro" role="status">
              {(site.hours.closedDays as readonly number[]).includes(weekdayOf(date))
                ? "Ese día descansamos. Elige otra fecha."
                : "No quedan franjas online para esa fecha. Prueba otro día o llámanos."}
            </p>
          )}
          {groups.map((g) => (
            <div key={g.service} className="mt-5">
              <p className="text-sm text-arena">{g.service}</p>
              <div role="radiogroup" aria-labelledby="time-label" className="mt-3 flex flex-wrap gap-2">
                {g.slots.map((s) => (
                  <label key={s} className="relative">
                    <input
                      type="radio"
                      name="time"
                      value={s}
                      checked={time === s}
                      onChange={() => setTime(s)}
                      className="peer sr-only"
                    />
                    <span className="grid min-h-11 min-w-[4.5rem] cursor-pointer place-items-center border border-marfil/20 px-3 text-sm tabular-nums transition-colors hover:border-laton peer-checked:border-laton peer-checked:bg-laton peer-checked:text-ebano peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-laton">
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          {errors.time && (
            <p role="alert" className="mt-2 text-xs text-[#e0908a]">{errors.time}</p>
          )}
        </div>

        {/* Sala */}
        <div>
          <p id="room-label" className="etiqueta text-[0.64rem] opacity-80">Sala preferida</p>
          <div role="radiogroup" aria-labelledby="room-label" className="mt-3 grid gap-2 sm:grid-cols-3">
            {(Object.keys(roomLabels) as (keyof typeof roomLabels)[]).map((r) => (
              <label key={r} className="relative">
                <input type="radio" name="room" value={r} checked={room === r} onChange={() => setRoom(r)} className="peer sr-only" />
                <span className="flex min-h-14 cursor-pointer items-center justify-between gap-3 border border-marfil/20 px-4 text-sm transition-colors hover:border-laton peer-checked:border-laton peer-checked:bg-laton/10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-laton">
                  {roomLabels[r]}
                  {room === r && <Check size={16} className="text-laton" aria-hidden />}
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-arena">Intentaremos respetar tu preferencia según disponibilidad.</p>
        </div>
      </fieldset>

      {/* Paso 2 */}
      <fieldset className="space-y-8">
        <legend className="flex items-baseline gap-4 font-serif text-3xl text-marfil">
          <span className="etiqueta text-[0.62rem] text-laton">02</span> Tus datos
        </legend>
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id="name" label="Nombre y apellidos" error={errors.name} className="sm:col-span-2">
            <input {...aria("name", errors.name)} type="text" autoComplete="name" required maxLength={80} className="campo" />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <input {...aria("email", errors.email)} type="email" autoComplete="email" inputMode="email" required maxLength={120} className="campo" />
          </Field>
          <Field id="phone" label="Teléfono" error={errors.phone}>
            <input {...aria("phone", errors.phone)} type="tel" autoComplete="tel" inputMode="tel" required maxLength={20} className="campo" />
          </Field>
          <Field id="notes" label="Alergias, celebraciones u observaciones" error={errors.notes} optional className="sm:col-span-2">
            <textarea {...aria("notes", errors.notes)} rows={3} maxLength={600} className="campo resize-y" />
          </Field>
        </div>
        <PrivacyCheck error={errors.privacy} />
      </fieldset>

      <Turnstile onToken={setToken} resetKey={resetKey} />

      {state.status === "error" && <FormAlert message={state.message} />}

      <div className="flex flex-col gap-4 border-t border-marfil/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-arena" aria-live="polite">
          {date && timeIsValid ? (
            <>
              <span className="text-marfil">{formatLongDate(date)}</span> · {time} · {party} {party === "1" ? "persona" : "personas"}
            </>
          ) : (
            "Recibirás un email con tu solicitud."
          )}
        </p>
        <button type="submit" disabled={sending} className={buttonClass("primario", "w-full sm:w-auto")}>
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden /> Enviando…
            </>
          ) : (
            "Solicitar reserva"
          )}
        </button>
      </div>
    </form>
  );
}

function Confirmation({ name, date, time, party, room }: { name: string; date: string; time: string; party: string; room: string }) {
  const icsHref = useMemo(() => {
    const [y, m, d] = date.split("-");
    const [hh, mm] = time.split(":");
    const start = `${y}${m}${d}T${hh}${mm}00`;
    const endH = String(Math.min(23, Number(hh) + 2)).padStart(2, "0");
    const end = `${y}${m}${d}T${endH}${mm}00`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Casa Francisco//Reservas//ES",
      "BEGIN:VEVENT",
      `UID:${date}-${time}-${Math.random().toString(36).slice(2)}@casafrancisco`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART;TZID=Europe/Madrid:${start}`,
      `DTEND;TZID=Europe/Madrid:${end}`,
      `SUMMARY:Mesa en ${site.name} (${party} pax)`,
      "DESCRIPTION:Solicitud de reserva pendiente de confirmación.",
      site.address.pending ? "" : `LOCATION:${site.address.street}\\, ${site.address.locality}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  }, [date, time, party]);

  return (
    <div role="status" className="animate-fade-up border border-laton/30 bg-nogal/60 p-8 sm:p-12">
      <span className="grid h-14 w-14 place-items-center rounded-full border border-laton text-laton">
        <Check size={26} strokeWidth={1.4} aria-hidden />
      </span>
      <h2 className="mt-8 font-serif text-4xl text-marfil sm:text-5xl">Gracias, {name.split(" ")[0]}.</h2>
      <p className="mt-4 max-w-lg text-lg leading-relaxed text-marfil/80">
        Hemos recibido tu solicitud. Te enviaremos un email para <strong className="font-semibold text-laton-claro">confirmar la mesa</strong> en breve.
      </p>
      <dl className="mt-10 grid gap-6 border-y border-marfil/10 py-8 sm:grid-cols-2">
        {[
          ["Fecha", formatLongDate(date)],
          ["Hora", time],
          ["Personas", party],
          ["Sala", room],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="etiqueta text-[0.6rem] text-arena">{k}</dt>
            <dd className="mt-1.5 font-serif text-2xl capitalize text-marfil">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={icsHref} download="reserva-casa-francisco.ics" className={buttonClass("secundario")}>
          <CalendarPlus size={16} strokeWidth={1.5} aria-hidden /> Añadir al calendario
        </a>
        <Link href="/carta" className={buttonClass("fantasma", "px-4")}>
          Ver la carta
        </Link>
      </div>
    </div>
  );
}
