/**
 * One-shot script: walk acf-field-groups.json and inject enhanced
 * `instructions` strings on the fields that need them.
 *
 * Two categories handled:
 *   1. MISSING — fields with no `instructions` key yet. Adds one
 *      immediately after `name`.
 *   2. OVERRIDES — fields whose existing `instructions` text is
 *      thin or could be more actionable. Replaces in place.
 *
 * Idempotent: re-running with the same mapping leaves the file
 * unchanged. Keep the script in the repo as a record of what
 * editor copy was authored where.
 *
 * Usage:
 *   node scripts/enhance-acf-instructions.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = resolve(
  __dirname,
  "..",
  "wordpress",
  "acf-field-groups.json"
);

// Mapping: field `key` → instructions text. All keys are the
// `field_180life_*` IDs in the JSON, picked deliberately rather
// than by name because some names (label, description, icon)
// repeat across multiple groups.
const INSTRUCTIONS = {
  // ---------- Site Settings → Leadership Page (added in v1.5) ----
  field_180life_ss_leadership_pastors_heading:
    "First word of the heading. Stays charcoal (non-accent). Default 'Our' — change if you want 'The' or 'Meet Our' etc.",
  field_180life_ss_leadership_pastors_description:
    "One- or two-sentence intro shown beneath the Pastors heading. Sets the tone for the section.",
  field_180life_ss_leadership_staff_label:
    "Small uppercase eyebrow above the Staff heading. Example: 'The People Who Make It Happen'.",
  field_180life_ss_leadership_staff_heading:
    "First word of the heading. Stays charcoal (non-accent). Default 'Our'.",
  field_180life_ss_leadership_staff_heading_accent:
    "Second word of the heading, shown in amber. Default 'Team' — change to 'Staff', 'Crew', etc.",
  field_180life_ss_leadership_staff_description:
    "One- or two-sentence intro shown beneath the Staff heading.",
  field_180life_ss_leadership_elders_label:
    "Small uppercase eyebrow above the Elders heading. Example: 'Shepherding With Integrity'.",
  field_180life_ss_leadership_elders_heading:
    "First word of the heading. Stays white (this section renders on dark background). Default 'Our'.",
  field_180life_ss_leadership_elders_heading_accent:
    "Second word of the heading, shown in amber. Default 'Elders'.",
  field_180life_ss_leadership_elders_description:
    "Intro paragraph shown beneath the Elders heading. Several sentences OK — this section lives on the dark band and reads more like a paragraph than the lighter staff/pastor sections.",

  // ---------- Site Settings CTA ---------------------------------
  field_180life_ss_cta_primary_text:
    "Text on the main CTA button at the bottom of the homepage (e.g. 'I'm New Here', 'Plan Your Visit'). Keep it 2–4 words.",

  // ---------- Ministry Page → Feature Cards (added in v1.6) -----
  field_180life_mp_fc_label:
    "Short label shown above the card description. Example: 'Stand Firm', 'Faith-Filled Fun', 'Real Relationships'.",
  field_180life_mp_fc_description:
    "1–2 line elaboration of what this card stands for. Keep it tight — the cards work best when they read at a glance.",

  // ---------- Ministry Page → Process Steps (added in v1.8) -----
  field_180life_mp_ps_icon:
    "Icon shown in the medallion at the top of this step. Same options as the hero icon — pick one that matches the action (Compass for 'Browse', MessageCircle for 'Reach Out', etc.).",

  // ---------- Ministry Page → Tier Cards (added in v1.8) --------
  field_180life_mp_tc_icon:
    "Icon shown in the colored tile at the top of this card. Same options as the hero icon — Baby for Nursery, GraduationCap for Students, Music for Worship, etc.",

  // ---------- Ministry Page → Callout (added in v1.8) -----------
  field_180life_mp_callout_icon:
    "Optional icon medallion shown next to the callout heading. Adds a visual anchor — Shield for safety policies, MessageCircle for outreach, BookOpen for FAQ, etc.",

  // ---------- Ministry Page → Schedule --------------------------
  field_180life_mp_sched_location:
    "Optional location detail. Example: '180 Still Road, Bloomfield', 'Online via Zoom', 'Main Auditorium'. Leave blank if the day + time is enough on its own.",

  // ---------- Ministry Page → Leaders ---------------------------
  field_180life_mp_leader_name:
    "Full name as it should appear on the card. Example: 'Jennifer Byrne'.",
  field_180life_mp_leader_role:
    "Their role on this ministry team. Example: 'Children's Ministry Director', 'Care Coordinator'. Different from the church-wide role on the Staff page — this is ministry-specific.",
  field_180life_mp_leader_image:
    "Square or 3:4 portrait photo. 600×600 or larger works well. Optional — initials render if blank.",

  // ---------- Ministry Page → SEO -------------------------------
  field_180life_mp_seo_description:
    "Search-result snippet (the 1-2 lines shown beneath the title in Google results). Aim for 140–160 characters. Leave blank to fall back to the site default.",
};

const source = readFileSync(target, "utf-8");
let updated = source;
let added = 0;
let replaced = 0;
let skipped = 0;

for (const [key, instructions] of Object.entries(INSTRUCTIONS)) {
  // Match the entire field object for this key. We need the
  // full braces so we can find the right `name:` line within it.
  const fieldRe = new RegExp(
    `(\\{[^{}]*"key": "${key}"[^{}]*?\\})`,
    "g"
  );
  updated = updated.replace(fieldRe, (block) => {
    const desired = JSON.stringify(instructions);
    // Already has instructions — replace if different, skip if same.
    const existingMatch = block.match(/"instructions": "([^"\\]*(?:\\.[^"\\]*)*)"/);
    if (existingMatch) {
      if (existingMatch[0] === `"instructions": ${desired}`) {
        skipped++;
        return block;
      }
      replaced++;
      return block.replace(
        /"instructions": "[^"\\]*(?:\\.[^"\\]*)*"/,
        `"instructions": ${desired}`
      );
    }
    // No instructions present — inject after the `name` line.
    const injected = block.replace(
      /("name": "[^"]*",)/,
      `$1\n                "instructions": ${desired},`
    );
    if (injected !== block) added++;
    return injected;
  });
}

if (updated === source) {
  console.log("No changes — file is already up to date.");
  process.exit(0);
}

writeFileSync(target, updated, "utf-8");
console.log(
  `Done. Added: ${added}, replaced: ${replaced}, skipped (already current): ${skipped}.`
);
