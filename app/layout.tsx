import type { Metadata, Viewport } from "next";
import { Cairo, Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";
import { dictionaries, LANG_STORAGE_KEY } from "@/lib/i18n/dictionary";
import Providers from "@/components/providers/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/layout/SkipLink";
import { basePath } from "@/lib/utils";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["500", "700", "900"], variable: "--font-orbitron", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "600", "700", "900"], variable: "--font-cairo", display: "swap" });

const d = dictionaries.en;

export const metadata: Metadata = {
  metadataBase: new URL("https://mbalomarr.github.io"),
  title: { default: d.meta.siteName, template: `%s | ${d.meta.siteName}` },
  description: d.meta.description,
  openGraph: { title: d.meta.siteName, description: d.meta.description, images: [`${basePath}${site.logo}`] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#060b18" },
    { media: "(prefers-color-scheme: light)", color: "#f3f6fa" },
  ],
};

// The site is static HTML (rendered in English). For returning Arabic visitors this runs before
// first paint: it applies lang/dir immediately and briefly hides the page until React swaps the text,
// so they never see a flash of English. The timeout is a failsafe if JavaScript errors out.
const langBootScript = `try{if(localStorage.getItem("${LANG_STORAGE_KEY}")==="ar"){var h=document.documentElement;h.lang="ar";h.dir="rtl";h.setAttribute("data-lang-pending","");setTimeout(function(){h.removeAttribute("data-lang-pending")},1500)}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the boot script and next-themes adjust <html> attributes before React hydrates.
    <html lang="en" dir="ltr" className={`${orbitron.variable} ${inter.variable} ${cairo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: langBootScript }} />
      </head>
      <body className="min-h-dvh overflow-x-hidden">
        <Providers>
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
