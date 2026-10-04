"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import type { SiteConfig } from "@/types";
import Logo from "@/components/ui/Logo";
import SocialLinks from "@/components/ui/SocialLinks";
import { useLang } from "@/components/providers/LanguageProvider";
import { joinRoute, mainRoutes } from "@/lib/navigation";

// Every page except Home (the navbar logo links there).
const links = [...mainRoutes.filter((r) => r.href !== "/"), joinRoute];

export default function Footer({ site }: { site: SiteConfig }) {
  const { d, t } = useLang();
  return (
    <footer className="relative border-t border-line bg-elevated">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-copper-500/70 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-center sm:px-6 md:grid-cols-3 md:items-center md:text-start">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Logo src={site.logo} alt={d.common.logoAlt} size={56} />
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-fg">{t(site.clubName)}</p>
            <p className="text-sm text-muted">{t(site.university)}</p>
          </div>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-muted transition-colors hover:text-accent">
                {d.nav[l.key]}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center gap-3 md:items-end">
          <SocialLinks socials={site.socials} />
          {site.contactEmail && (
            <a href={`mailto:${site.contactEmail}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
              <Mail className="size-4" aria-hidden /> <span dir="ltr">{site.contactEmail}</span>
            </a>
          )}
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} {t(site.clubName)}. {d.footer.rights}
      </p>
    </footer>
  );
}
