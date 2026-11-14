import "server-only";
import { cache } from "react";
import { q } from "./db";

import { SETTING_KEYS, type Category, type Product, type Settings, type Division } from "./shared";
export * from "./shared";

export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await q<{ key: string; value: string }>("SELECT key, value FROM settings");
  const out = Object.fromEntries(SETTING_KEYS.map((k) => [k, ""])) as Settings;
  for (const r of rows) if (r.key in out) (out as any)[r.key] = r.value;
  return out;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  return q<Category>(
    `SELECT c.*, (SELECT count(*)::int FROM products p WHERE p.category_id = c.id) AS product_count
     FROM categories c ORDER BY c.division DESC, c.sort, c.name`,
  );
});

const PRODUCT_SELECT = `
  SELECT p.id, p.slug, p.name, p.trade_name, p.category_id, p.description, p.options_label, p.options,
         p.grade, p.availability, p.featured, p.image_url, p.sds_url,
         c.name AS category_name, c.slug AS category_slug, c.division,
         COALESCE((SELECT json_agg(json_build_object('id', s.id, 'label', s.label, 'price', s.price_kes) ORDER BY s.sort, s.id)
                   FROM product_sizes s WHERE s.product_id = p.id), '[]'::json) AS sizes
  FROM products p JOIN categories c ON c.id = p.category_id`;

function normalise(row: any): Product {
  const parse = (v: any) => (typeof v === "string" ? JSON.parse(v) : v) ?? [];
  return {
    ...row,
    options: parse(row.options),
    sizes: parse(row.sizes).map((s: any) => ({
      id: s.id,
      label: s.label,
      price: s.price === null || s.price === undefined ? null : Number(s.price),
    })),
  };
}

export async function listProducts(
  opts: { q?: string; division?: Division; category?: string; featured?: boolean; limit?: number } = {},
): Promise<Product[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (opts.q) {
    params.push(`%${opts.q.replace(/[%_\\]/g, "\\$&")}%`);
    where.push(`(p.name ILIKE $${params.length} OR p.trade_name ILIKE $${params.length} OR c.name ILIKE $${params.length})`);
  }
  if (opts.division) {
    params.push(opts.division);
    where.push(`c.division = $${params.length}`);
  }
  if (opts.category) {
    params.push(opts.category);
    where.push(`c.slug = $${params.length}`);
  }
  if (opts.featured) where.push("p.featured = TRUE");
  let sql = PRODUCT_SELECT;
  if (where.length) sql += ` WHERE ${where.join(" AND ")}`;
  sql += " ORDER BY c.division DESC, c.sort, p.sort, p.name";
  if (opts.limit) {
    params.push(opts.limit);
    sql += ` LIMIT $${params.length}`;
  }
  return (await q(sql, params)).map(normalise);
}

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const rows = await q(`${PRODUCT_SELECT} WHERE p.slug = $1`, [slug]);
  return rows[0] ? normalise(rows[0]) : null;
});

export async function getProductById(id: number): Promise<Product | null> {
  const rows = await q(`${PRODUCT_SELECT} WHERE p.id = $1`, [id]);
  return rows[0] ? normalise(rows[0]) : null;
}

export async function relatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await q(
    `${PRODUCT_SELECT} WHERE p.category_id = $1 AND p.id <> $2 ORDER BY abs(p.sort - (SELECT sort FROM products WHERE id = $2)), p.name LIMIT $3`,
    [product.category_id, product.id, limit],
  );
  return rows.map(normalise);
}

