"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { STORE, formatCOP } from "@/lib/config";
import BallArt from "./BallArt";

export function QtyControl({ slug, size, qty }: { slug: string; size: string; qty: number }) {
  const { setQty } = useCart();
  return (
    <div className="inline-flex items-center rounded-full ring-1 ring-gray-300 dark:ring-white/20">
      <button aria-label="Restar" className="grid size-8 place-items-center hover:text-brand" onClick={() => setQty(slug, size, qty - 1)}>
        <Minus className="size-3.5" />
      </button>
      <span className="w-6 text-center text-sm font-semibold">{qty}</span>
      <button aria-label="Sumar" className="grid size-8 place-items-center hover:text-brand" onClick={() => setQty(slug, size, qty + 1)}>
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export default function CartDrawer() {
  const { lines, total, isOpen, close, remove } = useCart();
  const missing = STORE.freeShippingFrom - total;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={close} />
      <aside className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform dark:bg-ink-soft ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b p-4 dark:border-white/10">
          <h2 className="font-display text-xl font-bold uppercase text-ink dark:text-white">Tu carrito</h2>
          <button onClick={close} aria-label="Cerrar carrito"><X /></button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-gray-500 dark:text-gray-400">
            <ShoppingBag className="size-12" />
            <p>Tu carrito está vacío</p>
            <button onClick={close} className="rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-ink">Seguir comprando</button>
          </div>
        ) : (
          <>
            <div className="bg-brand-light px-4 py-3 text-sm dark:bg-ink">
              {missing > 0 ? (
                <>Te faltan <b>{formatCOP(missing)}</b> para envío gratis</>
              ) : (
                <b>¡Tienes envío gratis! 🎉</b>
              )}
              <div className="mt-2 h-1.5 rounded-full bg-white dark:bg-white/15">
                <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (total / STORE.freeShippingFrom) * 100)}%` }} />
              </div>
            </div>
            <ul className="flex-1 divide-y overflow-y-auto px-4 dark:divide-white/10">
              {lines.map((l) => (
                <li key={`${l.slug}-${l.size}`} className="flex gap-3 py-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-white/5">
                    {l.product.image ? (
                      <Image src={l.product.image} alt={l.product.name} fill sizes="80px" className="object-cover" />
                    ) : (
                      <BallArt kind={l.product.kind} colors={l.product.colors} className="size-full p-2" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm font-semibold leading-snug">{l.product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Talla {l.size}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <QtyControl slug={l.slug} size={l.size} qty={l.qty} />
                      <span className="font-bold">{formatCOP(l.subtotal)}</span>
                    </div>
                  </div>
                  <button aria-label="Eliminar" onClick={() => remove(l.slug, l.size)} className="self-start text-gray-400 hover:text-sale">
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t p-4 dark:border-white/10">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span> <span>{formatCOP(total)}</span>
              </div>
              <Link href="/carrito" onClick={close} className="block rounded-full bg-brand py-3 text-center font-bold uppercase text-white hover:bg-brand-dark">
                Ver carrito y pagar
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
