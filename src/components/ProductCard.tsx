import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import BallArt from "./BallArt";
import { formatCOP } from "@/lib/config";
import type { Product } from "@/lib/products";

const badgeStyle: Record<NonNullable<Product["badge"]>, string> = {
  Nuevo: "bg-brand text-white",
  "Más vendido": "bg-ink text-white",
  Oferta: "bg-sale text-white",
  Profesional: "bg-yellow-400 text-ink",
};

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-white ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-brand dark:bg-ink-soft dark:ring-white/10"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200 dark:from-white/5 dark:to-white/10">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 19vw, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <BallArt kind={product.kind} colors={product.colors} className="size-full p-8 transition duration-300 group-hover:rotate-12 group-hover:scale-105" />
        )}
        {product.badge && (
          <span className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[11px] font-bold uppercase ${badgeStyle[product.badge]}`}>
            {product.badge === "Oferta" ? `-${discount}%` : product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Golary</p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink dark:text-white">{product.name}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" /> {product.rating} ({product.reviews})
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className={`font-display text-xl font-bold ${product.oldPrice ? "text-sale" : "text-ink dark:text-white"}`}>{formatCOP(product.price)}</span>
          {product.oldPrice && <span className="text-xs text-gray-400 line-through">{formatCOP(product.oldPrice)}</span>}
        </div>
      </div>
    </Link>
  );
}
