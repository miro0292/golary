// Piezas visuales compartidas del panel.
import BallArt from "@/components/BallArt";
import type { AdminProduct } from "@/lib/admin/types";

export function PageTitle({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-ink-soft dark:ring-white/10 ${className}`}>{children}</div>;
}

export function Thumb({ p, size = "size-10" }: { p: Pick<AdminProduct, "kind" | "colors">; size?: string }) {
  return (
    <div className={`${size} shrink-0 rounded-md bg-gray-100 p-1 dark:bg-white/5`}>
      <BallArt kind={p.kind} colors={p.colors} className="size-full" />
    </div>
  );
}

export const btn = {
  primary: "inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-50",
  dark: "inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-bold text-white hover:bg-black dark:bg-white dark:text-ink dark:hover:bg-gray-200",
  ghost: "inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-gray-300 hover:bg-gray-50 dark:bg-ink-soft dark:ring-white/15 dark:hover:bg-white/5",
};

export const input = "w-full rounded-lg bg-white px-3 py-2.5 text-sm ring-1 ring-gray-300 outline-none focus:ring-2 focus:ring-brand dark:bg-ink dark:ring-white/15";
export const label = "mb-1 block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400";

export function fmtDate(iso: string, withTime = true) {
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}
