// Catálogo de PRUEBA (dummy). En la Fase 2 esto vendrá de la base de datos (Supabase).
import type { StaticImageData } from "next/image";
import ejemploProMatch from "@/assets/products/ejemplo-pro-match.jpg";
import ejemploNightGlow from "@/assets/products/ejemplo-night-glow.jpg";
import ejemploStrike from "@/assets/products/ejemplo-strike.jpg";

export type BallKind = "futbol" | "futsal" | "voleibol" | "baloncesto" | "microfutbol";

export type Category = {
  slug: string;
  name: string;
  kind: BallKind;
  description: string;
  accent: string; // color para banners/tarjetas
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string; // slug de categoría
  kind: BallKind;
  price: number;
  oldPrice?: number;
  colors: [string, string]; // colores del diseño del balón [principal, secundario]
  sizes: string[];
  stock: number;
  rating: number;
  reviews: number;
  badge?: "Nuevo" | "Más vendido" | "Oferta" | "Profesional";
  description: string;
  features: string[];
  // Foto de EJEMPLO (no es un balón real de Golary todavía). Mientras no exista
  // la foto real del producto, se usa esta para dar una idea de cómo se vería;
  // si no hay ninguna, se dibuja el balón con BallArt.
  image?: StaticImageData;
};

export const categories: Category[] = [
  { slug: "futbol", name: "Fútbol", kind: "futbol", accent: "#00a8e8",
    description: "Balones de fútbol cosidos y termosellados, fabricados por nosotros." },
  { slug: "futsal", name: "Futsal", kind: "futsal", accent: "#111827",
    description: "Bote controlado y máximo agarre para cancha sintética y coliseo." },
  { slug: "voleibol", name: "Voleibol", kind: "voleibol", accent: "#f5b700",
    description: "Tacto suave y vuelo estable para sala y playa." },
  { slug: "baloncesto", name: "Baloncesto", kind: "baloncesto", accent: "#e8590c",
    description: "Agarre profundo para interior y exterior." },
  { slug: "microfutbol", name: "Microfútbol", kind: "microfutbol", accent: "#16a34a",
    description: "Balón de bajo rebote, el clásico de las canchas de barrio." },
  { slug: "importados", name: "Importados", kind: "futbol", accent: "#7c3aed",
    description: "Selección de marcas internacionales y artículos deportivos." },
];

type Seed = Omit<Product, "id" | "slug" | "rating" | "reviews" | "features"> & {
  features?: string[];
};

const featuresByKind: Record<BallKind, string[]> = {
  futbol: ["32 paneles", "Cámara de látex natural", "Cubierta en PU de alta resistencia", "Hecho en Colombia"],
  futsal: ["Bote controlado (bajo rebote)", "Cubierta en PU texturizada", "Ideal para coliseo y sintética", "Hecho en Colombia"],
  voleibol: ["18 paneles", "Tacto suave", "Cámara de butilo", "Hecho en Colombia"],
  baloncesto: ["Caucho de alto agarre", "Canales profundos", "Interior y exterior", "Hecho en Colombia"],
  microfutbol: ["Bajo rebote", "Costura reforzada", "Cubierta en PVC resistente", "Hecho en Colombia"],
};

