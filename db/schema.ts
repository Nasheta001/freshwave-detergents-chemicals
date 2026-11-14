export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  division TEXT NOT NULL CHECK (division IN ('detergents','chemicals')),
  sort INTEGER NOT NULL DEFAULT 0,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  trade_name TEXT,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description TEXT NOT NULL DEFAULT '',
  options_label TEXT,
  options JSONB NOT NULL DEFAULT '[]',
  grade TEXT,
  availability TEXT NOT NULL DEFAULT 'unconfirmed'
    CHECK (availability IN ('unconfirmed','in_stock','out_of_stock','on_request')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  image_url TEXT,
  sds_url TEXT,
  sort INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);

CREATE TABLE IF NOT EXISTS product_sizes (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price_kes NUMERIC(12,2),
  sort INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS product_sizes_product_idx ON product_sizes(product_id);

CREATE TABLE IF NOT EXISTS enquiries (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('basket','wholesale','contact')),
  name TEXT,
  phone TEXT,
  email TEXT,
  business TEXT,
  message TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;
