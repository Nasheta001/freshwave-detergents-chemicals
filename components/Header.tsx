"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, MessageCircle, Search, ShoppingBasket, X } from "lucide-react";
import { Logo } from "./Logo";
import { useBasket } from "./basket";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop Products" },
  { href: "/detergents", label: "Detergents" },
  { href: "/raw-chemicals", label: "Raw Chemicals" },
  { href: "/contact#find-us", label: "Find Our Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Header({ whatsappHref }: { whatsappHref: string | null }) {
  const pathname = usePathname();
  const { count, ready } = useBasket();
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setSearch(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawer(false);
        setSearch(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  useEffect(() => {
    if (search) searchRef.current?.focus();
  }, [search]);

  const overHero = pathname === "/" && !scrolled && !search;
  const tone = overHero ? "light" : "dark";
  const iconBtn = `grid h-10 w-10 place-items-center rounded-full transition-colors ${
    overHero ? "text-white hover:bg-white/10" : "text-navy hover:bg-mist"
  }`;
  const isActive = (href: string) => (href.includes("#") ? false : href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${
          overHero
            ? "border-b border-transparent bg-transparent"
            : "border-b border-line/70 bg-white/85 shadow-[0_6px_24px_-18px_rgba(1,28,64,0.5)] backdrop-blur-md"
        }`}
      >
        <div className="container-fw flex h-[72px] items-center justify-between gap-2 sm:gap-4">
          <Link href="/" aria-label="FreshWave home">
            <Logo tone={tone} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-5 xl:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`relative whitespace-nowrap py-2 text-[14.5px] font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:transition-transform hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 ${
                  overHero
                    ? "text-white/90 after:bg-ice hover:text-white"
                    : "text-navy after:bg-teal hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <button type="button" className={iconBtn} aria-label="Search products" onClick={() => setSearch((s) => !s)}>
              {search ? <X size={20} /> : <Search size={20} />}
            </button>
            <Link href="/basket" className={`${iconBtn} relative`} aria-label={`Enquiry basket, ${count} items`}>
              <ShoppingBasket size={20} />
              {ready && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-teal px-1 text-[11px] font-bold text-ink">
                  {count}
                </span>
              )}
            </Link>
            <a
              href={whatsappHref ?? "/contact"}
              target={whatsappHref ? "_blank" : undefined}
              rel={whatsappHref ? "noopener noreferrer" : undefined}
              className={`btn btn-sm ml-2 hidden sm:inline-flex ${overHero ? "btn-light" : "btn-primary"}`}
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            <button
              type="button"
              className={`${iconBtn} xl:hidden`}
              aria-label="Open menu"
              aria-expanded={drawer}
              onClick={() => setDrawer(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {search && (
          <div className="border-t border-line bg-white">
            <form action="/products" role="search" className="container-fw flex items-center gap-3 py-3">
              <Search size={18} className="shrink-0 text-ocean" />
              <input
                ref={searchRef}
                name="q"
                type="search"
                placeholder="Search products, for example caustic soda or dishwashing liquid"
                aria-label="Search products"
                className="h-11 w-full bg-transparent text-[15px] outline-none placeholder:text-muted/70"
              />
              <button className="btn btn-primary btn-sm" type="submit">
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 xl:hidden ${drawer ? "" : "pointer-events-none"}`}
        aria-hidden={!drawer}
      >
        <div
          className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${drawer ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawer(false)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            drawer ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
            <Logo />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full text-navy hover:bg-mist"
              aria-label="Close menu"
              onClick={() => setDrawer(false)}
              tabIndex={drawer ? 0 : -1}
            >
              <X size={22} />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                tabIndex={drawer ? 0 : -1}
                aria-current={isActive(l.href) ? "page" : undefined}
                className="flex items-center justify-between border-b border-line/70 py-4 text-[17px] font-semibold text-navy aria-[current=page]:text-ocean"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="grid gap-3 border-t border-line p-5">
            <Link href="/basket" className="btn btn-outline" tabIndex={drawer ? 0 : -1}>
              <ShoppingBasket size={17} /> Enquiry basket{ready && count > 0 ? ` (${count})` : ""}
            </Link>
            <a
              href={whatsappHref ?? "/contact"}
              target={whatsappHref ? "_blank" : undefined}
              rel={whatsappHref ? "noopener noreferrer" : undefined}
              className="btn btn-primary"
              tabIndex={drawer ? 0 : -1}
            >
              <MessageCircle size={17} /> Chat on WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
