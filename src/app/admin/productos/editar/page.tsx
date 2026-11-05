"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { useAdmin } from "@/context/AdminStore";

function Editor() {
  const id = useSearchParams().get("id") ?? "";
  const { product } = useAdmin();
  const p = product(id);
  if (!p)
    return (
      <p className="text-gray-500">
        Producto no encontrado. <Link href="/admin/productos" className="text-brand-dark underline">Volver</Link>
      </p>
    );
  return <ProductForm key={p.id} initial={p} />;
}

export default function EditProductPage() {
  return (
    <Suspense>
      <Editor />
    </Suspense>
  );
}
