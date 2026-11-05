"use client";

import Link from "next/link";
import { CreditCard, MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { QtyControl } from "@/components/CartDrawer";
import BallArt from "@/components/BallArt";
import { STORE, formatCOP } from "@/lib/config";

export default function CartPage() {
  const { lines, total, remove } = useCart();
  const shipping = total >= STORE.freeShippingFrom || total === 0 ? 0 : 15000;

  const whatsappText = encodeURIComponent(
    `Hola Golary, quiero hacer este pedido:\n` +
      lines.map((l) => `• ${l.qty} x ${l.product.name} (talla ${l.size}) - ${formatCOP(l.subtotal)}`).join("\n") +
      `\nTotal: ${formatCOP(total + shipping)}`,
  );

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="size-16 text-gray-300 dark:text-white/20" />
        <h1 className="font-display text-3xl font-bold uppercase">Tu carrito está vacío</h1>
        <Link href="/" className="rounded-full bg-brand px-8 py-3 font-bold uppercase text-white hover:bg-brand-dark">Ir a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 font-display text-4xl font-extrabold uppercase">Tu carrito</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y rounded-xl ring-1 ring-gray-200 dark:divide-white/10 dark:ring-white/10">
          {lines.map((l) => (
            <li key={`${l.slug}-${l.size}`} className="flex gap-4 p-4">
              <Link href={`/producto/${l.slug}`} className="size-24 shrink-0 rounded-lg bg-gray-100 p-3 dark:bg-white/5">
                <BallArt kind={l.product.kind} colors={l.product.colors} className="size-full" />
              </Link>
              <div className="flex flex-1 flex-col gap-1">
                <Link href={`/producto/${l.slug}`} className="font-semibold hover:text-brand">{l.product.name}</Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">Talla {l.size} · {formatCOP(l.product.price)} c/u</p>
                <div className="mt-auto flex items-center justify-between">
                  <QtyControl slug={l.slug} size={l.size} qty={l.qty} />
                  <span className="text-lg font-bold">{formatCOP(l.subtotal)}</span>
                </div>
              </div>
              <button aria-label="Eliminar" onClick={() => remove(l.slug, l.size)} className="self-start text-gray-400 hover:text-sale">
                <Trash2 className="size-5" />
              </button>
            </li>
          ))}
        </ul>

        <aside className="h-fit space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-white/5">
          <h2 className="font-display text-2xl font-bold uppercase">Resumen</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCOP(total)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>{shipping ? formatCOP(shipping) : "Gratis"}</span></div>
          </div>
          <div className="flex justify-between border-t pt-3 text-xl font-bold dark:border-white/10">
            <span>Total</span><span>{formatCOP(total + shipping)}</span>
          </div>
          <button disabled className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-gray-300 py-3 font-bold uppercase text-gray-600 dark:bg-white/10 dark:text-gray-400">
            <CreditCard className="size-5" /> Pagar en línea (pronto)
          </button>
          <a
            href={`https://wa.me/${STORE.whatsapp}?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25d366] py-3 font-bold uppercase text-white hover:brightness-95"
          >
            <MessageCircle className="size-5" /> Pedir por WhatsApp
          </a>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">Mientras activamos los pagos en línea, te atendemos por WhatsApp.</p>
        </aside>
      </div>
    </div>
  );
}
