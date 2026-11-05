// Catálogo de PRUEBA (dummy), con algunos productos ya usando FOTOS REALES de
// golary.co (nombres y precios también tomados de ahí). En la Fase 2 esto
// vendrá de la base de datos (Supabase).
import type { StaticImageData } from "next/image";
import ejemploProMatch from "@/assets/products/ejemplo-pro-match.jpg";
import ejemploNightGlow from "@/assets/products/ejemplo-night-glow.jpg";
import ejemploStrike from "@/assets/products/ejemplo-strike.jpg";
// Fotos REALES de producto (las que cargaste en src/assets/products):
import realProfesional from "@/assets/products/GOLARY-PRO-2.jpg";
import realVolleyball from "@/assets/products/GOLARY-VOLLEIBALL-2.jpg";
import realRookie from "@/assets/products/5ROCKYRJ2.jpg";
import realProMax from "@/assets/products/pmxams3.jpg";
import realChallenge from "@/assets/products/ch1.jpg";
import realChallengeFutsal from "@/assets/products/chm2-1.jpg";

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
  // Foto del producto. Si `photoReal` es true, es una foto REAL de fábrica.
  // Si no, es una foto de EJEMPLO (para dar una idea mientras llega la real).
  // Sin foto, se dibuja el balón con BallArt.
  image?: StaticImageData;
  photoReal?: boolean;
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
  { name: "Balón Fútbol Golary Pro Max", category: "futbol", kind: "futbol", price: 189900, colors: ["#facc15", "#dc2626"], sizes: ["5"], stock: 42,
    description: "Elaborado en material imperial de 2,2 mm exclusivo Golary: mayor suavidad, mejor rebote y una trayectoria estable.", image: realProMax, photoReal: true },
  { name: "Balón Fútbol Golary Challenge", category: "futbol", kind: "futbol", price: 165000, colors: ["#ffffff", "#1d4ed8"], sizes: ["5"], stock: 25, badge: "Nuevo",
    description: "Nuestra línea tope de gama: cubierta de alta resistencia y acabado premium para competencia.", image: realChallenge, photoReal: true },
  { name: "Balón Fútbol Golary Profesional", category: "futbol", kind: "futbol", price: 122000, colors: ["#facc15", "#111827"], sizes: ["4", "5"], stock: 80, badge: "Profesional",
    description: "Cubierta con laminado PU: excelente acabado y alta resistencia al roce en cualquier tipo de terreno.", image: realProfesional, photoReal: true },
  { name: "Balón Fútbol Golary Rookie", category: "futbol", kind: "futbol", price: 89900, colors: ["#dc2626", "#1e3a8a"], sizes: ["3", "4", "5"], stock: 120, badge: "Más vendido",
    description: "Neumático de butilo de dos capas, enmallado en nylon: resistente y económico para escuelas y clubes.", image: realRookie, photoReal: true },
  { name: "Balón Fútbol Golary Kids", category: "futbol", kind: "futbol", price: 49900, colors: ["#ffffff", "#e4002b"], sizes: ["3", "4"], stock: 64,
    description: "Más liviano para los más pequeños. Perfecto para iniciar." },
  { name: "Balón Fútbol Golary Night Glow", category: "futbol", kind: "futbol", price: 119900, colors: ["#a3e635", "#0b0b0c"], sizes: ["5"], stock: 18, badge: "Nuevo",
    description: "Colores de alta visibilidad para partidos nocturnos.", image: ejemploNightGlow },
  // Futsal
  { name: "Balón Futsal Golary Challenge", category: "futsal", kind: "futsal", price: 149900, colors: ["#facc15", "#1d4ed8"], sizes: ["3.5", "4"], stock: 35, badge: "Profesional",
    description: "Nuestra línea tope de gama para futsal: diseñado para competencia en coliseo, con rebote controlado.", image: realChallengeFutsal, photoReal: true },
  { name: "Balón Futsal Golary Control", category: "futsal", kind: "futsal", price: 89900, colors: ["#f97316", "#111827"], sizes: ["4"], stock: 58, badge: "Más vendido",
    description: "Agarre y control para jugadas rápidas en sintética." },
  { name: "Balón Futsal Golary Street", category: "futsal", kind: "futsal", price: 64900, oldPrice: 79900, colors: ["#111827", "#00a8e8"], sizes: ["4"], stock: 40, badge: "Oferta",
    description: "Resistente al asfalto y a superficies abrasivas." },
  { name: "Balón Futsal Golary Junior", category: "futsal", kind: "futsal", price: 54900, colors: ["#ffffff", "#7c3aed"], sizes: ["3.5"], stock: 26,
    description: "Tamaño reducido para categorías infantiles." },
  // Voleibol
  { name: "Balón Voleibol Golary Spike", category: "voleibol", kind: "voleibol", price: 129900, colors: ["#facc15", "#1d4ed8"], sizes: ["5"], stock: 30, badge: "Profesional",
    description: "Vuelo estable y tacto suave para competencia en sala." },
  { name: "Balón Voleibol Golary Soft Touch 3.0", category: "voleibol", kind: "voleibol", price: 107000, colors: ["#ffffff", "#ef4444"], sizes: ["4", "5"], stock: 55, badge: "Más vendido",
    description: "Tacto suave y vuelo estable, ideal para colegios y entrenamientos.", image: realVolleyball, photoReal: true },
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

// Mientras no hay fotos reales de cada producto, repartimos estas fotos de EJEMPLO
// entre todos los balones (no son el balón real; se reemplazan cuando lleguen las
// fotos de fábrica). Para agregar más, importa el archivo arriba y añádelo aquí.
const examplePhotos: StaticImageData[] = [ejemploProMatch, ejemploStrike, ejemploNightGlow];

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
  // "Importados" son de otras marcas: no les ponemos fotos con el logo Golary
  // (ni reales ni de ejemplo), se quedan con el balón ilustrado (BallArt).
  image: s.category === "importados" ? s.image : (s.image ?? examplePhotos[i % examplePhotos.length]),
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
