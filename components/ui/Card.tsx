import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardStyleProps {
  /** Copper border + glow on hover. */
  hover?: boolean;
  /** HUD-style cut corners. */
  chamfer?: boolean;
  className?: string;
}

export function cardClass({ hover, chamfer, className }: CardStyleProps = {}) {
  return cn("panel", hover && "panel-hover", chamfer && "clip-chamfer", className);
}

type CardProps = CardStyleProps & HTMLAttributes<HTMLElement> & { as?: "div" | "article" | "section" };

export function Card({ as: Tag = "div", hover, chamfer, className, ...props }: CardProps) {
  return <Tag className={cardClass({ hover, chamfer, className })} {...props} />;
}
