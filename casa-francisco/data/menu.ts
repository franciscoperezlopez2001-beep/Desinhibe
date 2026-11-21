/**
 * Carta de Casa Francisco.
 * Edita platos, descripciones y precios aquí: la web se actualiza sola.
 *
 * Los alérgenos son ORIENTATIVOS según la receta descrita y deben ser
 * validados por cocina antes de publicar (Reglamento UE 1169/2011).
 */

export type Allergen =
  | "gluten"
  | "crustaceos"
  | "huevo"
  | "pescado"
  | "cacahuete"
  | "soja"
  | "lacteos"
  | "frutos-cascara"
  | "apio"
  | "mostaza"
  | "sesamo"
  | "sulfitos"
  | "altramuces"
  | "moluscos";

export const allergenInfo: Record<Allergen, { label: string; code: string }> = {
  gluten: { label: "Gluten", code: "GL" },
  crustaceos: { label: "Crustáceos", code: "CR" },
  huevo: { label: "Huevo", code: "HU" },
  pescado: { label: "Pescado", code: "PE" },
  cacahuete: { label: "Cacahuetes", code: "CA" },
  soja: { label: "Soja", code: "SO" },
  lacteos: { label: "Lácteos", code: "LA" },
  "frutos-cascara": { label: "Frutos de cáscara", code: "FC" },
  apio: { label: "Apio", code: "AP" },
  mostaza: { label: "Mostaza", code: "MO" },
  sesamo: { label: "Sésamo", code: "SE" },
  sulfitos: { label: "Sulfitos", code: "SU" },
  altramuces: { label: "Altramuces", code: "AL" },
  moluscos: { label: "Moluscos", code: "MQ" },
};

export interface Dish {
  id: string;
  name: string;
  description: string;
  /** Precio en euros, IVA incluido */
  price: number;
  /** Sufijo de precio: "/ ud.", "/ kg", "/ pax"… */
  unit?: string;
  note?: string;
  allergens: Allergen[];
  /** Destacado en "Platos de la casa" */
  signature?: boolean;
  image?: string;
  /** Tamaño real de la foto [ancho, alto] para no deformarla */
  imageSize?: [number, number];
}

export interface MenuSection {
  id: string;
  title: string;
  kicker: string;
  intro?: string;
  dishes: Dish[];
}

