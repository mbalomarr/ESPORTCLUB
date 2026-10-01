// Brand marks as inline SVGs (Lucide no longer ships brand icons).
type P = { className?: string };

export const DiscordIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M20.32 4.37A19.8 19.8 0 0 0 15.39 2.8a13.9 13.9 0 0 0-.63 1.29 18.4 18.4 0 0 0-5.52 0 13 13 0 0 0-.64-1.29 19.7 19.7 0 0 0-4.93 1.53C.53 9.05-.32 13.6.1 18.1a19.9 19.9 0 0 0 6.04 3.05c.49-.66.92-1.36 1.3-2.1a12.9 12.9 0 0 1-2.04-.98l.5-.39a14.2 14.2 0 0 0 12.2 0l.5.39c-.65.39-1.33.71-2.05.98.38.74.81 1.44 1.3 2.1a19.8 19.8 0 0 0 6.05-3.05c.5-5.22-.84-9.73-3.58-13.73ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42s.96-2.42 2.16-2.42c1.21 0 2.18 1.09 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.42s.95-2.42 2.15-2.42c1.21 0 2.18 1.09 2.16 2.42 0 1.34-.95 2.42-2.16 2.42Z" />
  </svg>
);

export const TwitchIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M11.57 4.71h1.72v5.14h-1.72Zm4.71 0H18v5.14h-1.72ZM6 0 1.71 4.29v15.42h5.15V24l4.28-4.29h3.43L22.29 12V0Zm14.57 11.14-3.43 3.43h-3.43l-3 3v-3H6.86V1.71h13.71Z" />
  </svg>
);

export const InstagramIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);

export const XIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41Z" />
  </svg>
);
