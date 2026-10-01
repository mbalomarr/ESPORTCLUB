"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "./LanguageProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Dark is the signature e-sports look, so it's the default for every visitor.
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <LanguageProvider>
        {/* Respects the OS "reduce motion" setting for every animation. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LanguageProvider>
    </ThemeProvider>
  );
}
