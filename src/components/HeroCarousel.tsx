"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BallArt from "./BallArt";
import type { BallKind } from "@/lib/products";

type Slide = {
  kicker: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  bg: string;
  kind: BallKind;
  colors: [string, string];
};

const slides: Slide[] = [
  {
    kicker: "Nueva colección 2026",
    title: "Hechos para ganar",
    text: "Balones fabricados en Colombia con estándar profesional.",
    cta: "Ver fútbol",
    href: "/categoria/futbol",
    bg: "from-ink via-ink-soft to-brand-dark",
    kind: "futbol",
    colors: ["#ffffff", "#00a8e8"],
  },
  {
    kicker: "Directo de fábrica",
    title: "Futsal sin límites",
    text: "Control y bote perfecto para la cancha sintética y el coliseo.",
    cta: "Ver futsal",
    href: "/categoria/futsal",
    bg: "from-brand-dark via-brand to-sky-300",
    kind: "futsal",
    colors: ["#ffffff", "#111827"],
  },
  {
    kicker: "Hasta 20% de descuento",
    title: "Ofertas de temporada",
    text: "Aprovecha precios especiales en voleibol, microfútbol y más.",
    cta: "Ver ofertas",
    href: "/ofertas",
    bg: "from-[#3a0410] via-sale to-orange-500",
    kind: "voleibol",
    colors: ["#facc15", "#1d4ed8"],
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((p) => (p + d + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [i]);

  return (
    <section className="relative overflow-hidden">
      <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, idx) => (
          <div key={idx} className={`relative w-full shrink-0 bg-gradient-to-r ${s.bg} text-white`}>
            <div className="mx-auto grid min-h-[380px] max-w-7xl items-center gap-6 px-6 py-10 md:min-h-[460px] md:grid-cols-2 md:px-12">
              <div className="relative z-10">
                <p className="mb-2 inline-block rounded bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">{s.kicker}</p>
                <h1 className="font-display text-5xl font-extrabold uppercase leading-none md:text-7xl">{s.title}</h1>
                <p className="mt-4 max-w-md text-base text-white/85 md:text-lg">{s.text}</p>
                <Link href={s.href} className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-bold uppercase text-ink transition hover:bg-brand hover:text-white">
                  {s.cta}
                </Link>
              </div>
              <div className="pointer-events-none absolute -right-10 bottom-0 w-64 opacity-40 md:static md:mx-auto md:w-80 md:opacity-100">
                <BallArt kind={s.kind} colors={s.colors} className="w-full drop-shadow-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button aria-label="Anterior" onClick={() => go(-1)} className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-white md:grid">
        <ChevronLeft />
      </button>
      <button aria-label="Siguiente" onClick={() => go(1)} className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-white md:grid">
        <ChevronRight />
      </button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button key={idx} aria-label={`Ir al slide ${idx + 1}`} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-white" : "w-3 bg-white/50"}`} />
        ))}
      </div>
    </section>
  );
}
