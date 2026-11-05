"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AlertTriangle, Boxes, Receipt, TrendingUp, Wallet } from "lucide-react";
import { useAdmin } from "@/context/AdminStore";
import { formatCOP } from "@/lib/config";
import { CHANNELS, lowSizes, totalStock } from "@/lib/admin/types";
import { Card, PageTitle, Thumb, btn, fmtDate } from "@/components/admin/ui";
import SalesChart from "@/components/admin/SalesChart";

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export default function Dashboard() {
  const { sales, products } = useAdmin();

  const stats = useMemo(() => {
    const paid = sales.filter((s) => s.status === "pagada");
    const now = new Date();
    const today = paid.filter((s) => dayKey(new Date(s.date)) === dayKey(now));
    const month = paid.filter((s) => {
      const d = new Date(s.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const sum = (l: typeof paid) => l.reduce((n, s) => n + s.total, 0);

    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (13 - i));
      const list = paid.filter((s) => dayKey(new Date(s.date)) === dayKey(d));
      return { label: d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }), value: sum(list), count: list.length };
    });

    const last30 = paid.filter((s) => now.getTime() - new Date(s.date).getTime() < 30 * 864e5);
    const byChannel = CHANNELS.map((c) => ({ channel: c, value: sum(last30.filter((s) => s.channel === c)) })).sort((a, b) => b.value - a.value);

    const units = new Map<string, number>();
    last30.forEach((s) => s.items.forEach((i) => units.set(i.productId, (units.get(i.productId) ?? 0) + i.qty)));
    const top = [...units.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      today: sum(today), todayCount: today.length,
      month: sum(month), monthCount: month.length,
      days, byChannel, top, last30Total: sum(last30),
      inventoryValue: products.reduce((n, p) => n + totalStock(p) * p.cost, 0),
      inventoryUnits: products.reduce((n, p) => n + totalStock(p), 0),
      low: products.filter((p) => p.active && lowSizes(p).length > 0),
    };
  }, [sales, products]);

  const kpis = [
    { label: "Ventas de hoy", value: formatCOP(stats.today), sub: `${stats.todayCount} ventas`, icon: Receipt },
    { label: "Ventas del mes", value: formatCOP(stats.month), sub: `${stats.monthCount} ventas`, icon: TrendingUp },
    { label: "Inventario (a costo)", value: formatCOP(stats.inventoryValue), sub: `${stats.inventoryUnits} unidades`, icon: Wallet },
    { label: "Stock bajo", value: String(stats.low.length), sub: "productos por reponer", icon: AlertTriangle, warn: stats.low.length > 0 },
  ];

  return (
    <>
      <PageTitle title="Resumen" subtitle="Así va tu negocio">
        <Link href="/admin/ventas/nueva" className={btn.primary}><Receipt className="size-4" /> Registrar venta</Link>
      </PageTitle>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map(({ label, value, sub, icon: Icon, warn }) => (
          <Card key={label}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
              <Icon className={`size-5 ${warn ? "text-orange-500" : "text-brand"}`} />
            </div>
            <p className="mt-2 font-display text-2xl font-bold sm:text-3xl">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="font-bold">Ventas últimos 14 días</h2>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">Pasa el cursor sobre una barra para ver el detalle</p>
          <SalesChart data={stats.days} />
        </Card>
        <Card>
          <h2 className="font-bold">Ventas por canal</h2>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">Últimos 30 días · {formatCOP(stats.last30Total)}</p>
          <ul className="space-y-4">
            {stats.byChannel.map((c) => {
              const pct = stats.last30Total ? Math.round((c.value / stats.last30Total) * 100) : 0;
              return (
                <li key={c.channel}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-semibold">{c.channel}</span>
                    <span className="text-gray-600 dark:text-gray-300">{formatCOP(c.value)} · {pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Stock bajo</h2>
            <Link href="/admin/inventario" className="text-xs font-semibold text-brand-dark hover:underline">Ir a inventario</Link>
          </div>
          {stats.low.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Todo el inventario está en buen nivel.</p>
          ) : (
            <ul className="divide-y dark:divide-white/10">
              {stats.low.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-2">
                  <Thumb p={p} size="size-9" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      {lowSizes(p).map((s) => `T${s}: ${p.stock[s] ?? 0}`).join(" · ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 font-bold">Más vendidos (30 días)</h2>
          <ol className="divide-y dark:divide-white/10">
            {stats.top.map(([id, qty], i) => {
              const p = products.find((x) => x.id === id);
              if (!p) return null;
              return (
                <li key={id} className="flex items-center gap-3 py-2">
                  <span className="w-4 text-sm font-bold text-gray-400">{i + 1}</span>
                  <Thumb p={p} size="size-9" />
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold">{p.name}</p>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{qty} und.</span>
                </li>
              );
            })}
          </ol>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Últimas ventas</h2>
            <Link href="/admin/ventas" className="text-xs font-semibold text-brand-dark hover:underline">Ver todas</Link>
          </div>
          <ul className="divide-y dark:divide-white/10">
            {sales.slice(0, 6).map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-semibold">#{s.number} · {s.channel}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{fmtDate(s.date)} · {s.payment}</p>
                </div>
                <span className={`font-bold ${s.status === "anulada" ? "text-gray-400 line-through" : ""}`}>{formatCOP(s.total)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <p className="mt-6 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Boxes className="size-4" /> Los datos actuales son de prueba y se guardan solo en este navegador.
      </p>
    </>
  );
}
