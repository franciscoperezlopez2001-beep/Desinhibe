/**
 * Selección de vinos (provisional).
 * Se usan denominaciones de origen y variedades genéricas: sustituir por las
 * referencias reales de la bodega cuando el restaurante facilite su carta.
 */

export type WineType = "tinto" | "blanco" | "espumoso" | "generoso";

export interface Wine {
  name: string;
  origin: string;
  grape: string;
  type: WineType;
  bottle?: number;
  glass?: number;
}

export const wineTypes: { id: WineType | "copa" | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "copa", label: "Por copa" },
  { id: "tinto", label: "Tintos" },
  { id: "blanco", label: "Blancos" },
  { id: "espumoso", label: "Espumosos" },
  { id: "generoso", label: "Generosos" },
];

export const wines: Wine[] = [
  // Tintos
  { name: "Rioja Crianza", origin: "D.O.Ca. Rioja", grape: "Tempranillo", type: "tinto", bottle: 28, glass: 6.5 },
  { name: "Ribera del Duero Roble", origin: "D.O. Ribera del Duero", grape: "Tinto fino", type: "tinto", bottle: 26, glass: 6 },
  { name: "Ribera del Duero Crianza", origin: "D.O. Ribera del Duero", grape: "Tinto fino", type: "tinto", bottle: 38 },
  { name: "Rioja Reserva", origin: "D.O.Ca. Rioja", grape: "Tempranillo, graciano", type: "tinto", bottle: 46 },
  { name: "Mencía de ladera", origin: "D.O. Bierzo", grape: "Mencía", type: "tinto", bottle: 34 },
  { name: "Toro Crianza", origin: "D.O. Toro", grape: "Tinta de Toro", type: "tinto", bottle: 42 },
  { name: "Priorat de pizarra", origin: "D.O.Q. Priorat", grape: "Garnacha, cariñena", type: "tinto", bottle: 68 },
  { name: "Rioja Gran Reserva", origin: "D.O.Ca. Rioja", grape: "Tempranillo", type: "tinto", bottle: 120 },
  // Blancos
  { name: "Albariño", origin: "D.O. Rías Baixas", grape: "Albariño", type: "blanco", bottle: 32, glass: 7 },
  { name: "Verdejo", origin: "D.O. Rueda", grape: "Verdejo", type: "blanco", bottle: 24, glass: 6 },
  { name: "Godello sobre lías", origin: "D.O. Valdeorras", grape: "Godello", type: "blanco", bottle: 38 },
  { name: "Verdejo fermentado en barrica", origin: "D.O. Rueda", grape: "Verdejo", type: "blanco", bottle: 44 },
  { name: "Blanco de parcela", origin: "D.O.Ca. Rioja", grape: "Viura, malvasía", type: "blanco", bottle: 60 },
  // Espumosos
  { name: "Cava Brut Nature", origin: "D.O. Cava", grape: "Macabeo, xarel·lo, parellada", type: "espumoso", bottle: 32, glass: 7 },
  { name: "Cava Gran Reserva", origin: "D.O. Cava", grape: "Xarel·lo, chardonnay", type: "espumoso", bottle: 54 },
  { name: "Champagne Brut", origin: "A.O.C. Champagne", grape: "Pinot noir, chardonnay", type: "espumoso", bottle: 90 },
  // Generosos y dulces
  { name: "Fino", origin: "D.O. Jerez", grape: "Palomino", type: "generoso", bottle: 30, glass: 6 },
  { name: "Amontillado", origin: "D.O. Jerez", grape: "Palomino", type: "generoso", glass: 8 },
  { name: "Oloroso", origin: "D.O. Jerez", grape: "Palomino", type: "generoso", glass: 8 },
  { name: "Pedro Ximénez", origin: "D.O. Montilla-Moriles", grape: "Pedro Ximénez", type: "generoso", glass: 9 },
];
