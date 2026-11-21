/**
 * Datos del negocio.
 *
 * IMPORTANTE: todo lo marcado como `pending: true` o con el texto "[PENDIENTE…]"
 * son datos que el restaurante debe facilitar. No se han inventado.
 * Al rellenarlos, cambia `pending` a `false` y la marca visible desaparecerá.
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface Service {
  name: "Comida" | "Cena";
  /** Primera y última hora de llegada aceptada, formato HH:MM */
  from: string;
  to: string;
}

export const site = {
  name: "Casa Francisco",
  tagline: "Fuego, bodega y tiempo.",
  description:
    "Restaurante de cocina española de brasa y bodega. Producto de temporada, brasa de encina y una bodega bajo bóveda de ladrillo para celebrar sin prisa.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "es_ES",

  city: { value: "[PENDIENTE: ciudad]", pending: true },
  address: {
    street: "[PENDIENTE: calle y número]",
    postalCode: "[PENDIENTE: CP]",
    locality: "[PENDIENTE: ciudad]",
    region: "[PENDIENTE: provincia]",
    country: "ES",
    pending: true,
  },
  /** Coordenadas para el mapa y Schema.org. null mientras no se confirmen. */
  geo: null as null | { lat: number; lng: number },

  phone: { display: "[PENDIENTE: teléfono]", e164: "", pending: true },
  email: { value: "[PENDIENTE: email]", pending: true },

  social: {
    instagram: "", // p. ej. https://instagram.com/casafrancisco
    facebook: "",
    pending: true,
  },

  chef: { value: "[PENDIENTE: nombre del chef]", pending: true },

  /**
   * Horario de servicio. Estos valores son un PUNTO DE PARTIDA HABITUAL en
   * restauración y sirven para que el formulario de reservas funcione.
   * Deben confirmarse con el restaurante (pending: true muestra un aviso).
   */
  hours: {
    pending: true,
    closedDays: [1] as Weekday[], // lunes
    services: {
      0: [{ name: "Comida", from: "13:30", to: "15:30" }],
      1: [],
      2: [
        { name: "Comida", from: "13:30", to: "15:30" },
        { name: "Cena", from: "20:30", to: "22:45" },
      ],
      3: [
        { name: "Comida", from: "13:30", to: "15:30" },
        { name: "Cena", from: "20:30", to: "22:45" },
      ],
      4: [
        { name: "Comida", from: "13:30", to: "15:30" },
        { name: "Cena", from: "20:30", to: "22:45" },
      ],
      5: [
        { name: "Comida", from: "13:30", to: "15:30" },
        { name: "Cena", from: "20:30", to: "23:15" },
      ],
      6: [
        { name: "Comida", from: "13:30", to: "16:00" },
        { name: "Cena", from: "20:30", to: "23:15" },
      ],
    } as Record<Weekday, Service[]>,
  },

  reservations: {
    maxPartyOnline: 10,
    maxDaysAhead: 60,
    minHoursAhead: 2,
    slotMinutes: 15,
  },

  privateDining: { capacity: "[PENDIENTE: nº de comensales]", pending: true },

  timezone: "Europe/Madrid",
} as const;

export const weekdayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

export const nav = [
  { href: "/carta", label: "Carta" },
  { href: "/menu-degustacion", label: "Degustación" },
  { href: "/bodega", label: "Bodega" },
  { href: "/eventos", label: "Eventos" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const telHref = site.phone.e164 ? `tel:${site.phone.e164}` : "/contacto#telefono";
export const mailHref = site.email.pending ? "/contacto#formulario" : `mailto:${site.email.value}`;
