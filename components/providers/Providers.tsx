"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "./LanguageProvider";
import type { Lang } from "@/lib/types";

export default function Providers({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    // Dark is the signature e-sports look, so it's the default for every visitor.
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <LanguageProvider initialLang={lang}>
        {/* Respects the OS "reduce motion" setting for every animation. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LanguageProvider>
    </ThemeProvider>
  );
}
