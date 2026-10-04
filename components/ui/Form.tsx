import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* Accessible form primitives. Each field pairs a <label> with its control via `id`. */

function FieldLabel({ htmlFor, label, hint }: { htmlFor: string; label: string; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="label">
      {label} {hint && <span className="normal-case text-muted">{hint}</span>}
    </label>
  );
}

type TextFieldProps = { id: string; label: string; hint?: string; ltr?: boolean } & InputHTMLAttributes<HTMLInputElement>;

/** `ltr` keeps emails, IDs and phone numbers left-to-right, aligned to the reading edge in Arabic. */
export function TextField({ id, label, hint, ltr, className, ...props }: TextFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} hint={hint} />
      <input id={id} name={id} dir={ltr ? "ltr" : undefined} className={cn("field", ltr && "rtl:text-end", className)} {...props} />
    </div>
  );
}

type TextAreaFieldProps = { id: string; label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ id, label, hint, className, rows = 3, ...props }: TextAreaFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} hint={hint} />
      <textarea id={id} name={id} rows={rows} className={cn("field resize-none", className)} {...props} />
    </div>
  );
}

export interface Choice {
  value: string;
  label: string;
  hint?: string;
}

type SelectFieldProps = { id: string; label: string; placeholder: string; options: Choice[] } & SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({ id, label, placeholder, options, ...props }: SelectFieldProps) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} />
      <select id={id} name={id} className="field" defaultValue="" {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Numbered form step with a decorative rule. */
export function FormSection({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-5 flex w-full items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-accent rtl:text-base">
        {legend}
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-copper-500/50 to-transparent rtl:bg-gradient-to-l" />
      </legend>
      {children}
    </fieldset>
  );
}

const peerFocus = "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember-500";

/** Multi-select checkbox pills. */
export function ChipGroup({ name, label, options }: { name: string; label: string; options: Choice[] }) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input type="checkbox" name={name} value={o.value} className="peer sr-only" />
            <span
              className={cn(
                "inline-flex min-h-10 items-center rounded-full border border-line-strong bg-elevated/60 px-4 text-sm text-fg-soft transition-all",
                "hover:border-steel-400 peer-checked:border-copper-400 peer-checked:bg-copper-500/15 peer-checked:text-accent",
                peerFocus,
              )}
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Single-select radio cards with a title and hint line. */
export function RadioCards({ name, label, options }: { name: string; label: string; options: Choice[] }) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((o, i) => (
          <label key={o.value} className="cursor-pointer">
            <input type="radio" name={name} value={o.value} required defaultChecked={i === 0} className="peer sr-only" />
            <span
              className={cn(
                "block rounded-lg border border-line-strong bg-elevated/60 p-4 transition-all hover:border-steel-400",
                "peer-checked:border-copper-400 peer-checked:bg-copper-500/10 peer-checked:glow-copper",
                peerFocus,
              )}
            >
              <span className="block font-display text-sm font-bold uppercase text-fg">{o.label}</span>
              {o.hint && <span className="text-xs text-muted">{o.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Bot trap: real users never see or fill this; Formspree discards submissions where it's set. */
export function Honeypot() {
  return <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />;
}

/** Announces submission errors to screen readers. */
export function FormError({ message, className }: { message?: string; className?: string }) {
  return (
    <p aria-live="polite" className={cn("min-h-5 text-sm text-red-600 dark:text-red-300", className)}>
      {message}
    </p>
  );
}
