"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLang } from "@/components/providers/LanguageProvider";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { d } = useLang();
  // The theme is unknown during server rendering; render a neutral shell until mounted
  // so the server and client HTML match (no hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== "light";
  const label = isDark ? d.nav.themeToLight : d.nav.themeToDark;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? label : undefined}
      title={mounted ? label : undefined}
      className="relative grid size-10 place-items-center overflow-hidden rounded-full border border-line-strong bg-elevated/60 text-fg transition-colors hover:border-copper-400 hover:text-accent"
    >
      {mounted && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ y: 14, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -14, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <Moon className="size-[18px]" aria-hidden /> : <Sun className="size-[18px]" aria-hidden />}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
