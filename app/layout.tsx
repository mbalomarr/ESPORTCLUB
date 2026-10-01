import type { Metadata, Viewport } from "next";
import { Cairo, Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";
import { getDictionary, getLang } from "@/lib/i18n/server";
import Providers from "@/components/providers/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/layout/SkipLink";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["500", "700", "900"], variable: "--font-orbitron", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "600", "700", "900"], variable: "--font-cairo", display: "swap" });

// Vercel sets this automatically; used for absolute social-share image URLs.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDictionary();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: d.meta.siteName, template: `%s | ${d.meta.siteName}` },
    description: d.meta.description,
    openGraph: { title: d.meta.siteName, description: d.meta.description, images: [site.logo] },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#060b18" },
    { media: "(prefers-color-scheme: light)", color: "#f3f6fa" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Language comes from a cookie so <html lang/dir> is correct on the very first paint.
  const lang = await getLang();

  return (
    // suppressHydrationWarning: next-themes adds the theme class before React hydrates.
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${orbitron.variable} ${inter.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh overflow-x-hidden">
        <Providers lang={lang}>
          <SkipLink />
          <Navbar logo={site.logo} />
          {/* pt-16 = navbar height, so no page content hides behind the fixed bar */}
          <main id="main" className="pt-16">
            {children}
          </main>
          <Footer site={site} />
        </Providers>
      </body>
    </html>
  );
}
