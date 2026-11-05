import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ProductGrid from "@/components/ProductGrid";
import { categories, getCategory, productsByCategory } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCategory((await params).slug);
  return c ? { title: `Balones de ${c.name}`, description: c.description } : {};
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  return (
    <>
      <PageHero title={`Balones de ${cat.name}`} text={cat.description} crumb={cat.name} accent={cat.accent} />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ProductGrid products={productsByCategory(slug)} />
      </div>
    </>
  );
}