const seeds: Seed[] = [
  // Fútbol
  { name: "Balón Fútbol Golary Pro Match", category: "futbol", kind: "futbol", price: 189900, colors: ["#ffffff", "#00a8e8"], sizes: ["5"], stock: 42, badge: "Profesional",
    description: "Nuestro balón de competencia. Termosellado para máxima precisión en el tiro y una trayectoria estable.", image: ejemploProMatch },
  { name: "Balón Fútbol Golary Strike", category: "futbol", kind: "futbol", price: 99900, oldPrice: 129900, colors: ["#ffffff", "#111827"], sizes: ["4", "5"], stock: 80, badge: "Oferta",
    description: "Cosido a máquina, ideal para entrenamientos intensos en grama natural y sintética.", image: ejemploStrike },
  { name: "Balón Fútbol Golary Training", category: "futbol", kind: "futbol", price: 69900, colors: ["#facc15", "#111827"], sizes: ["3", "4", "5"], stock: 120, badge: "Más vendido",
    description: "Resistente y económico para escuelas de fútbol y clubes." },
  { name: "Balón Fútbol Golary Kids", category: "futbol", kind: "futbol", price: 49900, colors: ["#ffffff", "#e4002b"], sizes: ["3", "4"], stock: 64,
    description: "Más liviano para los más pequeños. Perfecto para iniciar." },
  { name: "Balón Fútbol Golary Night Glow", category: "futbol", kind: "futbol", price: 119900, colors: ["#a3e635", "#0b0b0c"], sizes: ["5"], stock: 18, badge: "Nuevo",
    description: "Colores de alta visibilidad para partidos nocturnos.", image: ejemploNightGlow },
  // Futsal
  { name: "Balón Futsal Golary Indoor Pro", category: "futsal", kind: "futsal", price: 149900, colors: ["#ffffff", "#00a8e8"], sizes: ["3.5", "4"], stock: 35, badge: "Profesional",
    description: "Diseñado para competencia en coliseo, con rebote controlado." },
  { name: "Balón Futsal Golary Control", category: "futsal", kind: "futsal", price: 89900, colors: ["#f97316", "#111827"], sizes: ["4"], stock: 58, badge: "Más vendido",
    description: "Agarre y control para jugadas rápidas en sintética." },
  { name: "Balón Futsal Golary Street", category: "futsal", kind: "futsal", price: 64900, oldPrice: 79900, colors: ["#111827", "#00a8e8"], sizes: ["4"], stock: 40, badge: "Oferta",
    description: "Resistente al asfalto y a superficies abrasivas." },
  { name: "Balón Futsal Golary Junior", category: "futsal", kind: "futsal", price: 54900, colors: ["#ffffff", "#7c3aed"], sizes: ["3.5"], stock: 26,
    description: "Tamaño reducido para categorías infantiles." },
  // Voleibol
  { name: "Balón Voleibol Golary Spike", category: "voleibol", kind: "voleibol", price: 129900, colors: ["#facc15", "#1d4ed8"], sizes: ["5"], stock: 30, badge: "Profesional",
    description: "Vuelo estable y tacto suave para competencia en sala." },
  { name: "Balón Voleibol Golary Soft Touch", category: "voleibol", kind: "voleibol", price: 79900, colors: ["#ffffff", "#00a8e8"], sizes: ["4", "5"], stock: 55, badge: "Más vendido",
    description: "Ideal para colegios y entrenamientos." },
  { name: "Balón Voleibol Golary Beach", category: "voleibol", kind: "voleibol", price: 69900, colors: ["#fb7185", "#facc15"], sizes: ["5"], stock: 22, badge: "Nuevo",
    description: "Pensado para voleibol playa y recreación." },
  { name: "Balón Voleibol Golary School", category: "voleibol", kind: "voleibol", price: 44900, oldPrice: 54900, colors: ["#ffffff", "#16a34a"], sizes: ["4"], stock: 90, badge: "Oferta",
    description: "Liviano y durable para educación física." },
  // Baloncesto
  { name: "Balón Baloncesto Golary Dunk", category: "baloncesto", kind: "baloncesto", price: 139900, colors: ["#e8590c", "#111827"], sizes: ["6", "7"], stock: 28, badge: "Profesional",
    description: "Agarre profundo y bote consistente para competencia." },
  { name: "Balón Baloncesto Golary Street", category: "baloncesto", kind: "baloncesto", price: 84900, colors: ["#c2410c", "#111827"], sizes: ["7"], stock: 47, badge: "Más vendido",
    description: "Caucho resistente para canchas exteriores." },
  { name: "Balón Baloncesto Golary Kids", category: "baloncesto", kind: "baloncesto", price: 49900, colors: ["#00a8e8", "#111827"], sizes: ["5"], stock: 33, badge: "Nuevo",
    description: "Tamaño 5 para minibaloncesto." },
  // Microfútbol
  { name: "Balón Microfútbol Golary Clásico", category: "microfutbol", kind: "microfutbol", price: 59900, colors: ["#ffffff", "#111827"], sizes: ["3.8"], stock: 100, badge: "Más vendido",
    description: "El balón de bajo rebote de siempre, con la calidad Golary." },
  { name: "Balón Microfútbol Golary Barrio", category: "microfutbol", kind: "microfutbol", price: 44900, oldPrice: 52900, colors: ["#00a8e8", "#ffffff"], sizes: ["3.8"], stock: 75, badge: "Oferta",
    description: "Hecho para aguantar la cancha de cemento." },
  { name: "Balón Microfútbol Golary Torneo", category: "microfutbol", kind: "microfutbol", price: 74900, colors: ["#e4002b", "#ffffff"], sizes: ["3.8"], stock: 38,
    description: "Costura reforzada para torneos." },
  // Importados
  { name: "Balón Fútbol Importado Elite", category: "importados", kind: "futbol", price: 259900, colors: ["#ffffff", "#7c3aed"], sizes: ["5"], stock: 12, badge: "Nuevo",
    description: "Selección importada de alta gama." },
  { name: "Balón Baloncesto Importado Pro", category: "importados", kind: "baloncesto", price: 219900, colors: ["#b45309", "#0b0b0c"], sizes: ["7"], stock: 9,
    description: "Cuero sintético premium para interior." },
  { name: "Balón Voleibol Importado Match", category: "importados", kind: "voleibol", price: 199900, colors: ["#1d4ed8", "#facc15"], sizes: ["5"], stock: 10,
    description: "Balón de competencia internacional." },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const products: Product[] = seeds.map((s, i) => ({
  ...s,
  id: `p${i + 1}`,
  slug: slugify(s.name),
  rating: Math.round((4.1 + ((i * 37) % 9) / 10) * 10) / 10,
  reviews: 12 + ((i * 53) % 240),
  features: s.features ?? featuresByKind[s.kind],
  image: s.image,
}));

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const bestSellers = () => products.filter((p) => p.badge === "Más vendido");
export const newArrivals = () => products.filter((p) => p.badge === "Nuevo");
export const onSale = () => products.filter((p) => p.oldPrice);

export function searchProducts(q: string) {
  const t = slugify(q);
  if (!t) return [];
  return products.filter((p) => slugify(`${p.name} ${p.category}`).includes(t));
}
