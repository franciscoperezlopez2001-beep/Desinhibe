export const tastingMenu = {
  name: "Fuego Lento",
  price: 85,
  pairing: 45,
  pairingPremium: 70,
  conditions: [
    "Se sirve a mesa completa",
    "Disponible en comida y cena",
    "Imprescindible reservar",
    "Duración aproximada: 2 h 30 min",
  ],
  courses: [
    { stage: "Bienvenida", dish: "Gilda de la casa y croqueta de jamón ibérico" },
    { stage: "Huerta", dish: "Tartar de tomate de temporada y helado de aceite" },
    { stage: "Mar", dish: "Carpaccio de gamba roja y cítricos" },
    { stage: "Brasa vegetal", dish: "Alcachofa confitada y jamón crujiente" },
    { stage: "Pescado", dish: "Lubina salvaje y pil-pil de sus espinas" },
    { stage: "Carne", dish: "Solomillo de vaca, foie y reducción de vino tinto y cereza" },
    { stage: "Prepostre", dish: "Sorbete de mandarina y hierbabuena" },
    { stage: "Postre", dish: "Torrija caramelizada y helado de leche merengada" },
    { stage: "Final", dish: "Petit fours y café o infusión" },
  ],
} as const;

export const groupMenus = [
  {
    name: "Menú Encina",
    price: 55,
    summary: "Para comidas de empresa y celebraciones informales.",
    items: [
      "Dos entrantes para compartir: croquetas de jamón ibérico y verduras de temporada a la brasa",
      "Principal a elegir: lubina salvaje, presa ibérica o arroz meloso (mín. 2 pax)",
      "Torrija caramelizada",
      "Vino de la casa, agua y café",
    ],
  },
  {
    name: "Menú Bodega",
    price: 75,
    summary: "Para cenas especiales en La Bodega.",
    items: [
      "Dos entrantes para compartir: jamón ibérico de bellota y carpaccio de gamba roja",
      "Principal a elegir: solomillo de vaca con foie, lubina salvaje o paletilla de cordero",
      "Tarta de queso a la brasa",
      "Selección de vinos D.O., agua y café",
    ],
  },
] as const;

export const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
