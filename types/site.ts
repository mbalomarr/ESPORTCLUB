import type { Localized } from "./i18n";

export interface Socials {
  x?: string;
  instagram?: string;
  twitch?: string;
  discord?: string;
}

/** Icon names the professor can use for About pillars (data/site.json → about.pillars[].icon). */
export const PILLAR_ICONS = ["swords", "users", "target", "trophy", "gamepad", "zap", "sparkles"] as const;
export type PillarIcon = (typeof PILLAR_ICONS)[number];

export interface Pillar {
  title: Localized;
  icon: PillarIcon;
  text: Localized;
}

export interface Stat {
  label: Localized;
  value: string;
}

export interface SiteConfig {
  clubName: Localized;
  university: Localized;
  tagline: Localized;
  /** Site path to the logo, e.g. "/logo.png". */
  logo: string;
  contactEmail?: string;
  about: {
    vision: Localized;
    pillars: Pillar[];
    stats: Stat[];
  };
  socials: Socials;
  forms: {
    registrationFormspreeId?: string;
    googleFormEmbedUrl?: string;
    voteFormspreeId?: string;
    suggestionFormspreeId?: string;
  };
  live: { twitchChannel?: string; discordServerId?: string };
}
