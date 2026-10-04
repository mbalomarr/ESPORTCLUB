import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Square framed icon used at the top of cards. */
export default function IconTile({
  tone = "copper",
  className,
  children,
}: {
  tone?: "copper" | "steel";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-lg border",
        tone === "copper" ? "border-copper-500/40 bg-copper-500/10 text-accent" : "border-steel-400/40 bg-steel-500/10 text-info",
        className,
      )}
    >
      {children}
    </span>
  );
}
