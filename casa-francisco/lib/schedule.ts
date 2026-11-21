import { site, type Weekday } from "@/data/site";

/** Fecha y minuto actuales en la zona horaria del restaurante. */
export function nowInRestaurant(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: site.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string) {
  if (!ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function weekdayOf(isoDate: string): Weekday {
  return new Date(`${isoDate}T12:00:00Z`).getUTCDay() as Weekday;
}

export function addDays(isoDate: string, days: number) {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export interface SlotGroup {
  service: string;
  slots: string[];
}

/** Franjas reservables para una fecha (vacío si el día no admite reservas). */
export function slotsFor(isoDate: string, now = new Date()): SlotGroup[] {
  if (!isIsoDate(isoDate)) return [];
  const today = nowInRestaurant(now);
  const { maxDaysAhead, minHoursAhead, slotMinutes } = site.reservations;

  if (isoDate < today.date || isoDate > addDays(today.date, maxDaysAhead)) return [];
  const weekday = weekdayOf(isoDate);
  if ((site.hours.closedDays as readonly number[]).includes(weekday)) return [];

  const earliest = isoDate === today.date ? today.minutes + minHoursAhead * 60 : -1;

  return site.hours.services[weekday]
    .map((service) => {
      const slots: string[] = [];
      for (let m = toMinutes(service.from); m <= toMinutes(service.to); m += slotMinutes) {
        if (m >= earliest) slots.push(toHHMM(m));
      }
      return { service: service.name, slots };
    })
    .filter((g) => g.slots.length > 0);
}

export function isSlotAvailable(isoDate: string, time: string, now = new Date()) {
  return slotsFor(isoDate, now).some((g) => g.slots.includes(time));
}

export function bookingWindow(now = new Date()) {
  const today = nowInRestaurant(now).date;
  return { min: today, max: addDays(today, site.reservations.maxDaysAhead) };
}

export function formatLongDate(isoDate: string) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T12:00:00Z`));
}
