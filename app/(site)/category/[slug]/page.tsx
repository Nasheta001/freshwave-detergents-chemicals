import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueView } from "@/components/CatalogueView";
import { getCategories } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!category) return {};
  const place = category.division === "chemicals" ? "Kenya" : "Mombasa";
  return {
    title: `${category.name} in ${place}`,
    description: `${category.description} Supplied by FreshWave Detergents & Chemicals, Bamburi, Mombasa.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!category) notFound();
  return (
    <CatalogueView title={category.name} intro={category.description} division={category.division} category={category.slug} />
  );
}
