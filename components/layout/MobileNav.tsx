"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/components/providers/LanguageProvider";
import { isActiveRoute, joinRoute, mainRoutes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export const MOBILE_NAV_ID = "mobile-menu";

/** Collapsible menu shown below the navbar on screens narrower than `lg`. */
export default function MobileNav({ open, pathname }: { open: boolean; pathname: string }) {
  const { d } = useLang();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={MOBILE_NAV_ID}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-line lg:hidden"
        >
          <ul className="space-y-1 px-4 py-4">
            {[...mainRoutes, joinRoute].map((r) => {
              const active = isActiveRoute(pathname, r.href);
              return (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-md border-s-2 px-3 py-3 font-display text-sm uppercase tracking-wider transition-colors",
                      active
                        ? "border-copper-400 bg-elevated-2 text-accent"
                        : "border-transparent text-fg-soft hover:bg-elevated-2 hover:text-accent",
                    )}
                  >
                    {d.nav[r.key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
