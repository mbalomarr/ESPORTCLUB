// Runs before every build. If the professor makes a typo in /data/*.json,
// the Vercel build fails with a clear message and the previous version of the
// site stays live, so a mistake never takes the website down.
// Missing Arabic translations are reported as warnings only (English is shown instead).
import { readFileSync } from "node:fs";

const errors = [];
const warnings = [];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
// Keep in sync with PILLAR_ICONS in types/site.ts.
const PILLAR_ICONS = ["swords", "users", "target", "trophy", "gamepad", "zap", "sparkles"];

function load(file) {
  try {
    return JSON.parse(readFileSync(new URL(`../data/${file}`, import.meta.url), "utf8"));
  } catch (e) {
    errors.push(`data/${file}: not valid JSON. Check for a missing comma, quote or bracket. (${e.message})`);
    return null;
  }
}

/** A text field: either "plain text" or { "en": "...", "ar": "..." }. */
function text(obj, field, where, { required = true } = {}) {
  const v = obj?.[field];
  if (v === undefined || v === "") {
    if (required) errors.push(`${where}: missing "${field}"`);
    return;
  }
  if (typeof v === "string") return;
  if (typeof v !== "object" || Array.isArray(v) || v === null) {
    errors.push(`${where}: "${field}" must be text or { "en": "...", "ar": "..." }`);
    return;
  }
  if (typeof v.en !== "string" || !v.en) errors.push(`${where}: "${field}" is missing its "en" (English) text`);
  if (v.ar === undefined || v.ar === "") warnings.push(`${where}: "${field}" has no Arabic ("ar"), so English will be shown`);
  else if (typeof v.ar !== "string") errors.push(`${where}: "${field}".ar must be text in "quotes"`);
}

function need(obj, fields, where) {
  for (const f of fields) {
    if (obj?.[f] === undefined || obj[f] === "") errors.push(`${where}: missing "${f}"`);
  }
}

function date(obj, field, where) {
  if (obj?.[field] && !DATE.test(obj[field])) errors.push(`${where}: ${field} must look like 2026-11-12`);
}

function list(data, file) {
  if (!Array.isArray(data)) {
    errors.push(`data/${file}: must be a list [ ... ]`);
    return [];
  }
  return data;
}

const site = load("site.json");
if (site) {
  const w = "data/site.json";
  need(site, ["logo", "about"], w);
  ["clubName", "university", "tagline"].forEach((f) => text(site, f, w));
  text(site.about, "vision", `${w} about`);
  (site.about?.pillars ?? []).forEach((p, i) => {
    const where = `${w} about.pillars #${i + 1}`;
    text(p, "title", where);
    text(p, "text", where);
    if (!PILLAR_ICONS.includes(p?.icon)) errors.push(`${where}: icon must be one of ${PILLAR_ICONS.join(", ")}`);
  });
  (site.about?.stats ?? []).forEach((s, i) => {
    text(s, "label", `${w} about.stats #${i + 1}`);
    need(s, ["value"], `${w} about.stats #${i + 1}`);
  });
}

const events = load("events.json");
if (events) {
  const ids = new Set();
  list(events, "events.json").forEach((e, i) => {
    const w = `data/events.json item #${i + 1} (${e?.id ?? "no id"})`;
    need(e, ["id", "date", "status"], w);
    text(e, "title", w);
    text(e, "game", w);
    ["location", "format", "prize", "description"].forEach((f) => text(e, f, w, { required: false }));
    date(e, "date", w);
    if (e?.time && !/^\d{2}:\d{2}$/.test(e.time)) errors.push(`${w}: time must look like 18:00`);
    if (e?.status && !["upcoming", "live", "completed"].includes(e.status))
      errors.push(`${w}: status must be "upcoming", "live" or "completed"`);
    if (ids.has(e?.id)) errors.push(`${w}: id "${e.id}" is used twice`);
    ids.add(e?.id);
  });
}

const roster = load("roster.json");
if (roster) {
  list(roster, "roster.json").forEach((m, i) => {
    const w = `data/roster.json item #${i + 1}`;
    text(m, "name", w);
    text(m, "role", w);
    ["major", "mainGame"].forEach((f) => text(m, f, w, { required: false }));
  });
}

const hof = load("hall-of-fame.json");
if (hof) {
  list(hof, "hall-of-fame.json").forEach((h, i) => {
    const w = `data/hall-of-fame.json item #${i + 1}`;
    need(h, ["date"], w);
    ["tournament", "game", "winner"].forEach((f) => text(h, f, w));
    ["runnerUp", "prize"].forEach((f) => text(h, f, w, { required: false }));
    date(h, "date", w);
    if (h?.players !== undefined && !Array.isArray(h.players)) errors.push(`${w}: players must be a list like ["A", "B"]`);
  });
}

const games = load("games.json");
if (games) {
  need(games.poll, ["id"], "data/games.json poll");
  text(games.poll, "question", "data/games.json poll");
  date(games.poll, "closesOn", "data/games.json poll");
  if (!Array.isArray(games.options)) errors.push("data/games.json: options must be a list [ ... ]");
  else
    games.options.forEach((g, i) => {
      const w = `data/games.json option #${i + 1}`;
      need(g, ["id"], w);
      text(g, "name", w);
      text(g, "genre", w, { required: false });
      if (typeof g.votes !== "number") errors.push(`${w}: votes must be a number (no quotes)`);
    });
}

if (warnings.length) {
  console.warn("\n⚠ Missing translations (site still works, English is shown):\n");
  warnings.forEach((w) => console.warn("  • " + w));
}
if (errors.length) {
  console.error("\n✖ Content check failed:\n");
  errors.forEach((e) => console.error("  • " + e));
  console.error("");
  process.exit(1);
}
console.log("✓ All /data files are valid.");
