export type Division = "detergents" | "chemicals";
export type Availability = "unconfirmed" | "in_stock" | "out_of_stock" | "on_request";

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string;
  division: Division;
  sort: number;
  image_url: string | null;
  product_count: number;
};

export type Size = { id: number; label: string; price: number | null };

export type Product = {
  id: number;
  slug: string;
  name: string;
  trade_name: string | null;
  category_id: number;
  category_name: string;
  category_slug: string;
  division: Division;
  description: string;
  options_label: string | null;
  options: string[];
  grade: string | null;
  availability: Availability;
  featured: boolean;
  image_url: string | null;
  sds_url: string | null;
  sizes: Size[];
};

export type Settings = {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  facebook: string;
  instagram: string;
  tiktok: string;
};

export const SETTING_KEYS: (keyof Settings)[] = [
  "whatsapp",
  "phone",
  "email",
  "address",
  "hours",
  "facebook",
  "instagram",
  "tiktok",
];

export const DIVISION_LABEL: Record<Division, string> = {
  detergents: "Detergents",
  chemicals: "Raw Chemicals",
};

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  unconfirmed: "Ask for availability",
  in_stock: "In stock",
  out_of_stock: "Out of stock",
  on_request: "Available on request",
};

export function lowestPrice(p: Product): number | null {
  const prices = p.sizes.map((s) => s.price).filter((v): v is number => v !== null);
  return prices.length ? Math.min(...prices) : null;
}

export function formatKes(n: number): string {
  return `KES ${n.toLocaleString("en-KE", { maximumFractionDigits: 2 })}`;
}

export function whatsappUrl(number: string, text: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 9) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/* Shop location. Exact coordinates supplied by the business. */
export const SHOP = {
  name: "FreshWave Detergents & Chemicals",
  area: "Bamburi, Mombasa, Kenya",
  lat: -3.9998548,
  lng: 39.7069962,
  embedUrl: "https://www.google.com/maps?q=-3.9998548,39.7069962&z=17&output=embed",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=-3.9998548%2C39.7069962",
  mapUrl: "https://www.google.com/maps?q=-3.9998548,39.7069962&z=17",
} as const;
