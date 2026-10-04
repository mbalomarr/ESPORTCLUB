import type { Dictionary } from "@/lib/i18n/dictionary";

type NavKey = keyof Pick<Dictionary["nav"], "home" | "events" | "leaderboard" | "about" | "join">;

export interface NavRoute {
  href: string;
  key: NavKey;
}

/** Primary pages, in menu order. Labels come from the dictionary (`d.nav[key]`). */
export const mainRoutes: NavRoute[] = [
  { href: "/", key: "home" },
  { href: "/events", key: "events" },
  { href: "/leaderboard", key: "leaderboard" },
  { href: "/about", key: "about" },
];

export const joinRoute: NavRoute = { href: "/join", key: "join" };

/** Active-link check that ignores the trailing slash added by the static export. */
export function isActiveRoute(pathname: string, href: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
}
