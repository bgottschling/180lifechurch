/**
 * One-shot script: replace em-dashes (U+2014) with regular hyphens
 * across editorial content files. Em-dashes read as one of the
 * stronger "this was written by an AI" tells in 2025-era prose, so
 * the church wants them out of the live site copy.
 *
 * Replacement rules (handled in order):
 *
 *   ` — ` (space + em-dash + space)    →  ` - ` (space + hyphen + space)
 *   `—` (no surrounding spaces)        →  `-`  (plain hyphen)
 *
 * Both substitutions preserve sentence rhythm; the spaced variant
 * keeps the parenthetical pause an em-dash usually marks.
 *
 * Targets editorial content sources and user-facing React pages.
 * Comments in those files will also get touched, which is fine —
 * code-comment hyphens read identically to em-dashes for any human
 * reading the source.
 *
 * Idempotent: re-running on already-scrubbed files is a no-op.
 *
 * Usage:
 *   node scripts/scrub-em-dashes.mjs                 # dry run
 *   node scripts/scrub-em-dashes.mjs --write         # apply changes
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const DRY_RUN = !process.argv.includes("--write");

// Files to scrub. Editorial content (fallbacks + seed) is mandatory;
// the React component files are included because they carry hand-
// authored UI strings (CTAs, callouts, etc.) that the user reads.
const TARGETS = [
  "src/lib/subpage-fallbacks.ts",
  "src/lib/wordpress-fallbacks.ts",
  "wordpress/seed-content.mjs",
  "src/app/about/page.tsx",
  "src/app/connect/page.tsx",
  "src/app/give/page.tsx",
  "src/app/immeasurably-more/page.tsx",
  "src/app/leadership/page.tsx",
  "src/app/ministries/page.tsx",
  "src/app/new/page.tsx",
  "src/app/sermons/page.tsx",
  "src/app/ministries/kids/KidsMinistryContent.tsx",
  "src/app/ministries/mens/MensMinistryContent.tsx",
  "src/app/ministries/students/StudentsMinistryContent.tsx",
  "src/app/ministries/womens/WomensMinistryContent.tsx",
  "wordpress/plugin/180life-sync/readme.txt",
];

let totalReplaced = 0;
const fileResults = [];

for (const rel of TARGETS) {
  const path = resolve(repoRoot, rel);
  let source;
  try {
    source = readFileSync(path, "utf-8");
  } catch {
    fileResults.push({ rel, error: "not found" });
    continue;
  }

  // Order matters: handle spaced variant first so a standalone
  // em-dash next to other punctuation doesn't get swallowed by
  // the spaced match.
  const spaced = (source.match(/ — /g) || []).length;
  const bare = (source.match(/—/g) || []).length - spaced;

  let updated = source.replace(/ — /g, " - ");
  updated = updated.replace(/—/g, "-");

  if (updated === source) {
    fileResults.push({ rel, spaced: 0, bare: 0, skipped: true });
    continue;
  }

  fileResults.push({ rel, spaced, bare });
  totalReplaced += spaced + bare;

  if (!DRY_RUN) {
    writeFileSync(path, updated, "utf-8");
  }
}

console.log(`\nEm-dash scrub (${DRY_RUN ? "DRY RUN" : "WRITE MODE"}):\n`);
for (const r of fileResults) {
  if (r.error) {
    console.log(`  [error] ${r.rel} — ${r.error}`);
  } else if (r.skipped) {
    console.log(`  [skip ] ${r.rel} — already clean`);
  } else {
    console.log(
      `  ${DRY_RUN ? "[dry  ]" : "[done ]"} ${r.rel} — ${r.spaced} spaced + ${r.bare} bare`
    );
  }
}
console.log(`\nTotal: ${totalReplaced} em-dashes ${DRY_RUN ? "would be" : "were"} replaced.`);
if (DRY_RUN) {
  console.log("Re-run with --write to apply.");
}
