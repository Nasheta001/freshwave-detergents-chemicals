import type { Metadata, Viewport } from "next";
import "@fontsource-variable/raleway";
import "./globals.css";
import { SITE_URL } from "@/lib/shared";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FreshWave Detergents & Chemicals | Cleaning Products & Raw Chemicals in Mombasa",
    template: "%s | FreshWave Detergents & Chemicals",
  },
  description:
    "FreshWave supplies detergents, cleaning products and chemical raw materials from Bamburi, Mombasa. Household, wholesale and industrial supply across Kenya.",
  openGraph: {
    type: "website",
    siteName: "FreshWave Detergents & Chemicals",
    locale: "en_KE",
  },
};

export const viewport: Viewport = {
  themeColor: "#011C40",
  width: "device-width",
  initialScale: 1,
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
