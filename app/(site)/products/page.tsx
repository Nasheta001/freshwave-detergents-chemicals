import type { Metadata } from "next";
import { CatalogueView } from "@/components/CatalogueView";

export const metadata: Metadata = {
  title: "Shop Cleaning Products & Chemicals in Mombasa",
  description:
    "Browse the full FreshWave catalogue: detergents, cleaning products and chemical raw materials supplied from Bamburi, Mombasa.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 80) : "";
  return (
    <CatalogueView
      title={query ? "Search results" : "All Products"}
      intro="Cleaning products for the home and business, and the raw materials used to make them."
      query={query || undefined}
    />
  );
}
