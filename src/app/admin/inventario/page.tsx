"use client";

import { useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, CheckCircle2, Search, SlidersHorizontal } from "lucide-react";
import { useAdmin } from "@/context/AdminStore";
import { totalStock, type MovementType } from "@/lib/admin/types";
import { Card, PageTitle, Thumb, btn, fmtDate, input, label } from "@/components/admin/ui";

type Mode = "entrada" | "salida" | "ajuste";
const MODES: { value: Mode; label: string; help: string; icon: typeof ArrowUpCircle }[] = [
  { value: "entrada", label: "Entrada", help: "Producción terminada o compra de mercancía", icon: ArrowUpCircle },
  { value: "salida", label: "Salida", help: "Daños, muestras, regalos o traslados", icon: ArrowDownCircle },
  { value: "ajuste", label: "Ajuste por conteo", help: "Escribe la cantidad real que contaste", icon: SlidersHorizontal },
];

const typeStyle: Record<MovementType, string> = {
  entrada: "bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300",
  salida: "bg-orange-100 text-orange-800 dark:bg-orange-400/15 dark:text-orange-300",
  ajuste: "bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300",
  venta: "bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-gray-300",
  anulacion: "bg-purple-100 text-purple-800 dark:bg-purple-400/15 dark:text-purple-300",
};

export default function InventoryPage() {
  const { products, movements, addMovement, product } = useAdmin();
  const active = products.filter((p) => p.active);

  const [mode, setMode] = useState<Mode>("entrada");
  const [pid, setPid] = useState(active[0]?.id ?? "");
  const selected = product(pid);
  const [size, setSize] = useState(selected?.sizes[0] ?? "");
  const [qty, setQty] = useState(0);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [q, setQ] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);

  const current = selected?.stock[size] ?? 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const delta = mode === "entrada" ? qty : mode === "salida" ? -qty : qty - current;
    if (mode !== "ajuste" && qty <= 0) return setMsg({ ok: false, text: "Escribe una cantidad mayor a cero" });
    if (mode === "ajuste" && delta === 0) return setMsg({ ok: false, text: "La cantidad contada es igual al stock actual" });
    const err = addMovement({ productId: pid, size, qty: delta, type: mode, note: note.trim() || undefined });
    if (err) return setMsg({ ok: false, text: err });
    setMsg({ ok: true, text: `Listo: ${selected.name} talla ${size} quedó en ${current + delta} unidades` });
    setQty(0);
    setNote("");
  };

  const rows = useMemo(
    () =>
      products
        .flatMap((p) => p.sizes.map((s) => ({ p, size: s, stock: p.stock[s] ?? 0 })))
        .filter(({ p, stock }) => (!onlyLow || stock <= p.minStock) && (!q || `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase()))),
    [products, q, onlyLow],
  );

  const units = products.reduce((n, p) => n + totalStock(p), 0);

  return (
    <>
      <PageTitle title="Inventario" subtitle={`${units} unidades en total · stock por talla`} />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="h-fit space-y-4">
          <h2 className="font-bold">Registrar movimiento</h2>
          <div className="grid grid-cols-3 gap-2">
            {MODES.map(({ value, label: l, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => { setMode(value); setMsg(null); setQty(value === "ajuste" ? current : 0); }}
                className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs font-semibold ring-1 ${mode === value ? "bg-ink text-white ring-ink dark:bg-white dark:text-ink dark:ring-white" : "ring-gray-300 hover:bg-gray-50 dark:ring-white/15 dark:hover:bg-white/5"}`}
              >
                <Icon className="size-5" /> {l}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{MODES.find((m) => m.value === mode)!.help}</p>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className={label}>Producto</label>
              <select
                className={input}
                value={pid}
                onChange={(e) => {
                  const p = product(e.target.value);
                  setPid(e.target.value);
                  setSize(p?.sizes[0] ?? "");
                  setMsg(null);
                  if (mode === "ajuste") setQty(p?.stock[p.sizes[0]] ?? 0);
                }}
              >
                {active.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Talla</label>
                <select className={input} value={size} onChange={(e) => { setSize(e.target.value); if (mode === "ajuste") setQty(selected?.stock[e.target.value] ?? 0); }}>
                  {selected?.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>{mode === "ajuste" ? "Cantidad contada" : "Cantidad"}</label>
                <input type="number" min={0} className={input} value={qty} onChange={(e) => setQty(Math.max(0, Number(e.target.value)))} />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Stock actual: <b>{current}</b>
              {mode !== "ajuste" && qty > 0 && <> → quedará en <b>{mode === "entrada" ? current + qty : current - qty}</b></>}
              {mode === "ajuste" && qty !== current && <> → diferencia <b>{qty - current > 0 ? "+" : ""}{qty - current}</b></>}
            </p>
            <div>
              <label className={label}>Nota (opcional)</label>
              <input className={input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej: Lote de producción 45" />
            </div>
            <button className={`${btn.primary} w-full justify-center`}>Guardar movimiento</button>
            {msg && (
              <p className={`flex items-center gap-2 rounded-lg p-3 text-sm font-semibold ${msg.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-sale"}`}>
                {msg.ok && <CheckCircle2 className="size-4" />} {msg.text}
              </p>
            )}
          </form>
        </Card>

        <Card className="p-0 xl:col-span-2">
          <div className="flex flex-wrap items-center gap-3 border-b p-4 dark:border-white/10">
            <div className="relative min-w-52 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto o SKU" className={`${input} pl-9`} />
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} className="size-4 accent-brand" /> Solo stock bajo
            </label>
          </div>
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="sticky top-0 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500 dark:bg-ink-soft dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Talla</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map(({ p, size: s, stock }) => (
                  <tr
                    key={`${p.id}-${s}`}
                    onClick={() => { setPid(p.id); setSize(s); setMsg(null); if (mode === "ajuste") setQty(stock); }}
                    className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 ${pid === p.id && size === s ? "bg-brand-light dark:bg-ink" : ""}`}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <Thumb p={p} size="size-8" />
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-semibold">{s}</td>
                    <td className="px-4 py-2 text-right font-display text-lg font-bold">{stock}</td>
                    <td className="px-4 py-2">
                      {stock === 0 ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">Agotado</span>
                      ) : stock <= p.minStock ? (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800">Bajo</span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-0">
        <h2 className="border-b p-4 font-bold dark:border-white/10">Historial de movimientos</h2>
        <div className="max-h-96 overflow-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="sticky top-0 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500 dark:bg-ink-soft dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Talla</th>
                <th className="px-4 py-3 text-right">Cantidad</th>
                <th className="px-4 py-3">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {movements.slice(0, 100).map((m) => (
                <tr key={m.id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-500 dark:text-gray-400">{fmtDate(m.date)}</td>
                  <td className="px-4 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${typeStyle[m.type]}`}>{m.type === "anulacion" ? "anulación" : m.type}</span></td>
                  <td className="px-4 py-2">{product(m.productId)?.name ?? "—"}</td>
                  <td className="px-4 py-2">{m.size}</td>
                  <td className={`px-4 py-2 text-right font-bold ${m.qty > 0 ? "text-green-700 dark:text-green-400" : "text-gray-700 dark:text-gray-300"}`}>{m.qty > 0 ? `+${m.qty}` : m.qty}</td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
