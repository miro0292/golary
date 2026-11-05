"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageHero from "@/components/PageHero";
import ProductGrid from "@/components/ProductGrid";
import { searchProducts } from "@/lib/products";

function Results() {
  const q = (useSearchParams().get("q") ?? "").trim();
  const results = searchProducts(q);
  return (
    <>
      <PageHero title={q ? `Resultados para “${q}”` : "Buscar"} crumb="Buscar" accent="#00a8e8" />
      <div className="mx-auto max-w-7xl px-4 py-8">
        {results.length ? (
          <ProductGrid key={q} products={results} />
        ) : (
          <p className="rounded-lg bg-gray-50 p-10 text-center text-gray-500">
            No encontramos productos{q && <> para “{q}”</>}. Prueba con “fútbol”, “futsal” o “voleibol”.
          </p>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<PageHero title="Buscar" crumb="Buscar" accent="#00a8e8" />}>
      <Results />
    </Suspense>
  );
}
