"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useLang } from "@/components/providers/LanguageProvider";
import { isActiveRoute, joinRoute, mainRoutes } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import LangToggle from "./LangToggle";
import ThemeToggle from "./ThemeToggle";
import MobileNav, { MOBILE_NAV_ID } from "./MobileNav";

export default function Navbar({ logo }: { logo: string }) {
  const { d } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open ? "border-b border-line bg-bg/85 backdrop-blur-lg" : "bg-transparent",
      )}
    >
      <nav aria-label={d.nav.main} className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Logo src={logo} alt={d.common.logoAlt} size={40} className="ring-1 ring-copper-500/50" priority />
          <span className="hidden truncate font-display text-sm font-bold uppercase tracking-widest text-fg min-[420px]:inline">
            {d.nav.brandA} <span className="text-accent-2">{d.nav.brandB}</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {mainRoutes.map((r) => {
            const active = isActiveRoute(pathname, r.href);
            return (
              <li key={r.href}>
                <Link
                  href={r.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("relative rounded px-3 py-2 text-sm font-medium transition-colors", active ? "text-accent" : "text-muted hover:text-accent")}
                >
                  {d.nav[r.key]}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-copper-400 to-ember-500"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <ButtonLink href={joinRoute.href} size="sm" className="hidden md:inline-flex">
            {d.nav[joinRoute.key]}
          </ButtonLink>
          <button
            type="button"
            className="grid size-10 place-items-center rounded text-fg lg:hidden"
            aria-expanded={open}
            aria-controls={MOBILE_NAV_ID}
            aria-label={open ? d.nav.closeMenu : d.nav.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </nav>

      <MobileNav open={open} pathname={pathname} />
    </header>
  );
}
