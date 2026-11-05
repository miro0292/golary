"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

const sorts = {
  relevancia: "Relevancia",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  valoracion: "Mejor valorados",
} as const;

export default function ProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<keyof typeof sorts>("relevancia");
  const [size, setSize] = useState<string | null>(null);
  const [saleOnly, setSaleOnly] = useState(false);

  const sizes = useMemo(
    () => [...new Set(products.flatMap((p) => p.sizes))].sort((a, b) => parseFloat(a) - parseFloat(b)),
    [products],
  );

  const list = useMemo(() => {
    const l = products.filter((p) => (!size || p.sizes.includes(size)) && (!saleOnly || p.oldPrice));
    if (sort === "precio-asc") l.sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") l.sort((a, b) => b.price - a.price);
    if (sort === "valoracion") l.sort((a, b) => b.rating - a.rating);
    return l;
  }, [products, sort, size, saleOnly]);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase">Talla</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(size === s ? null : s)}
                className={`min-w-11 rounded px-3 py-1.5 text-sm font-semibold ring-1 ${size === s ? "bg-ink text-white ring-ink dark:bg-white dark:text-ink dark:ring-white" : "ring-gray-300 hover:ring-ink dark:ring-white/20 dark:hover:ring-white"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={saleOnly} onChange={(e) => setSaleOnly(e.target.checked)} className="size-4 accent-brand" />
          Solo ofertas
        </label>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">{list.length} productos</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as keyof typeof sorts)}
            className="rounded-full bg-white px-4 py-2 text-sm ring-1 ring-gray-300 outline-none focus:ring-brand dark:bg-ink-soft dark:ring-white/20"
          >
            {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        {list.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-10 text-center text-gray-500 dark:bg-white/5 dark:text-gray-400">No hay productos con esos filtros.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
