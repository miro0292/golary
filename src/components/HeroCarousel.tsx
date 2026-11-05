"use client";

import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Hexagon, ShoppingCart } from "lucide-react";
import fotoFutbol from "@/assets/products/ch1.jpg";
import fotoProfesional from "@/assets/products/GOLARY-PRO-2.jpg";
import fotoProMax from "@/assets/products/pmxams3.jpg";

// Contenido real tomado de golary.co (balones GOLARY FUTBOL / PROFESIONAL / PRO MAX):
// las fotos son de ejemplo mientras llegan las de fábrica.
type Slide = {
  kicker: string;
  title: string;
  image: StaticImageData;
  glow: string; // color del resplandor detrás del balón
  features: { label: string; text: string }[];
  href: string;
};

const slides: Slide[] = [
  {
    kicker: "GOLARY",
    title: "CHALLENGE",
    image: fotoFutbol,
    glow: "#3b82f6",
    href: "/producto/balon-futbol-golary-challenge",
    features: [
      { label: "+ RESISTENCIA", text: "Neumático de butilo de dos capas, enmallado en nylon, cubierta interna de caucho, hermética. Apto para todo tipo de terreno." },
      { label: "+ CONTROL", text: "Relieve diseñado en un patrón que proporciona superioridad durante el vuelo." },
      { label: "OFICIAL FÚTBOL N.°5", text: "Circunferencia de 68 a 70 cm · Peso de 410 a 450 gramos." },
    ],
  },
  {
    kicker: "GOLARY",
    title: "PROFESIONAL",
    image: fotoProfesional,
    glow: "#facc15",
    href: "/producto/balon-futbol-golary-profesional",
    features: [
      { label: "+ RESISTENCIA", text: "Neumático de butilo de dos capas, enmallado en nylon, cubierta interna de caucho, hermética." },
      { label: "EXTERIOR", text: "Cubierta con laminado PU, que brinda un excelente acabado y alta resistencia al roce en cualquier terreno." },
      { label: "OFICIAL FÚTBOL N.°4", text: "Circunferencia de 64 a 66 cm · Peso de 350 a 400 gramos." },
    ],
  },
  {
    kicker: "GOLARY",
    title: "PRO MAX",
    image: fotoProMax,
    glow: "#dc2626",
    href: "/producto/balon-futbol-golary-pro-max",
    features: [
      { label: "+ RESISTENCIA", text: "Neumático de butilo de dos capas, enmallado en nylon, cubierta interna de caucho, hermética." },
      { label: "+ SUAVIDAD", text: "Elaborado en material imperial de 2.2 mm exclusivo Golary, que da mayor suavidad y mejor rebote." },
      { label: "OFICIAL FÚTBOL N.°4", text: "Circunferencia de 64 a 66 cm · Peso de 350 a 400 gramos." },
    ],
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((p) => (p + d + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [i]);

  return (
    <section className="relative overflow-hidden bg-[#070817] text-white">
      {/* Fondo cósmico: igual en todas las diapositivas, como en golary.co */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 650px at 85% -10%, rgba(124,92,255,0.35), transparent 60%)," +
            "radial-gradient(900px 600px at -10% 110%, rgba(0,168,232,0.22), transparent 55%)," +
            "linear-gradient(135deg, #090a1c 0%, #13142c 55%, #1a1038 100%)",
        }}
      />

      <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, idx) => (
          <div key={idx} className="relative w-full shrink-0">
            <div className="mx-auto grid min-h-[480px] max-w-7xl items-center gap-8 px-6 py-14 md:min-h-[560px] md:grid-cols-2 md:px-12">
              {/* Balón con resplandor */}
              <div className="relative order-2 mx-auto aspect-square w-full max-w-sm md:order-1">
                <div
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{ background: `radial-gradient(circle, ${s.glow}55 0%, transparent 70%)` }}
                />
                <Image
                  src={s.image}
                  alt={`Balón ${s.kicker} ${s.title} (foto de ejemplo)`}
                  fill
                  sizes="(min-width: 768px) 420px, 320px"
                  className="relative rounded-full object-cover drop-shadow-2xl"
                  priority={idx === 0}
                />
              </div>

              {/* Contenido */}
              <div className="relative order-1 md:order-2">
                <p className="font-display text-2xl font-bold uppercase tracking-wide md:text-3xl" style={{ color: s.glow }}>
                  {s.kicker}
                </p>
                <h1 className="font-display text-6xl font-extrabold uppercase leading-[0.95] md:text-8xl">{s.title}</h1>
                <div className="mt-4 mb-6 h-px w-full max-w-sm bg-gradient-to-r from-white/50 to-transparent" />

                <ul className="space-y-4">
                  {s.features.map((f) => (
                    <li key={f.label} className="flex gap-3">
                      <Hexagon className="mt-0.5 size-5 shrink-0 text-white/30" />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-amber-400">{f.label}</p>
                        <p className="text-sm text-white/70">{f.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <Link
                  href={s.href}
                  className="mt-7 inline-flex items-center gap-2 rounded-md border border-white/70 px-6 py-3 text-sm font-bold uppercase tracking-wide transition hover:bg-white hover:text-ink"
                >
                  <ShoppingCart className="size-4" /> Ver Balón
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button aria-label="Anterior" onClick={() => go(-1)} className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white md:grid">
        <ChevronLeft />
      </button>
      <button aria-label="Siguiente" onClick={() => go(1)} className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white md:grid">
        <ChevronRight />
      </button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button key={idx} aria-label={`Ir al slide ${idx + 1}`} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-3 bg-white/30"}`} />
        ))}
      </div>
    </section>
  );
}
