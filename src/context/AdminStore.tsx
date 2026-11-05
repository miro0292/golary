"use client";

// Almacén de datos del panel de administración.
// PROTOTIPO: guarda todo en este navegador (localStorage). En la siguiente fase estas mismas
// funciones se conectan a Supabase y los datos quedan en la nube, compartidos y seguros.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { buildSeed } from "@/lib/admin/seed";
import type { AdminData, AdminProduct, Movement, MovementType, Sale, SaleItem } from "@/lib/admin/types";

const KEY = "golary-admin-data-v1";

type NewSale = Omit<Sale, "id" | "number" | "date" | "total" | "status">;

type Store = AdminData & {
  ready: boolean;
  saveProduct: (p: AdminProduct) => void;
  toggleActive: (id: string) => void;
  addMovement: (m: { productId: string; size: string; qty: number; type: MovementType; note?: string }) => string | null;
  createSale: (s: NewSale) => { ok: true; sale: Sale } | { ok: false; error: string };
  cancelSale: (id: string) => void;
  resetDemo: () => void;
  product: (id: string) => AdminProduct | undefined;
};

const Ctx = createContext<Store | null>(null);
const uid = () => Math.random().toString(36).slice(2, 10);

function applyStock(products: AdminProduct[], changes: { productId: string; size: string; qty: number }[]) {
  return products.map((p) => {
    const mine = changes.filter((c) => c.productId === p.id);
    if (!mine.length) return p;
    const stock = { ...p.stock };
    mine.forEach((c) => (stock[c.size] = (stock[c.size] ?? 0) + c.qty));
    return { ...p, stock };
  });
}

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AdminData>({ products: [], movements: [], sales: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let initial: AdminData | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) initial = JSON.parse(raw);
    } catch {}
    setData(initial ?? buildSeed());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {}
  }, [data, ready]);

  const product = useCallback((id: string) => data.products.find((p) => p.id === id), [data.products]);

  const value = useMemo<Store>(
    () => ({
      ...data,
      ready,
      product,

      saveProduct: (p) =>
        setData((d) => {
          const exists = d.products.some((x) => x.id === p.id);
          return { ...d, products: exists ? d.products.map((x) => (x.id === p.id ? p : x)) : [p, ...d.products] };
        }),

      toggleActive: (id) =>
        setData((d) => ({ ...d, products: d.products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)) })),

      addMovement: ({ productId, size, qty, type, note }) => {
        const p = data.products.find((x) => x.id === productId);
        if (!p) return "Producto no encontrado";
        if (!qty) return "La cantidad no puede ser cero";
        if ((p.stock[size] ?? 0) + qty < 0) return `Stock insuficiente: hay ${p.stock[size] ?? 0} en talla ${size}`;
        const m: Movement = { id: uid(), date: new Date().toISOString(), productId, size, qty, type, note };
        setData((d) => ({ ...d, products: applyStock(d.products, [m]), movements: [m, ...d.movements] }));
        return null;
      },

      createSale: (s) => {
        const items = s.items.filter((i) => i.qty > 0);
        if (!items.length) return { ok: false, error: "Agrega al menos un producto" };
        // Validar stock sumando cantidades repetidas del mismo producto/talla.
        const need = new Map<string, number>();
        items.forEach((i) => need.set(`${i.productId}|${i.size}`, (need.get(`${i.productId}|${i.size}`) ?? 0) + i.qty));
        for (const [k, q] of need) {
          const [pid, size] = k.split("|");
          const p = data.products.find((x) => x.id === pid);
          if (!p || (p.stock[size] ?? 0) < q) return { ok: false, error: `Stock insuficiente de ${p?.name ?? "producto"} talla ${size}` };
        }
        const gross = items.reduce((n, i) => n + i.qty * i.price, 0);
        const number = Math.max(1000, ...data.sales.map((x) => x.number)) + 1;
        const sale: Sale = {
          ...s,
          items,
          id: uid(),
          number,
          date: new Date().toISOString(),
          discount: Math.min(s.discount, gross),
          total: gross - Math.min(s.discount, gross),
          status: "pagada",
        };
        const moves: Movement[] = items.map((i: SaleItem) => ({
          id: uid(), date: sale.date, productId: i.productId, size: i.size, qty: -i.qty, type: "venta", note: `Venta #${number}`,
        }));
        setData((d) => ({ products: applyStock(d.products, moves), movements: [...moves, ...d.movements], sales: [sale, ...d.sales] }));
        return { ok: true, sale };
      },

      cancelSale: (id) =>
        setData((d) => {
          const sale = d.sales.find((x) => x.id === id);
          if (!sale || sale.status === "anulada") return d;
          const moves: Movement[] = sale.items.map((i) => ({
            id: uid(), date: new Date().toISOString(), productId: i.productId, size: i.size, qty: i.qty, type: "anulacion", note: `Anulación venta #${sale.number}`,
          }));
          return {
            products: applyStock(d.products, moves),
            movements: [...moves, ...d.movements],
            sales: d.sales.map((x) => (x.id === id ? { ...x, status: "anulada" } : x)),
          };
        }),

      resetDemo: () => setData(buildSeed()),
    }),
    [data, ready, product],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdmin debe usarse dentro de AdminStoreProvider");
  return c;
}
