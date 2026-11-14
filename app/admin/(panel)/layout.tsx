import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FolderTree, Inbox, LayoutDashboard, LogOut, Package, Settings } from "lucide-react";
import { Logo } from "@/components/Logo";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/settings", label: "Business details", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-mist lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-white lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-5">
          <Logo />
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-navy hover:bg-mist">
              <n.icon size={17} className="text-ocean" /> {n.label}
            </Link>
          ))}
          <Link href="/" target="_blank" className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-navy hover:bg-mist">
            <ExternalLink size={17} className="text-ocean" /> View website
          </Link>
        </nav>
        <form action={logout} className="border-t border-line p-3">
          <p className="truncate px-3 pb-2 text-xs text-muted">{admin.email}</p>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-navy hover:bg-mist">
            <LogOut size={17} className="text-ocean" /> Sign out
          </button>
        </form>
      </aside>
      <main className="p-5 lg:p-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
