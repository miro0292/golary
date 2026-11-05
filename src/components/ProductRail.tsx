"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

export default function ProductRail({ title, products, href }: { title: string; products: Product[]; href?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-bold uppercase text-ink dark:text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {href && <Link href={href} className="mr-2 text-sm font-semibold text-brand-dark hover:underline">Ver todo</Link>}
          <button aria-label="Anterior" onClick={() => scroll(-1)} className="grid size-9 place-items-center rounded-full ring-1 ring-gray-300 hover:bg-ink hover:text-white dark:ring-white/20 dark:hover:bg-white dark:hover:text-ink"><ChevronLeft className="size-4" /></button>
          <button aria-label="Siguiente" onClick={() => scroll(1)} className="grid size-9 place-items-center rounded-full ring-1 ring-gray-300 hover:bg-ink hover:text-white dark:ring-white/20 dark:hover:bg-white dark:hover:text-ink"><ChevronRight className="size-4" /></button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
        {products.map((p) => (
          <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23%] xl:w-[19%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
