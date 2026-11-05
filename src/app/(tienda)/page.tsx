import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Factory, ShieldCheck, Truck } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import ProductRail from "@/components/ProductRail";
import BallArt from "@/components/BallArt";
import exhibicion from "@/assets/products/ejemplo-exhibicion-tienda.jpg";
import { bestSellers, categories, newArrivals, onSale, products } from "@/lib/products";

const benefits = [
  { icon: Factory, title: "Directo de fábrica", text: "Somos fabricantes, sin intermediarios" },
  { icon: Truck, title: "Envíos a toda Colombia", text: "Gratis desde $200.000" },
  { icon: ShieldCheck, title: "Garantía Golary", text: "Calidad probada en cancha" },
  { icon: BadgeCheck, title: "Pagos seguros", text: "Muy pronto pagos en línea" },
];

export default function Home() {
  return (
    <>
      <HeroCarousel />

      <section className="border-b border-gray-200 bg-white transition-colors duration-300 dark:border-white/10 dark:bg-ink">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 md:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon className="size-8 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-6 font-display text-3xl font-bold uppercase">Compra por deporte</h2>
        <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 md:grid md:grid-cols-6">
          {categories.map((c) => {
            const sample = products.find((p) => p.category === c.slug)!;
            return (
              <Link key={c.slug} href={`/categoria/${c.slug}`} className="group flex w-28 shrink-0 flex-col items-center gap-3 md:w-auto">
                <div className="grid aspect-square w-full place-items-center rounded-full p-5 transition group-hover:scale-105" style={{ background: `${c.accent}1f` }}>
                  <BallArt kind={sample.kind} colors={sample.colors} className="size-full transition duration-500 group-hover:rotate-45" />
                </div>
                <span className="text-sm font-bold uppercase tracking-wide group-hover:text-brand">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <ProductRail title="Los más vendidos" products={bestSellers()} href="/categoria/futbol" />

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-2">
        <Link href="/por-mayor" className="group relative overflow-hidden rounded-xl bg-ink p-8 text-white md:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Clubes · Escuelas · Colegios</p>
          <h3 className="mt-2 max-w-xs font-display text-4xl font-extrabold uppercase leading-none">Balones personalizados con tu escudo</h3>
          <p className="mt-3 max-w-xs text-sm text-white/75">Precios especiales por volumen, directo de nuestra fábrica.</p>
          <span className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-bold uppercase">Cotizar ahora</span>
          <BallArt kind="futbol" colors={["#ffffff", "#00a8e8"]} className="absolute -bottom-10 -right-10 w-56 opacity-90 transition duration-700 group-hover:rotate-90" />
        </Link>
        <Link href="/ofertas" className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-sale to-orange-500 p-8 text-white md:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-white/80">Por tiempo limitado</p>
          <h3 className="mt-2 max-w-xs font-display text-4xl font-extrabold uppercase leading-none">Ofertas hasta -25%</h3>
          <p className="mt-3 max-w-xs text-sm text-white/85">Balones de entrenamiento y recreación a precio de fábrica.</p>
          <span className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-bold uppercase text-ink">Ver ofertas</span>
          <BallArt kind="baloncesto" colors={["#e8590c", "#111827"]} className="absolute -bottom-10 -right-10 w-56 transition duration-700 group-hover:rotate-90" />
        </Link>
      </section>

      <ProductRail title="Novedades" products={newArrivals()} />
      <ProductRail title="Ofertas" products={onSale()} href="/ofertas" />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid items-center gap-8 overflow-hidden rounded-xl bg-brand-light transition-colors duration-300 dark:bg-ink-soft md:grid-cols-2">
          <div className="p-8 md:p-12">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-dark dark:text-brand">Nuestra historia</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold uppercase leading-none">De nuestra fábrica a tu cancha</h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              En Golary diseñamos y fabricamos cada balón. Controlamos la calidad desde el material hasta la última
              costura, para que juegues con un producto profesional a un precio justo.
            </p>
            <Link href="/tienda" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase text-white hover:bg-brand">
              Visita nuestra tienda
            </Link>
          </div>
          <div className="relative h-full min-h-64">
            <Image src={exhibicion} alt="Exhibición de balones Golary (imagen de ejemplo)" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            <span className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-[11px] text-white/80">Imagen de ejemplo</span>
          </div>
        </div>
      </section>
    </>
  );
}
