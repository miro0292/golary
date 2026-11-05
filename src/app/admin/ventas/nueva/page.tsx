"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Minus, Plus, Search, Trash2 } from "lucide-react";
import { useAdmin } from "@/context/AdminStore";
import { formatCOP } from "@/lib/config";
import { CHANNELS, PAYMENTS, type Channel, type Payment, type Sale, type SaleItem } from "@/lib/admin/types";
import { Card, PageTitle, Thumb, btn, input, label } from "@/components/admin/ui";

export default function NewSalePage() {
  const { products, product, createSale } = useAdmin();
  const [q, setQ] = useState("");
  const [items, setItems] = useState<SaleItem[]>([]);
  const [channel, setChannel] = useState<Channel>("Local");
  const [payment, setPayment] = useState<Payment>("Efectivo");
  const [customer, setCustomer] = useState("");
  const [discount, setDiscount] = useState(0);
  const [received, setReceived] = useState(0);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Sale | null>(null);

  const list = useMemo(
    () => products.filter((p) => p.active && (!q || `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase()))),
    [products, q],
  );

  // Cantidad ya agregada al ticket para un producto/talla (para no pasarse del stock).
  const inTicket = (pid: string, size: string) => items.filter((i) => i.productId === pid && i.size === size).reduce((n, i) => n + i.qty, 0);

  const add = (pid: string, size: string) => {
    const p = product(pid)!;
    if (inTicket(pid, size) >= (p.stock[size] ?? 0)) return setError(`No hay más stock de ${p.name} talla ${size}`);
    setError("");
    setItems((prev) =>
      prev.some((i) => i.productId === pid && i.size === size)
        ? prev.map((i) => (i.productId === pid && i.size === size ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { productId: pid, name: p.name, size, qty: 1, price: p.price }],
    );
  };

  const update = (idx: number, patch: Partial<SaleItem>) => setItems((prev) => prev.map((i, n) => (n === idx ? { ...i, ...patch } : i)));
  const gross = items.reduce((n, i) => n + i.qty * i.price, 0);
  const total = Math.max(0, gross - discount);

  const confirm = () => {
    const r = createSale({ channel, payment, customer: customer.trim() || undefined, items, discount });
    if (!r.ok) return setError(r.error);
    setDone(r.sale);
  };

  const reset = () => {
    setItems([]); setDiscount(0); setCustomer(""); setReceived(0); setError(""); setDone(null);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto size-14 text-green-600" />
          <h1 className="font-display text-3xl font-bold uppercase">Venta #{done.number} registrada</h1>
          <ul className="divide-y text-left text-sm">
            {done.items.map((i, n) => (
              <li key={n} className="flex justify-between py-2">
                <span>{i.qty} × {i.name} (T{i.size})</span>
                <span className="font-semibold">{formatCOP(i.qty * i.price)}</span>
              </li>
            ))}
            {done.discount > 0 && <li className="flex justify-between py-2 text-gray-600 dark:text-gray-300"><span>Descuento</span><span>-{formatCOP(done.discount)}</span></li>}
          </ul>
          <p className="flex justify-between border-t pt-3 text-xl font-bold"><span>Total</span><span>{formatCOP(done.total)}</span></p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{done.channel} · {done.payment}{done.customer && ` · ${done.customer}`}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">El inventario ya se descontó automáticamente.</p>
          <div className="flex justify-center gap-2">
            <button onClick={reset} className={btn.primary}>Nueva venta</button>
            <Link href="/admin/ventas" className={btn.ghost}>Ver ventas</Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageTitle title="Registrar venta" subtitle="Toca un producto y elige la talla para agregarlo" />
      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <Card className="p-0">
          <div className="border-b p-4 dark:border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto o SKU" className={`${input} pl-9`} autoFocus />
            </div>
          </div>
          <div className="grid max-h-[640px] gap-3 overflow-auto p-4 sm:grid-cols-2 2xl:grid-cols-3">
            {list.map((p) => (
              <div key={p.id} className="rounded-lg p-3 ring-1 ring-gray-200 dark:ring-white/10">
                <div className="flex items-center gap-3">
                  <Thumb p={p} size="size-12" />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold leading-tight">{p.name}</p>
                    <p className="text-sm font-bold text-brand-dark dark:text-brand">{formatCOP(p.price)}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.sizes.map((s) => {
                    const left = (p.stock[s] ?? 0) - inTicket(p.id, s);
                    return (
                      <button
                        key={s}
                        disabled={left <= 0}
                        onClick={() => add(p.id, s)}
                        className="rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-semibold hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-100 disabled:hover:text-current dark:bg-white/10 dark:disabled:hover:bg-white/10"
                      >
                        T{s} <span className="font-normal opacity-70">({left})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="h-fit space-y-4 xl:sticky xl:top-20">
          <h2 className="font-bold">Ticket</h2>
          {items.length === 0 ? (
            <p className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500 dark:bg-white/5 dark:text-gray-400">Aún no hay productos</p>
          ) : (
            <ul className="divide-y dark:divide-white/10">
              {items.map((i, idx) => {
                const max = product(i.productId)?.stock[i.size] ?? 0;
                return (
                  <li key={`${i.productId}-${i.size}`} className="space-y-2 py-3">
                    <div className="flex justify-between gap-2 text-sm">
                      <span className="font-semibold">{i.name} <span className="text-gray-500 dark:text-gray-400">T{i.size}</span></span>
                      <button onClick={() => setItems((prev) => prev.filter((_, n) => n !== idx))} className="text-gray-400 hover:text-sale" aria-label="Quitar"><Trash2 className="size-4" /></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center rounded-lg ring-1 ring-gray-300 dark:ring-white/15">
                        <button className="p-1.5" onClick={() => i.qty > 1 && update(idx, { qty: i.qty - 1 })} aria-label="Restar"><Minus className="size-3.5" /></button>
                        <span className="w-7 text-center text-sm font-bold">{i.qty}</span>
                        <button className="p-1.5" onClick={() => i.qty < max && update(idx, { qty: i.qty + 1 })} aria-label="Sumar"><Plus className="size-3.5" /></button>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">×</span>
                      <input
                        type="number" min={0} step={100} value={i.price}
                        onChange={(e) => update(idx, { price: Math.max(0, Number(e.target.value)) })}
                        className="w-28 rounded-lg px-2 py-1 text-sm ring-1 ring-gray-300 outline-none focus:ring-brand dark:bg-ink dark:text-white dark:ring-white/15"
                        title="Precio unitario (puedes ajustarlo para ventas al por mayor)"
                      />
                      <span className="ml-auto text-sm font-bold">{formatCOP(i.qty * i.price)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Canal</label>
              <select className={input} value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
                {CHANNELS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Pago</label>
              <select className={input} value={payment} onChange={(e) => setPayment(e.target.value as Payment)}>
                {PAYMENTS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={label}>Cliente (opcional)</label>
              <input className={input} value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Nombre o club" />
            </div>
            <div>
              <label className={label}>Descuento</label>
              <input type="number" min={0} step={100} className={input} value={discount || ""} onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))} />
            </div>
            {payment === "Efectivo" && (
              <div>
                <label className={label}>Recibido</label>
                <input type="number" min={0} step={1000} className={input} value={received || ""} onChange={(e) => setReceived(Math.max(0, Number(e.target.value)))} />
              </div>
            )}
          </div>

          <div className="space-y-1 border-t pt-3 text-sm dark:border-white/10">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCOP(gross)}</span></div>
            {discount > 0 && <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Descuento</span><span>-{formatCOP(Math.min(discount, gross))}</span></div>}
            <div className="flex justify-between text-2xl font-bold"><span>Total</span><span>{formatCOP(total)}</span></div>
            {payment === "Efectivo" && received > 0 && (
              <div className={`flex justify-between font-semibold ${received >= total ? "text-green-700" : "text-sale"}`}>
                <span>{received >= total ? "Cambio" : "Falta"}</span><span>{formatCOP(Math.abs(received - total))}</span>
              </div>
            )}
          </div>

          {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-sale">{error}</p>}
          <button onClick={confirm} disabled={!items.length} className={`${btn.primary} w-full justify-center py-3 text-base`}>
            Confirmar venta
          </button>
        </Card>
      </div>
    </>
  );
}
