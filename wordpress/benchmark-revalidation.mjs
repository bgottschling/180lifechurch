#!/usr/bin/env node
/**
 * Revalidation Latency Benchmark
 *
 * Measures the real end-to-end time from "content saved in WordPress"
 * to "content visible on the live site" so we can set accurate
 * expectations for editorial staff.
 *
 * Phases measured:
 *   Phase 1: WordPress save time (how long the REST API takes to persist a change)
 *   Phase 2: Revalidation trigger (time from POST /api/revalidate to "tag invalidated")
 *   Phase 3: CDN propagation + page render (time until new content is visible via HTTP)
 *   Total: Sum of phases 1-3 (what editors will actually experience)
 *
 * Usage:
 *   node wordpress/benchmark-revalidation.mjs --preview-url=<url> --bypass-token=<token>
 *
 *   Optional:
 *     --runs=5                 (default: 3) Number of timed runs
 *     --tag=wordpress          (default: wordpress) Cache tag to invalidate
 *     --settle=500             (default: 500) Poll interval in ms
 *     --max-wait=120           (default: 120) Max seconds to wait per run
 *
 * Safety:
 *   The script writes to a unique WP field each run (hero_tagline) and
 *   restores the original value after the last run. If interrupted,
 *   re-run the script or manually restore the tagline in wp-admin.
 *
 * Requires .env.local with WORDPRESS_URL, WORDPRESS_USERNAME,
 * WORDPRESS_AUTH_TOKEN, WORDPRESS_REVALIDATION_SECRET.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Env loading
// ---------------------------------------------------------------------------

function loadEnvLocal() {
  const envPath = resolve(__dirname, "..", ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf-8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

loadEnvLocal();

const WORDPRESS_URL = process.env.WORDPRESS_URL;
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME;
const WORDPRESS_AUTH_TOKEN = process.env.WORDPRESS_AUTH_TOKEN;
const REVAL_SECRET = process.env.WORDPRESS_REVALIDATION_SECRET;

if (!WORDPRESS_URL || !WORDPRESS_USERNAME || !WORDPRESS_AUTH_TOKEN || !REVAL_SECRET) {
  console.error(
    "Missing env vars. Required: WORDPRESS_URL, WORDPRESS_USERNAME, WORDPRESS_AUTH_TOKEN, WORDPRESS_REVALIDATION_SECRET"
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------

function getArg(name, defaultValue) {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg ? arg.split("=").slice(1).join("=") : defaultValue;
}

const PREVIEW_URL = getArg("preview-url");
const BYPASS_TOKEN = getArg("bypass-token");
const PREVIEW_PASSWORD = getArg("preview-password", "180lifepreview");
const RUNS = parseInt(getArg("runs", "3"), 10);
const TAG = getArg("tag", "wordpress");
const SETTLE_MS = parseInt(getArg("settle", "500"), 10);
const MAX_WAIT_S = parseInt(getArg("max-wait", "120"), 10);

if (!PREVIEW_URL) {
  console.error("Missing --preview-url=<url>");
  console.error(
    "Example: node wordpress/benchmark-revalidation.mjs --preview-url=https://preview.vercel.app --bypass-token=abc123 --preview-password=...",
  );
  process.exit(1);
}

// Cookie jar for app-level password authentication
let previewAuthCookie = null;

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

const wpAuth =
  "Basic " +
  Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_AUTH_TOKEN}`).toString("base64");

function previewHeaders() {
  const h = {};
  if (BYPASS_TOKEN) h["x-vercel-protection-bypass"] = BYPASS_TOKEN;
  if (previewAuthCookie) h["Cookie"] = previewAuthCookie;
  return h;
}

/**
 * Authenticate to the app's preview password gate (separate from
 * Vercel's deployment protection). Stores the resulting cookie so
 * homepage fetches don't get redirected to /login.
 */
async function loginToPreview() {
  const url = new URL(`${PREVIEW_URL}/api/auth`);
  if (BYPASS_TOKEN) {
    url.searchParams.set("x-vercel-protection-bypass", BYPASS_TOKEN);
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(BYPASS_TOKEN ? { "x-vercel-protection-bypass": BYPASS_TOKEN } : {}),
    },
    body: JSON.stringify({ password: PREVIEW_PASSWORD }),
    redirect: "manual",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Preview login failed: ${res.status} ${res.statusText}\n` +
        `If your preview password is not "180lifepreview", pass --preview-password=<your-password>.\n` +
        body
    );
  }
  // Parse the Set-Cookie header to extract preview_auth
  const setCookie = res.headers.getSetCookie?.() ||
    (res.headers.get("set-cookie") ? [res.headers.get("set-cookie")] : []);
  const authCookie = setCookie.find((c) => c.startsWith("preview_auth="));
  if (!authCookie) {
    throw new Error("Login succeeded but no preview_auth cookie was returned");
  }
  // Store just the name=value portion
  previewAuthCookie = authCookie.split(";")[0];
}

async function getSiteSettings() {
  const res = await fetch(
    `${WORDPRESS_URL}/wp-json/wp/v2/site-settings?per_page=1&_fields=id,acf`,
    { headers: { Authorization: wpAuth } }
  );
  if (!res.ok) throw new Error(`Could not fetch Site Settings: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No Site Settings entry found. Run the seed script first.");
  }
  return data[0];
}

