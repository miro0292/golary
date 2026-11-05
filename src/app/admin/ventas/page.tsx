"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { ChevronDown, Download, Plus } from "lucide-react";
import { useAdmin } from "@/context/AdminStore";
import { formatCOP } from "@/lib/config";
import { CHANNELS, type Sale } from "@/lib/admin/types";
import { Card, PageTitle, btn, fmtDate, input } from "@/components/admin/ui";

const RANGES = { hoy: "Hoy", "7": "Últimos 7 días", "30": "Últimos 30 días", todo: "Todo" } as const;

function inRange(s: Sale, r: keyof typeof RANGES) {
  const d = new Date(s.date);
  const now = new Date();
  if (r === "todo") return true;
  if (r === "hoy") return d.toDateString() === now.toDateString();
  return now.getTime() - d.getTime() < Number(r) * 864e5;
}

function exportCSV(sales: Sale[]) {
  const head = ["Numero", "Fecha", "Canal", "Pago", "Cliente", "Producto", "Talla", "Cantidad", "Precio", "Descuento venta", "Total venta", "Estado"];
  const rows = sales.flatMap((s) =>
    s.items.map((i) => [s.number, new Date(s.date).toLocaleString("es-CO"), s.channel, s.payment, s.customer ?? "", i.name, i.size, i.qty, i.price, s.discount, s.total, s.status]),
  );
  const csv = [head, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: `ventas-golary-${new Date().toISOString().slice(0, 10)}.csv` });
  a.click();
  URL.revokeObjectURL(url);
}

export default function SalesPage() {
  const { sales, cancelSale } = useAdmin();
  const [range, setRange] = useState<keyof typeof RANGES>("30");
  const [channel, setChannel] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => sales.filter((s) => inRange(s, range) && (!channel || s.channel === channel)), [sales, range, channel]);
  const paid = list.filter((s) => s.status === "pagada");
  const total = paid.reduce((n, s) => n + s.total, 0);
  const units = paid.reduce((n, s) => n + s.items.reduce((m, i) => m + i.qty, 0), 0);

  return (
    <>
      <PageTitle title="Ventas" subtitle="Historial de ventas registradas">
        <button onClick={() => exportCSV(list)} className={btn.ghost}><Download className="size-4" /> Exportar Excel (CSV)</button>
        <Link href="/admin/ventas/nueva" className={btn.primary}><Plus className="size-4" /> Registrar venta</Link>
      </PageTitle>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <Card><p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Total vendido</p><p className="font-display text-2xl font-bold">{formatCOP(total)}</p></Card>
        <Card><p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Ventas</p><p className="font-display text-2xl font-bold">{paid.length}</p></Card>
        <Card><p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Unidades</p><p className="font-display text-2xl font-bold">{units}</p></Card>
      </div>

      <Card className="p-0">
        <div className="flex flex-wrap gap-3 border-b p-4 dark:border-white/10">
          <div className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1 dark:bg-white/5">
            {Object.entries(RANGES).map(([k, v]) => (
              <button key={k} onClick={() => setRange(k as keyof typeof RANGES)} className={`rounded-md px-3 py-1.5 text-sm font-semibold ${range === k ? "bg-white shadow dark:bg-white/15" : "text-gray-600 dark:text-gray-400"}`}>{v}</button>
            ))}
          </div>
          <select value={channel} onChange={(e) => setChannel(e.target.value)} className={`${input} w-auto`}>
            <option value="">Todos los canales</option>
            {CHANNELS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500 dark:bg-white/5 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Canal</th>
                <th className="px-4 py-3">Pago</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((s) => (
                <Fragment key={s.id}>
                  <tr className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5" onClick={() => setOpen(open === s.id ? null : s.id)}>
                    <td className="px-4 py-3 font-semibold">{s.number}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">{fmtDate(s.date)}</td>
                    <td className="px-4 py-3">{s.channel}</td>
                    <td className="px-4 py-3">{s.payment}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.customer ?? "—"}</td>
                    <td className={`px-4 py-3 text-right font-bold ${s.status === "anulada" ? "text-gray-400 line-through" : ""}`}>{formatCOP(s.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.status === "pagada" ? "bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300" : "bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-300"}`}>
                        {s.status === "pagada" ? "Pagada" : "Anulada"}
                      </span>
                    </td>
                    <td className="px-4 py-3"><ChevronDown className={`size-4 transition ${open === s.id ? "rotate-180" : ""}`} /></td>
                  </tr>
                  {open === s.id && (
                    <tr className="bg-gray-50 dark:bg-white/5">
                      <td colSpan={8} className="px-4 py-3">
                        <ul className="space-y-1">
                          {s.items.map((i, n) => (
                            <li key={n} className="flex justify-between">
                              <span>{i.qty} × {i.name} (T{i.size}) a {formatCOP(i.price)}</span>
                              <span className="font-semibold">{formatCOP(i.qty * i.price)}</span>
                            </li>
                          ))}
                          {s.discount > 0 && <li className="flex justify-between text-gray-600 dark:text-gray-300"><span>Descuento</span><span>-{formatCOP(s.discount)}</span></li>}
                        </ul>
                        {s.status === "pagada" && (
                          <button
                            onClick={() => window.confirm(`¿Anular la venta #${s.number}? Las unidades vuelven al inventario.`) && cancelSale(s.id)}
                            className="mt-3 text-sm font-semibold text-sale hover:underline"
                          >
                            Anular venta
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-8 text-center text-gray-500 dark:text-gray-400">No hay ventas en este periodo.</p>}
        </div>
      </Card>
    </>
  );
}
