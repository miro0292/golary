"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Search } from "lucide-react";
import { useAdmin } from "@/context/AdminStore";
import { categories } from "@/lib/products";
import { formatCOP } from "@/lib/config";
import { lowSizes, totalStock } from "@/lib/admin/types";
import { Card, PageTitle, Thumb, btn, input } from "@/components/admin/ui";

export default function ProductsPage() {
  const { products, toggleActive } = useAdmin();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          (!cat || p.category === cat) &&
          (!q || `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [products, q, cat],
  );

  return (
    <>
      <PageTitle title="Productos" subtitle={`${products.length} productos en el catálogo`}>
        <Link href="/admin/productos/nuevo" className={btn.primary}><Plus className="size-4" /> Nuevo producto</Link>
      </PageTitle>

      <Card className="p-0">
        <div className="flex flex-wrap gap-3 border-b p-4">
          <div className="relative min-w-60 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o SKU" className={`${input} pl-9`} />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${input} w-auto`}>
            <option value="">Todas las categorías</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-right">Costo</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map((p) => {
                const low = lowSizes(p).length > 0;
                return (
                  <tr key={p.id} className={`hover:bg-gray-50 ${p.active ? "" : "opacity-50"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Thumb p={p} />
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{categories.find((c) => c.slug === p.category)?.name}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCOP(p.price)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{formatCOP(p.cost)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${low ? "text-orange-600" : ""}`}>{totalStock(p)}</span>
                      {low && <span className="ml-1 text-xs text-orange-600">⚠</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}>
                        {p.active ? "Publicado" : "Oculto"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => toggleActive(p.id)} title={p.active ? "Ocultar" : "Publicar"} className="rounded p-2 hover:bg-gray-200">
                          {p.active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                        <Link href={`/admin/productos/editar?id=${p.id}`} title="Editar" className="rounded p-2 hover:bg-gray-200"><Pencil className="size-4" /></Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-8 text-center text-gray-500">No hay productos que coincidan.</p>}
        </div>
      </Card>
    </>
  );
}
