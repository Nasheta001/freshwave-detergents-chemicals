"use server";

import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { q } from "@/lib/db";
import { rateLimited, requireAdmin } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";
import { removeUpload, storeUpload } from "@/lib/uploads";
import { SETTING_KEYS } from "@/lib/shared";
import { slugify } from "@/db/catalogue";

const text = (f: FormData, key: string, max = 300) => String(f.get(key) ?? "").trim().slice(0, max);

/* ---------- Session ---------- */

export async function login(_prev: { error: string } | undefined, f: FormData): Promise<{ error: string }> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(`login:${ip}`, 8, 15 * 60 * 1000)) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }
  const email = text(f, "email", 160).toLowerCase();
  const password = String(f.get("password") ?? "");
  const rows = await q("SELECT id, email, password_hash FROM admins WHERE email = $1", [email]);
  // Always run a hash comparison so response time does not reveal whether the email exists.
  const hash = rows[0]?.password_hash ?? "$2a$12$CwTycUXWue0Thq9StjUM0uJ8rQ8eBqK1r9Zl5bqfO2mH3xqgkq9aW";
  const ok = await bcrypt.compare(password, hash);
  if (!rows[0] || !ok) return { error: "Incorrect email or password." };

  const jar = await cookies();
  jar.set(SESSION_COOKIE, await signSession(rows[0].id, rows[0].email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.INSECURE_COOKIES !== "true",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ---------- Products ---------- */

async function uniqueSlug(base: string, ignoreId: number | null): Promise<string> {
  const root = slugify(base) || "product";
  let slug = root;
  for (let n = 2; n < 200; n++) {
    const rows = await q("SELECT id FROM products WHERE slug = $1", [slug]);
    if (!rows[0] || rows[0].id === ignoreId) return slug;
    slug = `${root}-${n}`;
  }
  return `${root}-${Date.now()}`;
}

export async function saveProduct(_prev: { error: string } | undefined, f: FormData): Promise<{ error: string }> {
  await requireAdmin();
  const id = Number(f.get("id")) || null;
  const name = text(f, "name", 160);
  const categoryId = Number(f.get("category_id"));
  if (!name) return { error: "Product name is required." };
  if (!categoryId) return { error: "Choose a category." };

  const availability = text(f, "availability", 20);
  if (!["unconfirmed", "in_stock", "out_of_stock", "on_request"].includes(availability)) {
    return { error: "Choose an availability option." };
  }
  const options = text(f, "options", 1000).split(/[,\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 40);

  const sizes: { label: string; price: number | null }[] = [];
  for (const line of text(f, "sizes", 3000).split("\n")) {
    const [labelRaw, priceRaw] = line.split("|");
    const label = (labelRaw ?? "").trim().slice(0, 60);
    if (!label) continue;
    const cleaned = (priceRaw ?? "").replace(/[^\d.]/g, "");
    const price = cleaned ? Number(cleaned) : null;
    if (price !== null && (!Number.isFinite(price) || price < 0)) return { error: `The price for "${label}" is not a valid number.` };
    sizes.push({ label, price });
  }

  let imageUrl: string | null;
  let sdsUrl: string | null;
  try {
    imageUrl = await storeUpload(f.get("image"), "image");
    sdsUrl = await storeUpload(f.get("sds"), "sds");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }

  const existing = id ? (await q("SELECT image_url, sds_url FROM products WHERE id = $1", [id]))[0] : null;
  if (id && !existing) return { error: "This product no longer exists." };
  const finalImage = imageUrl ?? (f.get("remove_image") ? null : existing?.image_url ?? null);
  const finalSds = sdsUrl ?? (f.get("remove_sds") ? null : existing?.sds_url ?? null);
  const slug = await uniqueSlug(text(f, "slug", 80) || name, id);

  const values = [
    slug,
    name,
    text(f, "trade_name", 160) || null,
    categoryId,
    text(f, "description", 4000),
    text(f, "options_label", 40) || null,
    JSON.stringify(options),
    text(f, "grade", 120) || null,
    availability,
    f.get("featured") === "on",
    finalImage,
    finalSds,
  ];

  let productId = id;
  if (id) {
    await q(
      `UPDATE products SET slug=$1,name=$2,trade_name=$3,category_id=$4,description=$5,options_label=$6,options=$7::jsonb,
       grade=$8,availability=$9,featured=$10,image_url=$11,sds_url=$12,updated_at=now() WHERE id=$13`,
      [...values, id],
    );
    if (existing?.image_url && existing?.image_url !== finalImage) await removeUpload(existing?.image_url);
    if (existing?.sds_url && existing?.sds_url !== finalSds) await removeUpload(existing?.sds_url);
  } else {
    const rows = await q(
      `INSERT INTO products (slug,name,trade_name,category_id,description,options_label,options,grade,availability,featured,image_url,sds_url,sort)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11,$12,
               (SELECT COALESCE(max(sort),0)+1 FROM products WHERE category_id=$4)) RETURNING id`,
      values,
    );
    productId = rows[0].id;
  }

  await q("DELETE FROM product_sizes WHERE product_id = $1", [productId]);
  for (let i = 0; i < sizes.length; i++) {
    await q("INSERT INTO product_sizes (product_id,label,price_kes,sort) VALUES ($1,$2,$3,$4)", [
      productId,
      sizes[i].label,
      sizes[i].price,
      i,
    ]);
  }
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(f: FormData) {
  await requireAdmin();
  const id = Number(f.get("id"));
  const rows = await q("DELETE FROM products WHERE id = $1 RETURNING image_url, sds_url", [id]);
  if (rows[0]) {
    await removeUpload(rows[0].image_url);
    await removeUpload(rows[0].sds_url);
  }
  redirect("/admin/products?deleted=1");
}

/* ---------- Categories ---------- */

export async function saveCategory(f: FormData) {
  await requireAdmin();
  const id = Number(f.get("id")) || null;
  const name = text(f, "name", 80);
  const division = text(f, "division", 20);
  if (!name || !["detergents", "chemicals"].includes(division)) redirect("/admin/categories?error=missing");
  const description = text(f, "description", 300);
  const sort = Number(f.get("sort")) || 0;
  let image: string | null = null;
  try {
    image = await storeUpload(f.get("image"), "image");
  } catch {
    redirect("/admin/categories?error=image");
  }
  if (id) {
    const before = (await q("SELECT image_url FROM categories WHERE id=$1", [id]))[0];
    const finalImage = image ?? (f.get("remove_image") ? null : before?.image_url ?? null);
    await q("UPDATE categories SET name=$1, description=$2, division=$3, sort=$4, image_url=$5 WHERE id=$6", [
      name, description, division, sort, finalImage, id,
    ]);
    if (before?.image_url && before.image_url !== finalImage) await removeUpload(before.image_url);
  } else {
    let slug = slugify(name) || "category";
    if ((await q("SELECT 1 FROM categories WHERE slug=$1", [slug])).length) slug = `${slug}-${Date.now().toString(36)}`;
    await q("INSERT INTO categories (slug,name,description,division,sort,image_url) VALUES ($1,$2,$3,$4,$5,$6)", [
      slug, name, description, division, sort, image,
    ]);
  }
  redirect("/admin/categories?saved=1");
}

export async function deleteCategory(f: FormData) {
  await requireAdmin();
  const id = Number(f.get("id"));
  const used = await q("SELECT count(*)::int AS n FROM products WHERE category_id = $1", [id]);
  if (used[0].n > 0) redirect("/admin/categories?error=in-use");
  const rows = await q("DELETE FROM categories WHERE id = $1 RETURNING image_url", [id]);
  if (rows[0]) await removeUpload(rows[0].image_url);
  redirect("/admin/categories?deleted=1");
}

/* ---------- Enquiries ---------- */

export async function setEnquiryStatus(f: FormData) {
  await requireAdmin();
  const status = text(f, "status", 20);
  if (["new", "in_progress", "closed"].includes(status)) {
    await q("UPDATE enquiries SET status = $1 WHERE id = $2", [status, Number(f.get("id"))]);
  }
  redirect("/admin/enquiries");
}

export async function deleteEnquiry(f: FormData) {
  await requireAdmin();
  await q("DELETE FROM enquiries WHERE id = $1", [Number(f.get("id"))]);
  redirect("/admin/enquiries");
}

/* ---------- Settings ---------- */

export async function saveSettings(f: FormData) {
  await requireAdmin();
  for (const key of SETTING_KEYS) {
    await q(
      "INSERT INTO settings (key,value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [key, text(f, key, 500)],
    );
  }
  redirect("/admin/settings?saved=1");
}
