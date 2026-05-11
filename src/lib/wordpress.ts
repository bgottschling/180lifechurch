// WordPress headless CMS data fetching layer.
// All fetch functions use ISR with tag-based revalidation.
// When WORDPRESS_URL is not set, functions throw so callers fall back to defaults.
//
// Authentication uses WordPress Application Passwords (Basic Auth).
// The token is stored in WORDPRESS_AUTH_TOKEN and sent with every request
// so we can access draft/private content and ACF options pages.

import type {
  WPEvent,
  WPMinistry,
  WPService,
  WPSiteSettings,
  WPHeroData,
  WPAboutData,
  WPContactData,
  WPSocialData,
  WPCTAData,
  WPSeoData,
  WPPostSeo,
  WPPublicConfig,
} from "./wordpress-types";

const WORDPRESS_URL = process.env.WORDPRESS_URL;
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME;
const WORDPRESS_AUTH_TOKEN = process.env.WORDPRESS_AUTH_TOKEN;

// WordPress Application Passwords require Basic Auth with username:app_password
function getAuthHeaders(): HeadersInit {
  if (!WORDPRESS_AUTH_TOKEN || !WORDPRESS_USERNAME) return {};

  const credentials = Buffer.from(
    `${WORDPRESS_USERNAME}:${WORDPRESS_AUTH_TOKEN}`
  ).toString("base64");

  return { Authorization: `Basic ${credentials}` };
}

function buildFetchOptions(tags: string[] = ["wordpress"]): RequestInit {
  return {
    headers: getAuthHeaders(),
    next: { revalidate: 3600, tags },
  };
}

// ---------------------------------------------------------------------------
// Base helpers
// ---------------------------------------------------------------------------

async function wpFetch<T>(
  endpoint: string,
  tags?: string[]
): Promise<T> {
  if (!WORDPRESS_URL) {
    throw new Error("WORDPRESS_URL not configured");
  }

  const url = `${WORDPRESS_URL}/wp-json/wp/v2/${endpoint}`;
  const res = await fetch(url, buildFetchOptions(tags));

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status} ${res.statusText} for ${endpoint}`);
  }

  return res.json();
}

/**
 * Legacy ACF v3 endpoint helper.
 * Requires the (now obsolete) "ACF to REST API" plugin to be installed.
 * ACF Pro 5.11+ exposes fields natively via the standard REST API, so
 * this is only used as a fallback path for ACF Options Pages, which
 * still aren't exposed via the core REST API.
 *
 * Our preferred approach is a singleton `site-settings` custom post type
 * where the first (and only) post holds all site-wide settings as ACF fields.
 */
async function wpFetchACF<T>(
  endpoint: string,
  tags?: string[]
): Promise<T> {
  if (!WORDPRESS_URL) {
    throw new Error("WORDPRESS_URL not configured");
  }

  const url = `${WORDPRESS_URL}/wp-json/acf/v3/${endpoint}`;
  const res = await fetch(url, buildFetchOptions(tags));

  if (!res.ok) {
    throw new Error(`WordPress ACF API error: ${res.status} ${res.statusText} for ${endpoint}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Health check -- returns a per-check diagnostic report with actionable
// status and messages for each layer of the WordPress integration.
// ---------------------------------------------------------------------------

export type CheckStatus = "pass" | "warn" | "fail";

export interface HealthCheck {
  name: string;
  status: CheckStatus;
  message: string;
  detail?: string;
}

export interface HealthReport {
  overall: "healthy" | "degraded" | "broken";
  summary: string;
  checks: HealthCheck[];
  // Kept for backward compatibility with any existing consumers:
  connected: boolean;
  authenticated: boolean;
  acfAvailable: boolean;
}

/**
 * List of custom post types we expect to exist in WordPress.
 * rest_base is what appears in /wp-json/wp/v2/{rest_base}.
 */
const EXPECTED_CPTS: { label: string; restBase: string; expected: number }[] = [
  { label: "Site Settings", restBase: "site-settings", expected: 1 },
  { label: "Ministry", restBase: "ministry", expected: 6 },
  { label: "Staff", restBase: "staff", expected: 9 },
  { label: "Elder", restBase: "elder", expected: 4 },
  // Content Pages: about, partnership, baptism, stories — at minimum.
  // Editors can add more; setting `expected` to 4 matches the four
  // pages currently consumed by the site, and getting fewer drops
  // the affected pages to fallback content.
  { label: "Content Page", restBase: "content-page", expected: 4 },
  // Sermon Series CPT was removed in plugin v1.1.0 — sermons now come from
  // Planning Center Publishing API. PC reachability is checked separately
  // by checkPlanningCenterHealth() in src/lib/planning-center.ts.
];

