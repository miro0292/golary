import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Factory, RotateCcw, Star, Truck } from "lucide-react";
import BallArt from "@/components/BallArt";
import AddToCart from "@/components/AddToCart";
import ProductRail from "@/components/ProductRail";
import { formatCOP } from "@/lib/config";
import { getCategory, getProduct, products, productsByCategory } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name, description: p.description } : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const related = productsByCategory(p.category).filter((x) => x.slug !== p.slug);

  // Datos estructurados para que Google muestre precio y estrellas.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    brand: { "@type": "Brand", name: "Golary" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
    offers: { "@type": "Offer", priceCurrency: "COP", price: p.price, availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <nav className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:underline">Inicio</Link> /{" "}
          <Link href={`/categoria/${cat.slug}`} className="hover:underline">{cat.name}</Link> / <span className="text-ink dark:text-white">{p.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-3">
            {p.image ? (
              <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5">
                <Image src={p.image} alt={p.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
                {!p.photoReal && (
                  <span className="absolute bottom-3 right-3 rounded bg-white/80 px-2 py-1 text-[11px] text-gray-500 dark:bg-black/60 dark:text-gray-300">
                    Foto de ejemplo, aún no es el producto final
                  </span>
                )}
              </div>
            ) : (
              <>
                <div className="relative grid aspect-square place-items-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-200 p-12 dark:from-white/5 dark:to-white/10">
                  <BallArt kind={p.kind} colors={p.colors} className="size-full max-w-md" />
                  <span className="absolute bottom-3 right-3 rounded bg-white/80 px-2 py-1 text-[11px] text-gray-500 dark:bg-black/60 dark:text-gray-300">Imagen ilustrativa</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`aspect-square rounded-lg bg-gray-100 p-3 dark:bg-white/5 ${i === 0 ? "ring-2 ring-brand" : ""}`}>
                      <BallArt kind={p.kind} colors={i % 2 ? [p.colors[1], p.colors[0]] : p.colors} className="size-full" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand-dark dark:text-brand">Golary · {cat.name}</p>
            <h1 className="mt-1 font-display text-4xl font-extrabold uppercase leading-tight text-ink dark:text-white">{p.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`size-4 ${i < Math.round(p.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                ))}
              </span>
              {p.rating} · {p.reviews} opiniones
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className={`font-display text-4xl font-bold ${p.oldPrice ? "text-sale" : ""}`}>{formatCOP(p.price)}</span>
              {p.oldPrice && <span className="text-lg text-gray-400 line-through">{formatCOP(p.oldPrice)}</span>}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">IVA incluido</p>

            <p className="mt-5 text-gray-700 dark:text-gray-300">{p.description}</p>

            <div className="mt-6">
              <AddToCart product={p} />
            </div>

            <ul className="mt-8 grid gap-3 rounded-xl bg-gray-50 p-5 text-sm dark:bg-white/5">
              <li className="flex gap-3"><Truck className="size-5 text-brand" /> Envío a toda Colombia · gratis desde $200.000</li>
              <li className="flex gap-3"><Factory className="size-5 text-brand" /> Fabricado por Golary, directo de fábrica</li>
              <li className="flex gap-3"><RotateCcw className="size-5 text-brand" /> Cambios dentro de los 30 días</li>
            </ul>

            <div className="mt-8">
              <h2 className="mb-3 font-display text-xl font-bold uppercase text-ink dark:text-white">Características</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Check className="size-4 text-brand" /> {f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {related.length > 0 && <ProductRail title="También te puede gustar" products={related} href={`/categoria/${cat.slug}`} />}
    </>
  );
}
