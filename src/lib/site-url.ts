/**
 * Resolved site origin used for canonical URLs, OG metadata,
 * sitemap entries, robots.txt host directive, and JSON-LD schema.
 *
 * Reads from `NEXT_PUBLIC_SITE_URL` so non-production deployments
 * (e.g. staging on a developer's personal domain, or a different
 * Vercel preview alias) can override the canonical host without
 * a code change. Falls back to the church's production URL.
 *
 * Always returned without a trailing slash so concatenation
 * (`${SITE_URL}/about`) yields well-formed URLs regardless of
 * the env var's exact spelling.
 */
const PRODUCTION_URL = "https://180lifechurch.org";

function resolve(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL;
  return raw.replace(/\/+$/, "");
}

export const SITE_URL = resolve();
