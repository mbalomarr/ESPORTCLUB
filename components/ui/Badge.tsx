import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  accent: "bg-copper-500/15 text-accent border-copper-400/50",
  info: "bg-steel-500/10 text-info border-steel-400/40",
  danger: "bg-red-500/15 text-red-700 border-red-500/50 dark:text-red-300",
} as const;

export type BadgeTone = keyof typeof tones;

export default function Badge({
  tone = "accent",
  pulse,
  className,
  children,
}: {
  tone?: BadgeTone;
  /** Animated dot, e.g. for "Live". */
  pulse?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-1 font-display text-[0.65rem] font-bold uppercase tracking-widest backdrop-blur rtl:text-xs",
        tones[tone],
        className,
      )}
    >
      {pulse && <span aria-hidden className="inline-block size-1.5 animate-pulse rounded-full bg-current" />}
      {children}
    </span>
  );
}
