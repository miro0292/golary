import PageHero from "@/components/PageHero";
import ProductGrid from "@/components/ProductGrid";
import { onSale } from "@/lib/products";

export const metadata = { title: "Ofertas" };

export default function OffersPage() {
  return (
    <>
      <PageHero title="Ofertas" text="Precios especiales directo de fábrica, por tiempo limitado." crumb="Ofertas" accent="#e4002b" />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ProductGrid products={onSale()} />
      </div>
    </>
  );
}
