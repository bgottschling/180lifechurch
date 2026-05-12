/**
 * One-shot script: convert paragraph-array fields to HTML strings.
 *
 * Used once to migrate src/lib/subpage-fallbacks.ts from
 *   description: ["Para 1", "Para 2"]
 * to
 *   description: "<p>Para 1</p>\n<p>Para 2</p>"
 *
 * After this script ran cleanly, keep it in the repo as a record
 * of how the migration happened — it's not part of the runtime
 * build path.
 *
 * Usage:
 *   node scripts/convert-rich-text-fallbacks.mjs
 *
 * The script is idempotent — running it twice does nothing extra.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = resolve(__dirname, "..", "src", "lib", "subpage-fallbacks.ts");

const source = readFileSync(target, "utf-8");

/**
 * Replace `<key>: [\n  "p1",\n  "p2",\n  ...\n]` with the same
 * `<key>: "<p>p1</p>\n<p>p2</p>..."`. Only matches when EVERY
 * element in the array is a string literal — bails out cleanly
 * if any element looks like an object (e.g. `body: [{ ... }]`).
 */
function convertArrayLiteralsToHtml(source, fieldNames) {
  let out = source;
  for (const field of fieldNames) {
    // Greedy until the matching `]` on its own line indented less or
    // equal to the field's indentation. Build the regex with the
    // field name interpolated.
    const re = new RegExp(
      // (indent + key + : + ws + [ + newline)(contents)(indent + ])
      `(^|\\n)(\\s*)${field}: \\[\\s*\\n([\\s\\S]*?)\\n\\2\\],`,
      "g"
    );
    out = out.replace(re, (match, lead, indent, body) => {
      // Each line in `body` looks like: <stringIndent>"..."(,?)
      // We extract just the string contents and wrap each in <p>.
      // If any non-string line shows up, leave the match untouched.
      const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
      const paragraphs = [];
      for (const line of lines) {
        // Match a JS string literal (single or double quoted) with
        // optional trailing comma. Allows escaped quotes inside.
        const m = line.match(/^("([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'),?$/);
        if (!m) {
          // Not a pure-string array — leave the original block alone.
          return match;
        }
        // Strip the surrounding quotes and unescape JS escapes.
        const raw = m[2] ?? m[3];
        // Un-escape \" / \\ / \n minimally for our use case
        const unescaped = raw
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\")
          .replace(/\\n/g, "\n");
        paragraphs.push(unescaped);
      }
      const html = paragraphs.map((p) => `<p>${p}</p>`).join("\\n");
      // Escape back into a JS double-quoted string. " → \" / \ → \\
      const reEscaped = html
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');
      return `${lead}${indent}${field}: "${reEscaped}",`;
    });
  }
  return out;
}

const updated = convertArrayLiteralsToHtml(source, [
  "description",
  "body",
]);

if (updated === source) {
  console.log("No changes — file is already migrated.");
  process.exit(0);
}

writeFileSync(target, updated, "utf-8");

// Quick stats
const before = (source.match(/description: \[|body: \[/g) || []).length;
const after = (updated.match(/description: \[|body: \[/g) || []).length;
console.log(`Converted: ${before - after} array literal(s) → HTML string.`);
console.log(`Remaining array literals (likely non-string contents): ${after}`);
