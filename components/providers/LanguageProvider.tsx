"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { Lang, Localized } from "@/lib/types";
import { dictionaries, LANG_STORAGE_KEY, type Dictionary } from "@/lib/i18n/dictionary";
import { formatDate, pick } from "@/lib/utils";

interface LanguageContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  d: Dictionary;
  setLang: (lang: Lang) => void;
  /** Resolve a Localized value from /data into the active language. */
  t: (value: Localized | undefined) => string;
  date: (iso: string, opts?: Intl.DateTimeFormatOptions) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const pageTitleKey: Record<string, keyof Dictionary["meta"]> = {
  "/events": "events",
  "/about": "about",
  "/leaderboard": "leaderboard",
  "/join": "join",
};

function applyToDocument(lang: Lang) {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === "ar" ? "rtl" : "ltr";
  html.removeAttribute("data-lang-pending");
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start in English so the first client render matches the static HTML (no hydration
  // mismatch); a saved preference is applied right after mount.
  const [lang, setLangState] = useState<Lang>("en");
  const pathname = usePathname();

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LANG_STORAGE_KEY);
    } catch {}
    const initial: Lang = saved === "ar" ? "ar" : "en";
    setLangState(initial);
    applyToDocument(initial);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    applyToDocument(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {}
  }, []);

  // Static pages ship English <title>s, and Next.js may (re)insert them after this effect runs,
  // so re-apply the localized title whenever <head> changes.
  useEffect(() => {
    const meta = dictionaries[lang].meta;
    const key = pageTitleKey[pathname.replace(/\/$/, "")];
    const title = key ? `${meta[key]} | ${meta.siteName}` : meta.siteName;
    const sync = () => {
      if (document.title !== title) document.title = title;
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [lang, pathname]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      d: dictionaries[lang],
      setLang,
      t: (v) => pick(v, lang),
      date: (iso, opts) => formatDate(iso, lang, opts),
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
