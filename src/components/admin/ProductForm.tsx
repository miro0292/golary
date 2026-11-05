"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import BallArt from "@/components/BallArt";
import { useAdmin } from "@/context/AdminStore";
import { categories, type BallKind } from "@/lib/products";
import { formatCOP } from "@/lib/config";
import type { AdminProduct } from "@/lib/admin/types";
import { Card, PageTitle, btn, input, label } from "./ui";

const KINDS: { value: BallKind; label: string }[] = [
  { value: "futbol", label: "Fútbol" },
  { value: "futsal", label: "Futsal" },
  { value: "voleibol", label: "Voleibol" },
  { value: "baloncesto", label: "Baloncesto" },
  { value: "microfutbol", label: "Microfútbol" },
];
const BADGES = ["", "Nuevo", "Más vendido", "Oferta", "Profesional"] as const;

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function ProductForm({ initial }: { initial?: AdminProduct }) {
  const router = useRouter();
  const { saveProduct, products } = useAdmin();
  const isNew = !initial;

  const [p, setP] = useState<AdminProduct>(
    initial ?? {
      id: `p${Date.now().toString(36)}`,
      sku: `GOL-NEW-${String(products.length + 1).padStart(3, "0")}`,
      slug: "",
      name: "",
      category: "futbol",
      kind: "futbol",
      price: 0,
      cost: 0,
      colors: ["#ffffff", "#00a8e8"],
      sizes: ["5"],
      stock: { "5": 0 },
      minStock: 5,
      active: true,
      description: "",
    },
  );
  const [sizesText, setSizesText] = useState(p.sizes.join(", "));
  const [error, setError] = useState("");

  const set = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) => setP((x) => ({ ...x, [k]: v }));
  const margin = p.price ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const sizes = [...new Set(sizesText.split(",").map((s) => s.trim()).filter(Boolean))];
    if (!p.name.trim()) return setError("Escribe el nombre del producto");
    if (!sizes.length) return setError("Agrega al menos una talla");
    if (p.price <= 0) return setError("El precio debe ser mayor a cero");
    if (products.some((x) => x.sku === p.sku && x.id !== p.id)) return setError("Ya existe un producto con ese SKU");
    const removedWithStock = p.sizes.filter((s) => !sizes.includes(s) && (p.stock[s] ?? 0) > 0);
    if (removedWithStock.length)
      return setError(`No puedes quitar la talla ${removedWithStock.join(", ")} porque aún tiene unidades. Sácalas primero desde Inventario.`);
    // Conserva el stock de las tallas existentes; las nuevas empiezan en 0 (se cargan desde Inventario).
    const stock = Object.fromEntries(sizes.map((s) => [s, p.stock[s] ?? 0]));
    saveProduct({ ...p, sizes, stock, slug: p.slug || slugify(p.name), name: p.name.trim() });
    router.push("/admin/productos");
  };

  return (
    <form onSubmit={submit}>
      <PageTitle title={isNew ? "Nuevo producto" : "Editar producto"} subtitle={isNew ? undefined : p.sku}>
        <Link href="/admin/productos" className={btn.ghost}><ArrowLeft className="size-4" /> Volver</Link>
        <button className={btn.primary}><Save className="size-4" /> Guardar</button>
      </PageTitle>

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-sale">{error}</p>}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card className="space-y-4">
            <h2 className="font-bold">Información básica</h2>
            <div>
              <label className={label}>Nombre</label>
              <input className={input} value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej: Balón Fútbol Golary Pro" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={label}>SKU / Referencia</label>
                <input className={input} value={p.sku} onChange={(e) => set("sku", e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className={label}>Categoría</label>
                <select className={input} value={p.category} onChange={(e) => set("category", e.target.value)}>
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Tipo de balón</label>
                <select className={input} value={p.kind} onChange={(e) => set("kind", e.target.value as BallKind)}>
                  {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={label}>Descripción</label>
              <textarea className={`${input} min-h-24`} value={p.description} onChange={(e) => set("description", e.target.value)} />
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="font-bold">Precios</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={label}>Precio de venta</label>
                <input type="number" min={0} step={100} className={input} value={p.price || ""} onChange={(e) => set("price", Number(e.target.value))} />
              </div>
              <div>
                <label className={label}>Precio anterior (opcional)</label>
                <input type="number" min={0} step={100} className={input} value={p.oldPrice || ""} onChange={(e) => set("oldPrice", Number(e.target.value) || undefined)} />
              </div>
              <div>
                <label className={label}>Costo de fabricación</label>
                <input type="number" min={0} step={100} className={input} value={p.cost || ""} onChange={(e) => set("cost", Number(e.target.value))} />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ganancia por unidad: <b>{formatCOP(p.price - p.cost)}</b> · Margen: <b className={margin < 20 ? "text-sale" : "text-green-700 dark:text-green-400"}>{margin}%</b>
            </p>
          </Card>

          <Card className="space-y-4">
            <h2 className="font-bold">Tallas e inventario</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Tallas (separadas por coma)</label>
                <input className={input} value={sizesText} onChange={(e) => setSizesText(e.target.value)} placeholder="3, 4, 5" />
              </div>
              <div>
                <label className={label}>Alerta de stock bajo (por talla)</label>
                <input type="number" min={0} className={input} value={p.minStock} onChange={(e) => set("minStock", Number(e.target.value))} />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Las cantidades se cargan desde <b>Inventario</b> (entradas de producción, ajustes), así queda registro de cada movimiento.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="font-bold">Imagen</h2>
            <div className="grid aspect-square place-items-center rounded-lg bg-gradient-to-br from-gray-50 to-gray-200 p-8 dark:from-white/5 dark:to-white/10">
              <BallArt kind={p.kind} colors={p.colors} className="size-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Color principal</label>
                <input type="color" className="h-10 w-full cursor-pointer rounded" value={p.colors[0]} onChange={(e) => set("colors", [e.target.value, p.colors[1]])} />
              </div>
              <div>
                <label className={label}>Color secundario</label>
                <input type="color" className="h-10 w-full cursor-pointer rounded" value={p.colors[1]} onChange={(e) => set("colors", [p.colors[0], e.target.value])} />
              </div>
            </div>
            <button type="button" disabled className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm text-gray-400 dark:border-white/15 dark:text-gray-500">
              <ImagePlus className="size-5" /> Subir fotos (al conectar la base de datos)
            </button>
          </Card>

          <Card className="space-y-4">
            <h2 className="font-bold">Publicación</h2>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" className="size-4 accent-brand" checked={p.active} onChange={(e) => set("active", e.target.checked)} />
              Publicado en la tienda
            </label>
            <div>
              <label className={label}>Etiqueta</label>
              <select className={input} value={p.badge ?? ""} onChange={(e) => set("badge", (e.target.value || undefined) as AdminProduct["badge"])}>
                {BADGES.map((b) => <option key={b} value={b}>{b || "Ninguna"}</option>)}
              </select>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