async function probeUnauth(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    return { ok: res.ok, status: res.status, data: res.ok ? await res.json() : null };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function probeAuth(url: string) {
  try {
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      next: { revalidate: 0 },
    });
    return { ok: res.ok, status: res.status, data: res.ok ? await res.json() : null };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Status rationale used across both this checker and
 * checkPlanningCenterHealth():
 *
 *   - `fail` → contributes to overall = "broken". Reserved for
 *     foundational failures that take the entire integration down:
 *     missing env vars, API root unreachable, auth completely failing.
 *     Editors need to fix these urgently.
 *
 *   - `warn` → contributes to overall = "degraded". The site keeps
 *     rendering on fallback data. Used for localized issues — a
 *     specific CPT missing, a single endpoint 404ing, fewer entries
 *     than expected, ACF probe inconclusive. Worth fixing but
 *     visitors won't see a broken site.
 *
 *   - `pass` → contributes to overall = "healthy".
 *
 * The plugin's email alert only fires on transition into `broken`,
 * so this classification matters: a missing CPT shouldn't wake
 * anyone up at 3 AM.
 */
export async function checkWordPressHealth(): Promise<HealthReport> {
  const checks: HealthCheck[] = [];

  // -----------------------------------------------------------------------
  // 0. Env var check
  // -----------------------------------------------------------------------
  if (!WORDPRESS_URL) {
    checks.push({
      name: "Environment configuration",
      status: "fail",
      message: "WORDPRESS_URL environment variable is not set",
      detail:
        "Set WORDPRESS_URL in Vercel (Settings > Environment Variables) to the WordPress site root (e.g., https://180lifechurch.org). Redeploy after adding.",
    });
    return {
      overall: "broken",
      summary: "Cannot connect — WORDPRESS_URL not configured.",
      checks,
      connected: false,
      authenticated: false,
      acfAvailable: false,
    };
  }
  checks.push({
    name: "Environment configuration",
    status: "pass",
    message: "All required environment variables are set",
    detail: `WORDPRESS_URL = ${WORDPRESS_URL}`,
  });

  // -----------------------------------------------------------------------
  // 1. REST API connection (unauthenticated)
  // -----------------------------------------------------------------------
  const base = await probeUnauth(`${WORDPRESS_URL}/wp-json/`);
  let connected = false;
  if (base.ok && base.data?.namespaces) {
    connected = true;
    checks.push({
      name: "REST API connection",
      status: "pass",
      message: "WordPress REST API is reachable",
      detail: `Namespaces available: ${(base.data.namespaces as string[])
        .slice(0, 4)
        .join(", ")}${base.data.namespaces.length > 4 ? "…" : ""}`,
    });
  } else {
    checks.push({
      name: "REST API connection",
      status: "fail",
      message: `WordPress REST API not reachable (HTTP ${base.status || "connection error"})`,
      detail:
        base.error ||
        "Verify the WORDPRESS_URL is correct and the site is publicly accessible.",
    });
  }

  // -----------------------------------------------------------------------
  // 2. Authentication (Application Password)
  // -----------------------------------------------------------------------
  const me = await probeAuth(`${WORDPRESS_URL}/wp-json/wp/v2/users/me`);
  let authenticated = false;
  if (me.ok && me.data?.id) {
    authenticated = true;
    checks.push({
      name: "Application Password authentication",
      status: "pass",
      message: `Authenticated successfully`,
      detail: `Logged in as ${me.data.name || me.data.slug || `user id ${me.data.id}`}`,
    });
  } else {
    checks.push({
      name: "Application Password authentication",
      status: "fail",
      message: `Authentication failed (HTTP ${me.status || "connection error"})`,
      detail:
        me.status === 401
          ? "Application Password is invalid or the username does not match. Regenerate the Application Password in wp-admin > Users > Profile and update WORDPRESS_AUTH_TOKEN in Vercel."
          : me.error || "Check WORDPRESS_USERNAME and WORDPRESS_AUTH_TOKEN in Vercel env vars.",
    });
  }

  // -----------------------------------------------------------------------
  // 3. ACF Pro detection
  // -----------------------------------------------------------------------
  const acfProbe = await probeAuth(
    `${WORDPRESS_URL}/wp-json/wp/v2/pages?per_page=1&_fields=id,acf`
  );
  let acfAvailable = false;
  if (
    acfProbe.ok &&
    Array.isArray(acfProbe.data) &&
    acfProbe.data.length > 0 &&
    "acf" in acfProbe.data[0]
  ) {
    acfAvailable = true;
    checks.push({
      name: "ACF Pro detection",
      status: "pass",
      message: "ACF Pro is active and exposing fields via REST API",
      detail:
        "ACF Pro 5.11+ automatically includes an `acf` key on every post response.",
    });
  } else if (acfProbe.ok) {
    checks.push({
      name: "ACF Pro detection",
      status: "warn",
      message: "ACF Pro may not be active",
      detail:
        "Pages endpoint responded successfully but no `acf` key was found in the response. Verify ACF Pro is installed and activated in wp-admin > Plugins.",
    });
  } else {
    // Inconclusive (auth + API both work, just this probe failed) —
    // warn rather than fail so a transient hiccup doesn't trip
    // overall=broken when other checks are fine.
    checks.push({
      name: "ACF Pro detection",
      status: "warn",
      message: "Could not probe ACF availability",
      detail: `Pages endpoint returned HTTP ${acfProbe.status || "connection error"}. Site will fall back to hardcoded data for ACF-driven content.`,
    });
  }

  // -----------------------------------------------------------------------
  // 4. Custom post types (for each expected CPT)
  //
  // These are classified `warn`, not `fail`, because the data layer
  // has hardcoded fallbacks for every CPT (see wordpress-fallbacks.ts).
  // A missing or broken CPT degrades freshness but doesn't take down
  // the public site — visitors still see the previous build's content.
  // -----------------------------------------------------------------------
  for (const cpt of EXPECTED_CPTS) {
    const probe = await probeAuth(
      `${WORDPRESS_URL}/wp-json/wp/v2/${cpt.restBase}?per_page=100&_fields=id,title`
    );
    if (probe.status === 404) {
      checks.push({
        name: `Post type: ${cpt.label}`,
        status: "warn",
        message: "Custom post type not registered",
        detail: `Endpoint /wp-json/wp/v2/${cpt.restBase} returned 404. Import wordpress/acf-post-types.json via ACF > Tools in wp-admin to register this post type. Site will fall back to hardcoded ${cpt.label.toLowerCase()} data until then.`,
      });
      continue;
    }
    if (!probe.ok) {
      checks.push({
        name: `Post type: ${cpt.label}`,
        status: "warn",
        message: `Unexpected error (HTTP ${probe.status})`,
        detail: `Endpoint /wp-json/wp/v2/${cpt.restBase} returned ${probe.status}. Site will fall back to hardcoded ${cpt.label.toLowerCase()} data.`,
      });
      continue;
    }
    const count = Array.isArray(probe.data) ? probe.data.length : 0;
    if (count === 0) {
      checks.push({
        name: `Post type: ${cpt.label}`,
        status: "warn",
        message: "Post type registered but has no entries",
        detail: `Run the seed script (node wordpress/seed-content.mjs --write) or add entries manually in wp-admin.`,
      });
    } else if (count < cpt.expected) {
      checks.push({
        name: `Post type: ${cpt.label}`,
        status: "warn",
        message: `${count} entries found (expected at least ${cpt.expected})`,
        detail: "Site will fall back to hardcoded data for missing entries.",
      });
    } else {
      checks.push({
        name: `Post type: ${cpt.label}`,
        status: "pass",
        message: `${count} entries published`,
      });
    }
  }

  // -----------------------------------------------------------------------
  // Overall status
  // -----------------------------------------------------------------------
  const hasFail = checks.some((c) => c.status === "fail");
  const hasWarn = checks.some((c) => c.status === "warn");
  const overall: "healthy" | "degraded" | "broken" = hasFail
    ? "broken"
    : hasWarn
      ? "degraded"
      : "healthy";

  const summary =
    overall === "healthy"
      ? "All checks passing — WordPress integration is fully operational."
      : overall === "degraded"
        ? "WordPress is connected but some content is missing or stale. Site continues to render using hardcoded fallbacks for affected sections."
        : "Critical WordPress integration failure (REST API unreachable, auth broken, or env not configured). Editors cannot publish updates until resolved.";

  return {
    overall,
    summary,
    checks,
    connected,
    authenticated,
    acfAvailable,
  };
}

// ---------------------------------------------------------------------------
// Raw WordPress REST API response types
// ---------------------------------------------------------------------------

interface WPPostRaw {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  acf: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
//
// Events are now sourced from Planning Center directly via the
// getEventsFromPC() helper in src/lib/planning-center.ts. The legacy
// `event` CPT reader was removed in Phase 3a (May 2026) when Planning
// Center became the single source of truth for events.

// ---------------------------------------------------------------------------
// Ministries
// ---------------------------------------------------------------------------

export async function getMinistries(): Promise<WPMinistry[]> {
  const posts = await wpFetch<WPPostRaw[]>(
    "ministry?per_page=20&_fields=id,title,acf",
    ["wordpress", "ministries"]
  );

  // Resolve image IDs across all ministry rows in a single REST call
  const aggregateAcf: Record<string, unknown> = {};
  posts.forEach((post, idx) => {
    aggregateAcf[`row_${idx}`] = post.acf;
  });
  const mediaMap = await resolveImageFields(
    aggregateAcf,
    posts.map((_, idx) => `row_${idx}.ministry_image`)
  );

  return posts
    .map((post) => {
      const slug = (post.acf.ministry_slug as string) || "";
      // Fallback image: look up by slug in hardcoded data so editors don't
      // have to upload photos day-one to avoid broken images.
      const fallbackImage =
        FALLBACK_MINISTRIES.find((m) => m.slug === slug)?.image || "";
      return {
        id: post.id,
        title: decodeHtmlEntities(post.title.rendered),
        description: (post.acf.ministry_description as string) || "",
        image: extractImageUrl(post.acf.ministry_image, mediaMap) || fallbackImage,
        tag: (post.acf.ministry_tag as string) || "",
        iconName: (post.acf.ministry_icon as string) || "Users",
        sortOrder: Number(post.acf.ministry_sort_order) || 0,
        // Surface the slug too — needed by /ministries to join this CPT
        // against the URL slugs and reuse the homepage image on the
        // featured-card hero.
        slug,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export async function getServices(): Promise<WPService[]> {
  const posts = await wpFetch<WPPostRaw[]>(
    "service?per_page=10&_fields=id,title,acf",
    ["wordpress", "settings"]
  );

  return posts
    .map((post) => ({
      id: post.id,
      label: decodeHtmlEntities(post.title.rendered),
      day: (post.acf.service_day as string) || "Sunday",
      time: (post.acf.service_time as string) || "",
      description: (post.acf.service_description as string) || "",
      sortOrder: Number(post.acf.service_sort_order) || 0,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// ---------------------------------------------------------------------------
// Public Config (180 Life Sync plugin REST namespace)
// ---------------------------------------------------------------------------
//
// Lives outside wp/v2/ — uses the plugin's own namespace at
// /wp-json/180life-sync/v1/public-config. Returns the editor-controlled
// values the headless site needs to inject into <head> (GA4 ID,
// Search Console verification).
//
// Cached with the "settings" + "wordpress" tags so it busts when an
// editor saves the Analytics tab in wp-admin (the plugin webhook fires
// "wordpress" on every save).

export async function getPublicConfig(): Promise<WPPublicConfig> {
  if (!WORDPRESS_URL) {
    throw new Error("WORDPRESS_URL not configured");
  }
  const url = `${WORDPRESS_URL}/wp-json/180life-sync/v1/public-config`;
  // Public endpoint — no auth headers. We still tag the request for
  // ISR invalidation alongside the other site-wide settings.
  const res = await fetch(url, {
    next: { revalidate: 3600, tags: ["wordpress", "settings"] },
  });
  if (!res.ok) {
    throw new Error(
      `180 Life Sync REST error: ${res.status} ${res.statusText} for /public-config`
    );
  }
  return (await res.json()) as WPPublicConfig;
}

// ---------------------------------------------------------------------------
// Site Settings (ACF Pro Options Page or singleton post)
// ---------------------------------------------------------------------------

export async function getSiteSettings(): Promise<WPSiteSettings> {
  // Try ACF Pro Options Page first, fall back to singleton post
  let acf: Record<string, unknown>;

  try {
    const options = await wpFetchACF<{ acf: Record<string, unknown> }>(
      "options/site-settings",
      ["wordpress", "settings"]
    );
    acf = options.acf;
  } catch {
    // Fallback: ACF Free singleton post type
    const posts = await wpFetch<WPPostRaw[]>(
      "site-settings?per_page=1&_fields=id,acf",
      ["wordpress", "settings"]
    );
    if (!posts.length) throw new Error("No site settings found");
    acf = posts[0].acf;
  }

  // Resolve image-as-ID fields in a single batch REST call. ACF Pro's
  // REST API often returns image fields as integer attachment IDs even
  // when the field group is configured with `return_format: array`,
  // so we look them up explicitly.
  const mediaMap = await resolveImageFields(acf, [
    "hero_image",
    "about_image",
    "seo_default_og_image",
  ]);

  return {
    hero: parseHeroData(acf, mediaMap),
    about: parseAboutData(acf, mediaMap),
    contact: parseContactData(acf),
    social: parseSocialData(acf),
    cta: parseCTAData(acf),
    seo: parseSeoData(acf, mediaMap),
    missionStatement:
      (acf.mission_statement as string) ||
      "We exist to make and send disciples who love and live like Jesus.",
    churchTagline:
      (acf.church_tagline as string) || "Jesus Changes Everything",
  };
}

// ---------------------------------------------------------------------------
// Parsers — transform raw ACF fields into typed data
// ---------------------------------------------------------------------------

function parseHeroData(acf: Record<string, unknown>, mediaMap?: MediaMap): WPHeroData {
  // Rotating words: ACF Pro repeater → array of { word: string }
  // ACF Free fallback → newline-separated textarea
  let rotatingWords: string[] = [];
  const rawWords = acf.hero_rotating_words;
  if (Array.isArray(rawWords)) {
    rotatingWords = rawWords.map(
      (row: { word?: string }) => row.word || ""
    ).filter(Boolean);
  } else if (typeof rawWords === "string") {
    rotatingWords = rawWords.split("\n").map((w: string) => w.trim()).filter(Boolean);
  }

  return {
    tagline: (acf.hero_tagline as string) || "No Perfect People Allowed",
    headingPrefix: (acf.hero_heading_prefix as string) || "Jesus Changes",
    rotatingWords:
      rotatingWords.length > 0
        ? rotatingWords
        : ["Everything", "You", "Your Family"],
    description: (acf.hero_description as string) || "",
    image: extractImageUrl(acf.hero_image, mediaMap) || "/images/hero-worship.jpg",
    ctaPrimary: {
      text: (acf.hero_cta_primary_text as string) || "Plan Your Visit",
      link: (acf.hero_cta_primary_link as string) || "#visit",
    },
    ctaSecondary: {
      text: (acf.hero_cta_secondary_text as string) || "Watch Online",
      link: (acf.hero_cta_secondary_link as string) || "#watch",
    },
  };
}

function parseAboutData(acf: Record<string, unknown>, mediaMap?: MediaMap): WPAboutData {
  const bodyRaw = (acf.about_body as string) || "";
  // Split WYSIWYG content into paragraphs
  const body = bodyRaw
    ? bodyRaw
        .split(/<\/?p>/)
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

  return {
    label: (acf.about_label as string) || "Gather, Grow & Go",
    heading: (acf.about_heading as string) || "A Place Where",
    headingAccent: (acf.about_heading_accent as string) || "You Belong",
    body,
    image: extractImageUrl(acf.about_image, mediaMap) || "/images/community.jpg",
    linkText: (acf.about_link_text as string) || "Learn More About Us",
    linkUrl: (acf.about_link_url as string) || "/about",
  };
}

function parseContactData(acf: Record<string, unknown>): WPContactData {
  return {
    addressLine1: (acf.contact_address_line1 as string) || "180 Still Road",
    addressLine2:
      (acf.contact_address_line2 as string) || "Bloomfield, CT 06002",
    phone: (acf.contact_phone as string) || "(860) 243-3576",
    email: (acf.contact_email as string) || "info@180lifechurch.org",
    serviceTimesSummary:
      (acf.contact_service_times_summary as string) ||
      "Sundays at 9:00 & 11:00 AM",
    doorsOpenText:
      (acf.doors_open_text as string) || "Doors open at 8:40 AM",
  };
}

function parseSocialData(acf: Record<string, unknown>): WPSocialData {
  return {
    facebook:
      (acf.social_facebook as string) ||
      "https://www.facebook.com/180LifeChurch",
    instagram:
      (acf.social_instagram as string) ||
      "https://www.instagram.com/180lifechurch/",
    youtube:
      (acf.social_youtube as string) ||
      "https://www.youtube.com/@180lifechurch",
    vimeo:
      (acf.social_vimeo as string) ||
      "https://vimeo.com/180lifechurch",
  };
}

function parseCTAData(acf: Record<string, unknown>): WPCTAData {
  return {
    label: (acf.cta_label as string) || "Take Your Next Step",
    heading: (acf.cta_heading as string) || "Your Story",
    headingAccent: (acf.cta_heading_accent as string) || "Starts Here",
    body:
      (acf.cta_body as string) ||
      "It doesn't matter where you've been or what your story looks like. There's a seat saved for you. Come as you are.",
    primaryText: (acf.cta_primary_text as string) || "I'm New Here",
    primaryLink: (acf.cta_primary_link as string) || "/new",
    secondaryText: (acf.cta_secondary_text as string) || "Contact Us",
    secondaryLink: (acf.cta_secondary_link as string) || "/contact",
  };
}

/**
 * Parse the optional per-post SEO override fields from any of our
 * custom post types' ACF payload. Each field is optional; consumers
 * merge these over their route-level defaults, which themselves merge
 * over the site-wide SEO defaults from Site Settings.
 *
 * The post-level SEO fields are uniformly named across all our CPTs
 * (`seo_title`, `seo_description`, `seo_og_image`, `seo_robots_noindex`)
 * so this helper works for sermon_series, ministry, staff, and elder.
 */
function parsePostSeo(
  acf: Record<string, unknown>,
  mediaMap?: MediaMap
): WPPostSeo {
  return {
    title: (acf.seo_title as string) || "",
    description: (acf.seo_description as string) || "",
    ogImage: extractImageUrl(acf.seo_og_image, mediaMap) || "",
    noindex: Boolean(acf.seo_robots_noindex),
  };
}

function parseSeoData(acf: Record<string, unknown>, mediaMap?: MediaMap): WPSeoData {
  return {
    titleTemplate:
      (acf.seo_title_template as string) || "%s | 180 Life Church",
    defaultTitle:
      (acf.seo_default_title as string) || "180 Life Church | Bloomfield, CT",
    defaultDescription:
      (acf.seo_default_description as string) ||
      "A warm, welcoming community in Bloomfield, Connecticut. Join us for worship, connection, and life-changing experiences. Everyone is welcome.",
    defaultOgImage: extractImageUrl(acf.seo_default_og_image, mediaMap) || "",
    twitterHandle: (acf.seo_twitter_handle as string) || "",
    keywords:
      (acf.seo_keywords as string) ||
      "church, Bloomfield, CT, Connecticut, worship, community, non-denominational",
  };
}

// ---------------------------------------------------------------------------
// Leadership
// ---------------------------------------------------------------------------

import type {
  LeadershipData,
  StaffMember,
  MinistryPageData,
  ContentPageData,
  SermonSeriesData,
} from "./subpage-types";

import { SERMON_SERIES as SERMON_SERIES_FALLBACK } from "./subpage-fallbacks";
import { LEADERSHIP_DATA, ELDERS as ELDERS_FALLBACK } from "./subpage-fallbacks";
import { FALLBACK_MINISTRIES } from "./wordpress-fallbacks";

export async function getLeadership(): Promise<LeadershipData> {
  const posts = await wpFetch<WPPostRaw[]>(
    "staff?per_page=50&_fields=id,title,acf",
    ["wordpress", "leadership"]
  );

  // Build a lookup of hardcoded staff images keyed by name for fallback
  const allFallbackStaff = [...LEADERSHIP_DATA.pastors, ...LEADERSHIP_DATA.staff];
  const staffImageByName: Record<string, string> = {};
  for (const s of allFallbackStaff) {
    if (s.image) staffImageByName[s.name] = s.image;
  }

  // Resolve photo IDs across all rows in one batch
  const aggregateAcf: Record<string, unknown> = {};
  posts.forEach((post, idx) => {
    aggregateAcf[`row_${idx}`] = post.acf;
  });
  const mediaMap = await resolveImageFields(
    aggregateAcf,
    posts.map((_, idx) => `row_${idx}.staff_photo`)
  );

  const staff: StaffMember[] = posts.map((post) => {
    const name = decodeHtmlEntities(post.title.rendered);
    const fallbackImage = staffImageByName[name];
    return {
      name,
      role: (post.acf.staff_role as string) || "",
      image:
        extractImageUrl(post.acf.staff_photo, mediaMap) ||
        fallbackImage ||
        "/images/staff/placeholder-male.jpg",
      bio: (post.acf.staff_bio as string) || undefined,
    };
  });

  // Split into pastors (role contains "Pastor") and staff
  const pastors = staff.filter((s) =>
    s.role.toLowerCase().includes("pastor")
  );
  const team = staff.filter(
    (s) => !s.role.toLowerCase().includes("pastor")
  );

  return { pastors, staff: team };
}

export async function getElders(): Promise<
  { name: string; role: string; image?: string }[]
> {
  const posts = await wpFetch<WPPostRaw[]>(
    "elder?per_page=20&_fields=id,title,acf",
    ["wordpress", "leadership"]
  );

  // Build name-keyed lookup for elder photo fallback
  const elderImageByName: Record<string, string> = {};
  for (const e of ELDERS_FALLBACK) {
    if (e.image) elderImageByName[e.name] = e.image;
  }

  // Resolve elder photo IDs in one batch
  const aggregateAcf: Record<string, unknown> = {};
  posts.forEach((post, idx) => {
    aggregateAcf[`row_${idx}`] = post.acf;
  });
  const mediaMap = await resolveImageFields(
    aggregateAcf,
    posts.map((_, idx) => `row_${idx}.elder_photo`)
  );

  return posts.map((post) => {
    const name = decodeHtmlEntities(post.title.rendered);
    return {
      name,
      role: (post.acf.elder_role as string) || "Elder",
      image:
        extractImageUrl(post.acf.elder_photo, mediaMap) ||
        elderImageByName[name] ||
        undefined,
    };
  });
}

// ---------------------------------------------------------------------------
// Ministry Pages (individual subpage content)
// ---------------------------------------------------------------------------

export async function getMinistryPage(
  slug: string
): Promise<MinistryPageData> {
  const posts = await wpFetch<WPPostRaw[]>(
    `ministry-page?slug=${slug}&per_page=1&_fields=id,title,acf`,
    ["wordpress", "ministries"]
  );

  if (!posts.length) throw new Error(`Ministry page not found: ${slug}`);
  const post = posts[0];
  const acf = post.acf;

  // Parse description: ACF WYSIWYG or repeater
  const descRaw = acf.ministry_description as string | string[];
  const description = Array.isArray(descRaw)
    ? descRaw
    : (descRaw || "")
        .split(/<\/?p>/)
        .map((s: string) => s.trim())
        .filter(Boolean);

  // Parse schedule: ACF repeater
  const schedRaw = acf.ministry_schedule as
    | { day: string; time: string; location?: string }[]
    | undefined;

  // Parse external links: ACF repeater
  const linksRaw = acf.ministry_external_links as
    | { label: string; href: string; description?: string }[]
    | undefined;

  return {
    title: decodeHtmlEntities(post.title.rendered),
    subtitle: (acf.ministry_subtitle as string) || "",
    slug,
    description,
    schedule: schedRaw || undefined,
    contactEmail: (acf.ministry_contact_email as string) || undefined,
    externalLinks: linksRaw || undefined,
  };
}

// ---------------------------------------------------------------------------
// Content Pages (about, partnership, baptism, stories, new-to-faith)
// ---------------------------------------------------------------------------

export async function getContentPage(
  slug: string
): Promise<ContentPageData> {
  const posts = await wpFetch<WPPostRaw[]>(
    `content-page?slug=${slug}&per_page=1&_fields=id,title,acf`,
    ["wordpress", "pages"]
  );

  if (!posts.length) throw new Error(`Content page not found: ${slug}`);
  const post = posts[0];
  const acf = post.acf;

  // Resolve attachment-array fields (hero + card image) in one media
  // call so we get cache-busted source URLs rather than IDs.
  const mediaMap = await resolveImageFields(acf, [
    "page_hero_image",
    "page_card_image",
  ]);

  // Parse sections: ACF flexible content or repeater
  const sectionsRaw = acf.page_sections as
    | {
        label?: string;
        heading: string;
        heading_accent?: string;
        body: string;
        image_src?: string;
        image_alt?: string;
        image_position?: "left" | "right";
      }[]
    | undefined;

  const sections = (sectionsRaw || []).map((s) => ({
    label: s.label,
    heading: s.heading,
    headingAccent: s.heading_accent,
    body: s.body
      .split(/<\/?p>/)
      .map((t: string) => t.trim())
      .filter(Boolean),
    image: s.image_src
      ? { src: s.image_src, alt: s.image_alt || "", position: s.image_position }
      : undefined,
  }));

  // CTA — accept either the new flat fields (page_cta_heading,
  // page_cta_description, page_cta_text, page_cta_link) introduced by
  // the v1.4 plugin update, or the legacy group field `page_cta` so
  // existing installs that haven't re-imported the ACF JSON still work.
  const flatCtaHeading = acf.page_cta_heading as string | undefined;
  const flatCtaText = acf.page_cta_text as string | undefined;
  const groupCta = acf.page_cta as
    | { heading?: string; description?: string; text?: string; link?: string }
    | undefined;
  let cta: ContentPageData["cta"];
  if (flatCtaHeading && flatCtaText) {
    cta = {
      heading: flatCtaHeading,
      description: (acf.page_cta_description as string) || undefined,
      text: flatCtaText,
      link: (acf.page_cta_link as string) || "",
    };
  } else if (groupCta?.heading && groupCta.text) {
    cta = {
      heading: groupCta.heading,
      description: groupCta.description,
      text: groupCta.text,
      link: groupCta.link || "",
    };
  }

  // Card thumbnail used by cross-page grids (e.g. /about Next Steps).
  // All fields optional — consumers fall back to bundled defaults.
  const cardImage = extractImageUrl(acf.page_card_image, mediaMap);
  const cardTag = (acf.page_card_tag as string) || undefined;
  const cardTitle = (acf.page_card_title as string) || undefined;
  const cardDescription = (acf.page_card_description as string) || undefined;
  const hasCardData =
    Boolean(cardImage) || Boolean(cardTag) || Boolean(cardTitle) || Boolean(cardDescription);

  return {
    title: decodeHtmlEntities(post.title.rendered),
    slug,
    subtitle: (acf.page_subtitle as string) || undefined,
    breadcrumbs: [{ label: decodeHtmlEntities(post.title.rendered), href: `/${slug}` }],
    heroImage: extractImageUrl(acf.page_hero_image, mediaMap) || undefined,
    sections,
    cta,
    card: hasCardData
      ? {
          image: cardImage || undefined,
          tag: cardTag,
          title: cardTitle,
          description: cardDescription,
        }
      : undefined,
  };
}

// ---------------------------------------------------------------------------
// Sermon Series
// ---------------------------------------------------------------------------
//
// Sermon series are now sourced from Planning Center Publishing API
// directly. See src/lib/planning-center.ts → getSermonSeriesFromPC().
// The legacy WordPress `sermon_series` CPT reader was removed in
// Phase 3a (May 2026) when Church Center became the single source of
// truth for sermon content.

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Decode HTML entities that WordPress emits in `title.rendered` and
 * other rendered fields. WordPress auto-applies wptexturize() which
 * turns straight quotes/apostrophes into typographically correct
 * curly variants, encoded as numeric HTML entities (e.g. &#8217;).
 *
 * When that string is rendered through JSX, React encodes the `&`
 * again, producing `&amp;#8217;` in the DOM. Decoding before render
 * keeps the title clean.
 *
 * Handles numeric (decimal + hex) and the common named entities WP
 * emits. Safe to apply to any WP-rendered text field.
 */
function decodeHtmlEntities(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10))
    )
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

/**
 * Map of WordPress media attachment ID → resolved info, populated
 * by `resolveImageFields()` before parsing each fetcher's response.
 * `extractImageUrl()` can then synchronously turn an integer ACF
 * value back into a full URL with cache buster.
 */
type MediaMap = Record<number, { url: string; modified?: string }>;

/**
 * Append a `?v=<unix>` cache-buster query param so Vercel's image
 * optimization cache (keyed by source URL) busts whenever the
 * underlying attachment is updated.
 */
function appendCacheBuster(url: string, stampSource: string | undefined): string {
  if (!stampSource) return url;
  const parsed = Date.parse(stampSource.replace(" ", "T") + "Z");
  const cacheBuster = Number.isFinite(parsed)
    ? Math.floor(parsed / 1000).toString()
    : encodeURIComponent(stampSource);
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${cacheBuster}`;
}

/**
 * Extract a usable image URL from an ACF image field. Handles all
 * three formats ACF can return depending on `return_format` and
 * REST API serialization:
 *
 *   1. Object with `url`        (return_format: array)
 *   2. URL string                (return_format: url)
 *   3. Integer attachment ID     (return_format: id, OR ACF Pro
 *                                 REST quirk that returns IDs even
 *                                 when array is configured — common)
 *
 * For case 3 we need the optional `mediaMap` argument, populated
 * by `resolveImageFields()` before parsing, which carries pre-fetched
 * media URL + modified timestamp for each ID.
 */
function extractImageUrl(field: unknown, mediaMap?: MediaMap): string | null {
  if (!field) return null;

  // Case 3: integer attachment ID
  if (typeof field === "number" && field > 0) {
    if (mediaMap && mediaMap[field]) {
      return appendCacheBuster(mediaMap[field].url, mediaMap[field].modified);
    }
    // No map provided — we can't resolve this ID synchronously
    return null;
  }

  // Case 2: URL string
  if (typeof field === "string") return field;

  // Case 1: full object
  if (typeof field === "object" && field !== null) {
    const obj = field as {
      url?: string;
      modified?: string;
      modified_gmt?: string;
      date?: string;
    };
    const url = obj.url;
    if (!url) return null;
    const stampSource = obj.modified || obj.modified_gmt || obj.date;
    return appendCacheBuster(url, stampSource);
  }

  return null;
}

/**
 * Walk an ACF payload, find any integer values stored under the
 * given keys (the names of image fields for that post type), and
 * batch-fetch their media URLs in a single REST call.
 *
 * Returns a map suitable for passing to `extractImageUrl`.
 *
 * Also handles repeater fields by accepting nested keys with dot
 * notation (e.g., "next_steps.image" walks each row of next_steps
 * and resolves its image sub-field).
 */
async function resolveImageFields(
  acf: Record<string, unknown>,
  imageFieldKeys: string[]
): Promise<MediaMap> {
  if (!WORDPRESS_URL) return {};

  const ids = new Set<number>();
  for (const path of imageFieldKeys) {
    collectImageIds(acf, path, ids);
  }

  if (ids.size === 0) return {};

  const idList = Array.from(ids);
  const url = `${WORDPRESS_URL}/wp-json/wp/v2/media?include=${idList.join(",")}&per_page=${idList.length}&_fields=id,source_url,modified_gmt,date_gmt`;

  try {
    const res = await fetch(url, buildFetchOptions(["wordpress", "media"]));
    if (!res.ok) return {};
    const items = (await res.json()) as Array<{
      id: number;
      source_url?: string;
      modified_gmt?: string;
      date_gmt?: string;
    }>;
    const map: MediaMap = {};
    for (const item of items) {
      if (item.source_url) {
        map[item.id] = {
          url: item.source_url,
          modified: item.modified_gmt || item.date_gmt,
        };
      }
    }
    return map;
  } catch {
    return {};
  }
}

/**
 * Walk a (possibly nested) field path on an ACF payload and add any
 * integer values found at that path to the `out` set.
 *
 * Path syntax:
 *   "about_image"                -> top-level field
 *   "next_steps.image"           -> walks an array, resolves each row's `image`
 */
function collectImageIds(
  acf: unknown,
  path: string,
  out: Set<number>
): void {
  if (!acf || typeof acf !== "object") return;
  const [head, ...rest] = path.split(".");
  const value = (acf as Record<string, unknown>)[head];

  if (rest.length === 0) {
    // Leaf — collect ID if it's a positive integer
    if (typeof value === "number" && value > 0 && Number.isInteger(value)) {
      out.add(value);
    }
    return;
  }

  // Continue walking
  if (Array.isArray(value)) {
    for (const item of value) {
      collectImageIds(item, rest.join("."), out);
    }
  } else if (typeof value === "object" && value !== null) {
    collectImageIds(value, rest.join("."), out);
  }
}
