"use client";

import { useState } from "react";
import { formatCOP } from "@/lib/config";

// Barras de ventas por día (una sola serie, un solo color de marca).
export default function SalesChart({ data }: { data: { label: string; value: number; count: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));

  return (
    <div className="relative">
      <div className="flex h-56 gap-3">
        <div className="flex flex-col-reverse justify-between pb-6 text-right text-[11px] text-gray-400">
          {ticks.map((t) => <span key={t}>{t >= 1_000_000 ? `${(t / 1_000_000).toFixed(1)}M` : `${Math.round(t / 1000)}k`}</span>)}
        </div>
        <div className="relative flex flex-1 items-end gap-[2px] border-b border-gray-200 pb-0 dark:border-white/10" style={{ marginBottom: 24 }}>
          {[0.5, 1].map((f) => (
            <div key={f} className="pointer-events-none absolute inset-x-0 border-t border-dashed border-gray-100 dark:border-white/10" style={{ bottom: `${f * 100}%` }} />
          ))}
          {data.map((d, i) => (
            <div
              key={i}
              className="group relative flex h-full flex-1 cursor-default items-end"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div
                className={`w-full rounded-t-[4px] transition-colors ${hover === i ? "bg-brand-dark" : "bg-brand"}`}
                style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 2 : 0 }}
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-gray-400">
                {i % 2 === data.length % 2 ? "" : d.label}
              </span>
              {hover === i && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-2 text-xs text-white shadow-lg">
                  <p className="font-semibold">{d.label}</p>
                  <p>{formatCOP(d.value)}</p>
                  <p className="text-white/60">{d.count} ventas</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
