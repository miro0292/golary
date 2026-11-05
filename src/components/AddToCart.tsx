"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const lowStock = product.stock <= 15;

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-bold uppercase">
          Talla {error && <span className="ml-2 font-semibold normal-case text-sale">Selecciona una talla</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => { setSize(s); setError(false); }}
              className={`min-w-14 rounded px-4 py-2.5 font-semibold ring-1 transition ${size === s ? "bg-ink text-white ring-ink" : "ring-gray-300 hover:ring-ink"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className={`text-sm font-semibold ${lowStock ? "text-orange-600" : "text-green-700"}`}>
        ● {lowStock ? `¡Últimas ${product.stock} unidades!` : "Disponible"}
      </p>

      <div className="flex gap-3">
        <div className="inline-flex items-center rounded-full ring-1 ring-gray-300">
          <button aria-label="Restar" className="grid size-12 place-items-center" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="size-4" /></button>
          <span className="w-8 text-center font-bold">{qty}</span>
          <button aria-label="Sumar" className="grid size-12 place-items-center" onClick={() => setQty(Math.min(product.stock, qty + 1))}><Plus className="size-4" /></button>
        </div>
        <button
          onClick={() => (size ? add(product.slug, size, qty) : setError(true))}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand py-3 font-bold uppercase text-white transition hover:bg-brand-dark"
        >
          <ShoppingCart className="size-5" /> Agregar al carrito
        </button>
      </div>
    </div>
  );
}
