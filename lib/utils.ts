export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** "/ESPORTCLUB" on GitHub Pages (set in next.config.mjs). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix site-relative paths ("/logo.png") with the base path. Full URLs pass through.
 * Needed because next/image and <img> don't apply basePath automatically.
 */
export function asset(src: string) {
  return src.startsWith("/") && !src.startsWith("//") ? `${basePath}${src}` : src;
}

export function isExternalUrl(href: string) {
  return /^https?:\/\//.test(href);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