async function updateSiteSettingsTagline(postId, newTagline) {
  const start = Date.now();
  const res = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/site-settings/${postId}`, {
    method: "POST",
    headers: {
      Authorization: wpAuth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      acf: { hero_tagline: newTagline },
    }),
  });
  const elapsed = Date.now() - start;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WP update failed: ${res.status} ${res.statusText}\n${text}`);
  }
  const body = await res.json();
  // Verify the write actually persisted by reading back the field
  const verifyRes = await fetch(
    `${WORDPRESS_URL}/wp-json/wp/v2/site-settings/${postId}?_fields=id,acf`,
    { headers: { Authorization: wpAuth } }
  );
  const verifyBody = await verifyRes.json();
  const persistedValue = verifyBody?.acf?.hero_tagline;
  return { elapsed, body, persistedValue };
}

async function triggerRevalidation(tag) {
  const start = Date.now();
  const url = new URL(`${PREVIEW_URL}/api/revalidate`);
  if (BYPASS_TOKEN) {
    url.searchParams.set("x-vercel-protection-bypass", BYPASS_TOKEN);
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-revalidation-secret": REVAL_SECRET,
      "Content-Type": "application/json",
      ...previewHeaders(),
    },
    body: JSON.stringify({ tag }),
  });
  const elapsed = Date.now() - start;
  const body = await res.json();
  if (!res.ok || !body.revalidated) {
    throw new Error(`Revalidation failed: ${res.status}\n${JSON.stringify(body)}`);
  }
  return { elapsed, body };
}

