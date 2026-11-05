"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "@/lib/products";

export type CartItem = { slug: string; size: string; qty: number };
export type CartLine = CartItem & { product: Product; subtotal: number };

type CartCtx = {
  lines: CartLine[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (slug: string, size: string, qty?: number) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "golary-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const value = useMemo<CartCtx>(() => {
    const lines = items.flatMap((it) => {
      const product = getProduct(it.slug);
      return product ? [{ ...it, product, subtotal: product.price * it.qty }] : [];
    });
    const same = (a: CartItem, slug: string, size: string) => a.slug === slug && a.size === size;
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.subtotal, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: (slug, size, qty = 1) => {
        setItems((prev) =>
          prev.some((p) => same(p, slug, size))
            ? prev.map((p) => (same(p, slug, size) ? { ...p, qty: p.qty + qty } : p))
            : [...prev, { slug, size, qty }],
        );
        setOpen(true);
      },
      setQty: (slug, size, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((p) => !same(p, slug, size))
            : prev.map((p) => (same(p, slug, size) ? { ...p, qty } : p)),
        ),
      remove: (slug, size) => setItems((prev) => prev.filter((p) => !same(p, slug, size))),
      clear: () => setItems([]),
    };
  }, [items, isOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart debe usarse dentro de CartProvider");
  return c;
}