export const menu: MenuSection[] = [
  {
    id: "para-empezar",
    title: "Para empezar",
    kicker: "I",
    intro: "Para abrir la mesa y compartir.",
    dishes: [
      {
        id: "croquetas",
        name: "Croquetas de jamón ibérico",
        description: "Bechamel cremosa de leche fresca y jamón de bellota. Seis unidades.",
        price: 14,
        allergens: ["gluten", "lacteos", "huevo"],
        signature: true,
      },
      {
        id: "jamon",
        name: "Jamón ibérico de bellota 100 %",
        description: "Cortado a cuchillo, con pan de cristal y tomate rallado.",
        price: 28,
        allergens: ["gluten"],
      },
      {
        id: "gilda",
        name: "Gilda de la casa",
        description: "Anchoa del Cantábrico, piparra y aceituna gordal.",
        price: 4.5,
        unit: "/ ud.",
        allergens: ["pescado", "sulfitos"],
      },
      {
        id: "tartar-tomate",
        name: "Tartar de tomate de temporada",
        description: "Tomate rosa, encurtidos y helado de aceite de oliva virgen extra.",
        price: 16,
        allergens: ["mostaza", "sulfitos", "lacteos"],
      },
      {
        id: "steak-tartar",
        name: "Steak tartar de vaca vieja",
        description: "Cortado a cuchillo, yema curada y patatas suflé.",
        price: 24,
        allergens: ["huevo", "mostaza", "sulfitos", "soja"],
        signature: true,
      },
      {
        id: "carpaccio-gamba",
        name: "Carpaccio de gamba roja",
        description: "Vinagreta de cítricos y su propio coral.",
        price: 26,
        allergens: ["crustaceos", "sulfitos"],
      },
      {
        id: "foie-brasa",
        name: "Foie a la brasa",
        description: "Compota de manzana asada y reducción de Pedro Ximénez.",
        price: 22,
        allergens: ["sulfitos"],
      },
    ],
  },
  {
    id: "huerto",
    title: "Del huerto y la brasa",
    kicker: "II",
    intro: "Verdura de temporada, tocada por el fuego de encina.",
    dishes: [
      {
        id: "verduras",
        name: "Verduras de temporada a la brasa",
        description: "Romesco ahumado y aceite de cebollino.",
        price: 18,
        allergens: ["frutos-cascara", "gluten"],
      },
      {
        id: "alcachofas",
        name: "Alcachofas confitadas",
        description: "Terminadas en brasa, con jamón ibérico crujiente.",
        price: 19,
        allergens: [],
      },
      {
        id: "puerros",
        name: "Puerros a la llama",
        description: "Vinagreta de avellana tostada y queso curado.",
        price: 15,
        allergens: ["frutos-cascara", "lacteos", "sulfitos"],
      },
    ],
  },
  {
    id: "mar",
    title: "Del mar",
    kicker: "III",
    intro: "Pescado salvaje de lonja, según llegue cada mañana.",
    dishes: [
      {
        id: "lubina",
        name: "Lubina salvaje a la brasa",
        description: "Pil-pil de sus espinas y verduras de temporada.",
        price: 32,
        allergens: ["pescado"],
      },
      {
        id: "rodaballo",
        name: "Rodaballo al sarmiento",
        description: "Entero, para compartir entre dos, con refrito de ajos y guindilla.",
        price: 72,
        note: "2 personas",
        allergens: ["pescado", "sulfitos"],
      },
      {
        id: "pulpo",
        name: "Pulpo a la brasa",
        description: "Parmentier de patata, pimentón de la Vera y aceite de oliva.",
        price: 26,
        allergens: ["moluscos", "lacteos"],
      },
      {
        id: "arroz-carabinero",
        name: "Arroz meloso de carabinero",
        description: "Fondo de cabezas tostadas y carabinero entero. Mínimo dos personas.",
        price: 34,
        unit: "/ pax",
        allergens: ["crustaceos", "pescado", "apio", "sulfitos"],
      },
    ],
  },
  {
    id: "brasa",
    title: "De la brasa",
    kicker: "IV",
    intro: "Carnes maduradas en casa y asadas sobre encina, sin prisa.",
    dishes: [
      {
        id: "solomillo-foie",
        name: "Solomillo de vaca con foie",
        description:
          "Reducción de vino tinto y cereza, crujiente de parmesano y crema de espinaca.",
        price: 36,
        allergens: ["lacteos", "sulfitos"],
        signature: true,
      },
      {
        id: "tournedo",
        name: "Tournedó de ternera",
        description: "Puré de patata trufado, espárrago verde y jugo de asado.",
        price: 32,
        allergens: ["lacteos", "sulfitos", "apio"],
        signature: true,
        image: "/images/tournedo.jpg",
        imageSize: [618, 495],
      },
      {
        id: "presa",
        name: "Presa ibérica de bellota",
        description: "Mojo verde y patatas panaderas.",
        price: 27,
        allergens: ["sulfitos"],
      },
      {
        id: "chuleton",
        name: "Chuletón de vaca madurada 45 días",
        description: "Servido sobre piedra caliente, con pimientos de Padrón y patatas.",
        price: 95,
        unit: "/ kg",
        allergens: [],
        signature: true,
      },
      {
        id: "parrillada",
        name: "Parrillada Casa Francisco",
        description:
          "Tabla para compartir: entraña, chorizo criollo, pollo de corral, pimiento asado y mazorca a la brasa.",
        price: 68,
        note: "2 personas",
        allergens: ["sulfitos"],
        signature: true,
        image: "/images/parrillada.jpg",
        imageSize: [509, 392],
      },
      {
        id: "cordero",
        name: "Paletilla de cordero lechal",
        description: "Asada lentamente en su jugo, con ensalada de lechugas.",
        price: 34,
        allergens: ["sulfitos"],
      },
    ],
  },
  {
    id: "postres",
    title: "Postres",
    kicker: "V",
    intro: "Para alargar la sobremesa.",
    dishes: [
      {
        id: "torrija",
        name: "Torrija caramelizada",
        description: "Brioche, helado de leche merengada.",
        price: 10,
        allergens: ["gluten", "lacteos", "huevo"],
      },
      {
        id: "tarta-queso",
        name: "Tarta de queso a la brasa",
        description: "Queso cremoso y frutos rojos.",
        price: 9,
        allergens: ["lacteos", "huevo", "gluten"],
      },
      {
        id: "chocolate",
        name: "Chocolate, aceite y sal",
        description: "Ganache de chocolate 70 %, aceite de oliva virgen extra y sal en escamas.",
        price: 11,
        allergens: ["lacteos", "soja"],
      },
      {
        id: "quesos",
        name: "Selección de quesos artesanos",
        description: "Membrillo casero y frutos secos.",
        price: 16,
        allergens: ["lacteos", "frutos-cascara"],
      },
    ],
  },
];

export const menuFootnote =
  "Pan de masa madre y aperitivo de bienvenida: 3,50 € por persona. Precios con IVA incluido.";

export const signatureDishes = menu.flatMap((s) => s.dishes).filter((d) => d.signature);

export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
  }).format(price);
}
