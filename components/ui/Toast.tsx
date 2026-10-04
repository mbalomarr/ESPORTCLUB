"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

/**
 * Success notification pinned to the bottom of the viewport. It auto-dismisses after `duration`.
 * The live region is always mounted, so screen readers announce the message when it appears.
 * Rendered into <body> via a portal: ancestors with transform/backdrop-filter (cards, reveal
 * animations) would otherwise become the containing block for `position: fixed` and clip it.
 */
export default function Toast({
  open,
  message,
  closeLabel,
  onClose,
  duration = 6000,
}: {
  open: boolean;
  message: string;
  closeLabel: string;
  onClose: () => void;
  duration?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
            className="glow-copper pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl border border-copper-400/60 bg-elevated px-4 py-3.5 text-fg shadow-2xl"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-copper-500/15 text-accent">
              <CheckCircle2 className="size-5" aria-hidden />
            </span>
            <p className="flex-1 text-sm font-semibold leading-snug">{message}</p>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="grid size-8 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-elevated-2 hover:text-fg"
            >
              <X className="size-4" aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
