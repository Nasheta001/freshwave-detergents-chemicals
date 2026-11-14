import "server-only";
import path from "node:path";
import fs from "node:fs";
import bcrypt from "bcryptjs";
import { SCHEMA_SQL } from "@/db/schema";
import { CATALOGUE, defaultDescription, slugify } from "@/db/catalogue";

type Row = Record<string, any>;
type Client = {
  query: (sql: string, params?: unknown[]) => Promise<{ rows: Row[] }>;
  exec: (sql: string) => Promise<void>;
};

const store = globalThis as unknown as { __fwDb?: Promise<Client> };

async function connect(): Promise<Client> {
  let client: Client;
  if (process.env.DATABASE_URL) {
    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : undefined,
      max: 5,
    });
    client = {
      query: (sql, params) => pool.query(sql, params as any[]),
      exec: async (sql) => {
        await pool.query(sql);
      },
    };
  } else {
    if (process.env.NODE_ENV === "production") {
      console.warn("[freshwave] DATABASE_URL is not set. Using the embedded database in ./.data.");
    }
    const { PGlite } = await import("@electric-sql/pglite");
    const dir = path.join(process.cwd(), ".data", "pg");
    fs.mkdirSync(dir, { recursive: true });
    const lite = new PGlite(dir);
    client = {
      query: (sql, params) => lite.query(sql, params as any[]) as Promise<{ rows: Row[] }>,
      exec: async (sql) => {
        await lite.exec(sql);
      },
    };
  }
  await client.exec(SCHEMA_SQL);
  await seedIfEmpty(client);
  await ensureAdmin(client);
  return client;
}

async function seedIfEmpty(db: Client) {
  const { rows } = await db.query("SELECT count(*)::int AS n FROM categories");
  if (rows[0].n > 0) return;
  const used = new Set<string>();
  let catSort = 0;
  for (const cat of CATALOGUE) {
    const inserted = await db.query(
      "INSERT INTO categories (slug,name,description,division,sort) VALUES ($1,$2,$3,$4,$5) RETURNING id",
      [cat.slug, cat.name, cat.description, cat.division, catSort++],
    );
    const categoryId = inserted.rows[0].id;
    let sort = 0;
    for (const item of cat.products) {
      const p = typeof item === "string" ? { name: item } : item;
      let slug = slugify(p.name);
      if (used.has(slug)) slug = `${slug}-${cat.slug}`;
      used.add(slug);
      await db.query(
        `INSERT INTO products (slug,name,trade_name,category_id,description,options_label,options,featured,sort)
         VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9)`,
        [
          slug,
          p.name,
          p.trade ?? null,
          categoryId,
          defaultDescription(p.name, cat),
          p.optionsLabel ?? null,
          JSON.stringify(p.options ?? []),
          p.featured ?? false,
          sort++,
        ],
      );
    }
  }
  await db.query(
    "INSERT INTO settings (key,value) VALUES ('address','Bamburi, Mombasa, Kenya') ON CONFLICT (key) DO NOTHING",
  );
}

async function ensureAdmin(db: Client) {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const { rows } = await db.query("SELECT count(*)::int AS n FROM admins");
  if (rows[0].n > 0) return;
  const hash = await bcrypt.hash(password, 12);
  await db.query("INSERT INTO admins (email,password_hash) VALUES ($1,$2) ON CONFLICT DO NOTHING", [
    email,
    hash,
  ]);
}

function db(): Promise<Client> {
  if (!store.__fwDb) {
    store.__fwDb = connect().catch((err) => {
      store.__fwDb = undefined;
      throw err;
    });
  }
  return store.__fwDb;
}

export async function q<T extends Row = Row>(sql: string, params: unknown[] = []): Promise<T[]> {
  const client = await db();
  const res = await client.query(sql, params);
  return res.rows as T[];
}
