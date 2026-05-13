/**
 * One-shot script: strip the literal `\n` artifact that the earlier
 * convert-rich-text-fallbacks.mjs migration left between paragraphs.
 *
 * Background: the original migration converted `description: [...]`
 * arrays into a single HTML string by joining paragraphs with the
 * literal two-character sequence `\n` (backslash + n) instead of an
 * actual newline escape. Browsers render that as visible text
 * between block-level elements, producing tiles like:
 *
 *     <p>First para.</p>\n<p>Second para.</p>
 *
 * Which shows up on the live page as a stray "\n" between
 * paragraphs (most visibly on /new-to-faith, but present anywhere
 * the script touched).
 *
 * Fix: walk the source file and replace `\n<p>` (which represents
 * a literal `\n` followed by a `<p>` tag in the runtime string)
 * with just `<p>`. Browsers collapse the lack of whitespace between
 * </p> and <p> the same way they'd collapse a newline, so output
 * is visually identical to a clean migration.
 *
 * Idempotent. Run once after pulling, future migrations should use
 * actual `\n` escapes or empty joins instead.
 *
 * Usage:
 *   node scripts/fix-rich-text-newlines.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = resolve(
  __dirname,
  "..",
  "src",
  "lib",
  "subpage-fallbacks.ts"
);

const source = readFileSync(target, "utf-8");

// In the source file, the original migration left `\\n<p>` between
// paragraphs (a doubled backslash + n + <p>). A first cleanup pass
// stripped `\n<p>` (5 bytes) but left the first backslash behind,
// so files ended up with `\<p>` (a stray backslash). JS silently
// drops `\<` as an unknown escape so the runtime is clean, but the
// source is ugly and could warn under strict-mode TS configs.
//
// This pass handles both shapes:
//   1. `\\n<p>` (6 bytes) — original artifact, never been cleaned
//   2. `\<p>` (4 bytes)   — leftover after the first cleanup pass
//
// Order matters: strip the longer form first so the shorter pattern
// doesn't match into the middle of an already-correct paragraph.
let fixed = source.replace(/\\\\n<p>/g, "<p>"); // shape 1
fixed = fixed.replace(/\\<p>/g, "<p>"); // shape 2

if (fixed === source) {
  console.log("No artifacts found — file is already clean.");
  process.exit(0);
}

writeFileSync(target, fixed, "utf-8");

const longForm = (source.match(/\\\\n<p>/g) || []).length;
const shortForm = (source.match(/\\<p>/g) || []).length;
console.log(
  `Stripped ${longForm} long-form (\\\\n<p>) + ${shortForm} short-form (\\<p>) artifact(s) from rich-text fallbacks.`
);
