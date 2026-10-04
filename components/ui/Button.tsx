import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn, isExternalUrl } from "@/lib/utils";

interface ButtonStyleProps {
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  /** HUD-style cut corners. */
  chamfer?: boolean;
  fullWidth?: boolean;
  className?: string;
}

function buttonClass({ variant = "primary", size = "md", chamfer = true, fullWidth, className }: ButtonStyleProps = {}) {
  return cn(
    "btn",
    variant === "primary" ? "btn-primary" : "btn-ghost",
    size === "sm" && "min-h-10! px-4! py-2!",
    chamfer && "clip-chamfer",
    fullWidth && "w-full",
    className,
  );
}

type ButtonProps = ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant, size, chamfer, fullWidth, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, chamfer, fullWidth, className })} {...props} />;
}

type ButtonLinkProps = ButtonStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; children: ReactNode };

/** Internal paths use client-side navigation; full URLs open in a new tab. */
export function ButtonLink({ href, variant, size, chamfer, fullWidth, className, ...props }: ButtonLinkProps) {
  const classes = buttonClass({ variant, size, chamfer, fullWidth, className });
  if (isExternalUrl(href)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props} />;
  }
  return <Link href={href} className={classes} {...props} />;
}