async function fetchPreviewHtml() {
  const url = new URL(PREVIEW_URL);
  url.searchParams.set("nocache", Date.now().toString());
  const res = await fetch(url, {
    headers: previewHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Preview fetch failed: ${res.status}`);
  return res.text();
}

async function waitForContent(searchString, maxWaitMs, pollMs) {
  const start = Date.now();
  let attempts = 0;
  while (Date.now() - start < maxWaitMs) {
    attempts++;
    const html = await fetchPreviewHtml();
    if (html.includes(searchString)) {
      return { elapsed: Date.now() - start, attempts, found: true };
    }
    await new Promise((r) => setTimeout(r, pollMs));
  }
  return { elapsed: Date.now() - start, attempts, found: false };
}

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------

function ms(n) {
  if (n < 1000) return `${n}ms`;
  return `${(n / 1000).toFixed(2)}s`;
}

function pad(s, n) {
  return String(s).padEnd(n);
}

function stats(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const p95 =
    sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  return { mean, median, p95, min, max };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Revalidation Latency Benchmark");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  WordPress:   ${WORDPRESS_URL}`);
  console.log(`  Preview:     ${PREVIEW_URL}`);
  console.log(`  Runs:        ${RUNS}`);
  console.log(`  Cache tag:   ${TAG}`);
  console.log(`  Poll every:  ${SETTLE_MS}ms (max ${MAX_WAIT_S}s per run)`);
  console.log("");

  // Pre-flight: log in to the preview app's password gate so homepage
  // fetches aren't redirected to /login
  console.log("Pre-flight: authenticating to preview password gate...");
  try {
    await loginToPreview();
    console.log(`  ✓ Logged in (cookie obtained)`);
  } catch (err) {
    console.error(`  ✗ ${err.message}`);
    console.error(
      "\nThe app's preview password is set via PREVIEW_PASSWORD_HASH env var on Vercel."
    );
    console.error(
      "If unset (PREVIEW_PASSWORD_ENABLED=false), you can skip this step by removing the auth check."
    );
    process.exit(1);
  }

  // Pre-flight: fetch the current Site Settings so we can restore afterward
  console.log("Pre-flight: reading current Site Settings...");
  const current = await getSiteSettings();
  const originalTagline = current.acf?.hero_tagline;
  const postId = current.id;
  console.log(`  Post ID: ${postId}`);
  console.log(`  Original tagline: "${originalTagline}"`);
  console.log("");

  const results = {
    wpSave: [],
    revalTrigger: [],
    cdnPropagation: [],
    totalEditorExperience: [],
    notFound: 0,
  };

  for (let i = 1; i <= RUNS; i++) {
    const testValue = `BENCHMARK-${Date.now()}-${i}`;
    console.log(`━━━ Run ${i} / ${RUNS} ━━━`);
    console.log(`  Setting tagline to: ${testValue}`);

    // Phase 1: Save to WordPress
    const wpStart = Date.now();
    const { elapsed: wpMs, persistedValue } = await updateSiteSettingsTagline(
      postId,
      testValue
    );
    console.log(`  ✓ WP save:           ${ms(wpMs)}`);
    if (persistedValue === testValue) {
      console.log(`  ✓ Verified persisted in WP: "${persistedValue}"`);
    } else {
      console.log(`  ⚠ WRITE NOT PERSISTED: tried to set "${testValue}", got back "${persistedValue}"`);
      console.log(`    This means ACF is silently rejecting the write. Check field group permissions.`);
    }
    results.wpSave.push(wpMs);

    // Phase 2: Trigger revalidation
    const { elapsed: revalMs } = await triggerRevalidation(TAG);
    console.log(`  ✓ Revalidation API:  ${ms(revalMs)}`);
    results.revalTrigger.push(revalMs);

    // Phase 3: Poll preview until content appears
    const propStart = Date.now();
    const { elapsed: propMs, attempts, found } = await waitForContent(
      testValue,
      MAX_WAIT_S * 1000,
      SETTLE_MS
    );
    if (found) {
      console.log(`  ✓ CDN propagation:   ${ms(propMs)} (${attempts} polls)`);
      results.cdnPropagation.push(propMs);

      const total = Date.now() - wpStart;
      console.log(`  ━ Total experience:  ${ms(total)}`);
      results.totalEditorExperience.push(total);
    } else {
      console.log(
        `  ✗ CDN propagation:   TIMEOUT after ${ms(propMs)} — content never appeared`
      );
      // Diagnostic: what's actually being served?
      console.log(`  ↳ Diagnostic snapshot of what IS being served:`);
      try {
        const html = await fetchPreviewHtml();
        // Look for the tagline that IS rendered (search for any "tagline"-shaped content)
        const taglineMatch = html.match(/"hero_tagline":\s*"([^"]*)"/);
        if (taglineMatch) {
          console.log(`     hero_tagline in HTML hydration data: "${taglineMatch[1]}"`);
        } else {
          // Look for the CTA buttons or other tagline-region text as anchor
          const anchor = html.match(/(No Perfect People Allowed|Plan Your Visit)/);
          console.log(
            `     Could not find hydration data. HTML length: ${html.length}, contains anchor "${anchor?.[0] || "NONE"}"`
          );
        }
      } catch (err) {
        console.log(`     Could not fetch preview HTML for diagnostic: ${err.message}`);
      }
      results.notFound++;
    }
    console.log("");

    // Small gap between runs to avoid hammering
    if (i < RUNS) await new Promise((r) => setTimeout(r, 2000));
  }

  // Restore original tagline
  console.log("Restoring original tagline...");
  if (originalTagline) {
    await updateSiteSettingsTagline(postId, originalTagline);
    await triggerRevalidation(TAG);
    console.log(`  ✓ Restored to: "${originalTagline}"`);
  } else {
    console.log("  (No original tagline to restore)");
  }
  console.log("");

  // Summary
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Summary");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  if (results.notFound > 0) {
    console.log(`  ⚠ ${results.notFound} run(s) timed out before content appeared`);
  }
  console.log("");
  console.log(
    `  ${pad("Phase", 28)} ${pad("min", 10)} ${pad("median", 10)} ${pad("p95", 10)} ${pad("max", 10)}`
  );
  console.log(
    "  " + "─".repeat(72)
  );
  for (const [label, values] of [
    ["1. WordPress save", results.wpSave],
    ["2. Revalidation API call", results.revalTrigger],
    ["3. CDN propagation", results.cdnPropagation],
    ["Total editor experience", results.totalEditorExperience],
  ]) {
    if (values.length === 0) continue;
    const s = stats(values);
    console.log(
      `  ${pad(label, 28)} ${pad(ms(s.min), 10)} ${pad(ms(s.median), 10)} ${pad(ms(s.p95), 10)} ${pad(ms(s.max), 10)}`
    );
  }
  console.log("");

  if (results.totalEditorExperience.length > 0) {
    const s = stats(results.totalEditorExperience);
    console.log("  Recommendation for editor-facing expectations:");
    console.log(
      `    Typical case: "Changes appear within ${Math.ceil(s.median / 1000)} seconds"`
    );
    console.log(
      `    Safe buffer:  "Allow up to ${Math.ceil(s.p95 / 1000)} seconds for changes to propagate"`
    );
    console.log(
      `    Red flag:     "If not visible after ${Math.ceil(s.max / 1000 + 30)} seconds, something is wrong"`
    );
  }
  console.log("");
}

main().catch((err) => {
  console.error("\n✗ Benchmark failed:", err.message);
  process.exit(1);
});
