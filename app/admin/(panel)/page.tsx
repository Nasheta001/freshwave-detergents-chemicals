import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { q } from "@/lib/db";
import { getSettings } from "@/lib/data";

export default async function Dashboard() {
  const [counts, settings, recent] = await Promise.all([
    q(`SELECT (SELECT count(*)::int FROM products) AS products,
              (SELECT count(*)::int FROM products WHERE image_url IS NULL) AS no_photo,
              (SELECT count(*)::int FROM categories) AS categories,
              (SELECT count(*)::int FROM enquiries WHERE status = 'new') AS new_enquiries`),
    getSettings(),
    q("SELECT id, kind, name, phone, created_at FROM enquiries ORDER BY created_at DESC LIMIT 5"),
  ]);
  const c = counts[0];
  const missing = [
    !settings.whatsapp && "WhatsApp number",
    !settings.phone && "phone number",
    !settings.email && "email address",
    !settings.hours && "opening hours",
  ].filter(Boolean);
  const stats = [
    { label: "Products", value: c.products, href: "/admin/products" },
    { label: "Products without a photo", value: c.no_photo, href: "/admin/products?photo=missing" },
    { label: "Categories", value: c.categories, href: "/admin/categories" },
    { label: "New enquiries", value: c.new_enquiries, href: "/admin/enquiries" },
  ];
  return (
    <>
      <h1 className="text-2xl font-extrabold">Dashboard</h1>
      {missing.length > 0 && (
        <div className="mt-5 flex gap-3 rounded-[var(--radius-card)] border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>
            Not yet set: {missing.join(", ")}. These are hidden on the website until you add them.{" "}
            <Link href="/admin/settings" className="font-bold underline">Add business details</Link>
          </p>
        </div>
      )}
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="card block p-5 hover:border-ocean">
              <p className="text-3xl font-extrabold text-ink">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-10 text-lg font-bold">Latest enquiries</h2>
      {recent.length === 0 ? (
        <p className="card mt-3 p-6 text-sm text-muted">No enquiries yet.</p>
      ) : (
        <ul className="card mt-3 divide-y divide-line">
          {recent.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
              <span className="font-semibold text-ink">{e.name || "No name given"}</span>
              <span className="text-muted">{e.kind} · {e.phone || "no phone"} · {new Date(e.created_at).toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
