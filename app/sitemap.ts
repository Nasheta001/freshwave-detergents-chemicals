import type { MetadataRoute } from "next";
import { SITE_URL, getCategories, listProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), listProducts()]);
  const fixed = ["", "/products", "/detergents", "/raw-chemicals", "/wholesale", "/about", "/contact", "/privacy", "/terms"];
  return [
    ...fixed.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: `${SITE_URL}/category/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
