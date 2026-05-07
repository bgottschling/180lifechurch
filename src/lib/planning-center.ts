/**
 * Planning Center API client.
 *
 * Single source of truth for events and sermon content. Authenticates
 * via Personal Access Token (Basic Auth: APP_ID:SECRET).
 *
 * Two products in use:
 *   - Registrations API (/registrations/v2/) for events
 *   - Publishing API (/publishing/v2/) for sermon series + episodes
 *
 * All fetchers are tagged for Next.js cache invalidation:
 *   - "events"   → next.revalidate=86400 (24h), tag bust on cron + on-demand
 *   - "sermons"  → same
 *
 * Daily refresh is handled by /api/cron/refresh-content (see vercel.json).
 */

import type { WPEvent } from "./wordpress-types";
import type { SermonSeriesData } from "./subpage-types";
import type { HealthCheck } from "./wordpress";

const PC_APP_ID = process.env.PLANNING_CENTER_APP_ID;
const PC_SECRET = process.env.PLANNING_CENTER_SECRET;
const PC_BASE = "https://api.planningcenteronline.com";

// 180 Life Church's Messages channel ID. Hardcoded because it has been
// stable since the church set up Publishing in 2022 and we only have
// one channel.
const SERMONS_CHANNEL_ID = "12038";

// Cache for 24 hours; refreshed daily by /api/cron/refresh-content
const REVALIDATE_SECONDS = 24 * 60 * 60;

function getAuthHeader(): string {
  return (
    "Basic " +
    Buffer.from(`${PC_APP_ID}:${PC_SECRET}`).toString("base64")
  );
}

function isConfigured(): boolean {
  return Boolean(PC_APP_ID && PC_SECRET);
}

// ---------------------------------------------------------------------------
// Generic JSON:API helpers
// ---------------------------------------------------------------------------

async function pcFetch<T>(path: string, tag: string): Promise<T> {
  if (!isConfigured()) {
    throw new Error("Planning Center credentials not configured");
  }
  const res = await fetch(`${PC_BASE}${path}`, {
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    next: { revalidate: REVALIDATE_SECONDS, tags: [tag, "planning-center"] },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Planning Center API error: ${res.status} ${res.statusText} for ${path}\n${text.slice(0, 200)}`
    );
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Events (Registrations API)
// ---------------------------------------------------------------------------
//
// Planning Center renamed the Registrations "Event" resource to "Signup"
// (the API path went from /registrations/v2/events → /registrations/v2/signups).
// The new model splits scheduling out: a Signup has 0..n SignupTime resources
// reachable via the `next_signup_time` relationship. Dates live on SignupTime,
// not the Signup itself.
//
// Available filters: `archived` and `unarchived` (no more `upcoming`).
// We pull `unarchived` and drop past events client-side using SignupTime data.

interface PCSignupListResponse {
  data: Array<{
    id: string;
    type: string;
    attributes: {
      name?: string;
      description?: string | null;
      logo_url?: string | null;
      new_registration_url?: string;
      open?: boolean;
      closed?: boolean;
      archived?: boolean;
    };
    relationships?: {
      next_signup_time?: {
        data?: { id: string; type: string } | null;
      };
    };
  }>;
  included?: Array<{
    type: string;
    id: string;
    attributes: {
      starts_at?: string;
      ends_at?: string;
      all_day?: boolean;
    };
  }>;
}

/**
 * Strip HTML tags and collapse whitespace from a Planning Center
 * description. PC stores descriptions as rich HTML; the homepage event
 * cards render plain text.
 */
function stripHtmlForCard(html: string | null | undefined, maxLen = 200): string {
  if (!html) return "";
  const plain = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLen) return plain;
  // Cut at the nearest word boundary before the limit
  const cut = plain.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > maxLen - 30 ? cut.slice(0, lastSpace) : cut) + "…";
}

/**
 * Fetch upcoming events from Planning Center Registrations.
 *
 * Pulls `unarchived` signups, includes their next SignupTime in a
 * single round-trip via JSON:API `?include=next_signup_time`, then
 * filters and orders client-side:
 *
 *   - Drops signups whose next SignupTime ends_at (or starts_at) is past
 *   - Drops signups with no SignupTime at all (nothing to show on a date)
 *   - Sorts ascending by starts_at so soonest events appear first
 *   - Limits to the next 6
 *
 * The PCO Registrations 2026 rebrand changed:
 *   - Resource name: Event → Signup
 *   - Endpoint: /registrations/v2/events → /registrations/v2/signups
 *   - Date fields: moved to a related SignupTime resource
 *   - Available filters: filter=upcoming removed; only archived/unarchived
 */
export async function getEventsFromPC(): Promise<WPEvent[]> {
  const data = await pcFetch<PCSignupListResponse>(
    "/registrations/v2/signups?filter=unarchived&include=next_signup_time&per_page=25",
    "events"
  );

  // Build a map of SignupTime id → attributes for inline lookup
  const signupTimes: Record<
    string,
    { starts_at?: string; ends_at?: string; all_day?: boolean }
  > = {};
  for (const item of data.included || []) {
    if (item.type === "SignupTime") {
      signupTimes[item.id] = item.attributes;
    }
  }

  const now = Date.now();

  type WithSort = { event: WPEvent; sortKey: number };

  const mapped: WithSort[] = [];
  for (const signup of data.data || []) {
    const attrs = signup.attributes;
    const timeId = signup.relationships?.next_signup_time?.data?.id;
    const time = timeId ? signupTimes[timeId] : undefined;

    // Skip if no scheduled time (signup exists but no event date set)
    if (!time) continue;

    const startsAt = time.starts_at ? new Date(time.starts_at) : null;
    const endsAt = time.ends_at ? new Date(time.ends_at) : null;

    // Drop events that have already ended (or started, if no end set)
    const cutoff = endsAt || startsAt;
    if (!cutoff || cutoff.getTime() < now) continue;

    const dateStr = startsAt
      ? startsAt.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })
      : "";

    const timeStr =
      startsAt && !time.all_day
        ? startsAt.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })
        : "";

    const event: WPEvent = {
      id: Number(signup.id) || 0,
      title: attrs.name || "Untitled Event",
      date: dateStr,
      time: timeStr,
      description: stripHtmlForCard(attrs.description),
      // PC Signups don't have a "featured" flag we can use; keep false
      // and let editorial logic decide featured ordering elsewhere.
      featured: false,
      planningCenterLink:
        attrs.new_registration_url ||
        `https://180life.churchcenter.com/registrations/events/${signup.id}`,
      // Editor-uploaded event image. PC's `logo_url` is the image
      // shown on the Church Center signup page — same image editors
      // already curate, so reusing it keeps the homepage card visually
      // consistent with the registration page. Null if no image set.
      image: attrs.logo_url || null,
    };

    mapped.push({
      event,
      sortKey: startsAt ? startsAt.getTime() : Number.MAX_SAFE_INTEGER,
    });
  }

  // Soonest first
  mapped.sort((a, b) => a.sortKey - b.sortKey);

  return mapped.slice(0, 6).map((m) => m.event);
}

// ---------------------------------------------------------------------------
// Sermons (Publishing API)
// ---------------------------------------------------------------------------

interface PCArtVariants {
  small?: string;
  medium?: string;
  large?: string;
  original?: string;
  original_ratio_small?: string;
}

interface PCSeries {
  id: string;
  attributes: {
    title?: string;
    description?: string | null;
    art?: { attributes?: { variants?: PCArtVariants } };
    church_center_url?: string;
    started_at?: string | null;
    ended_at?: string | null;
    episodes_count?: number;
    published?: boolean;
  };
}

interface PCEpisode {
  id: string;
  attributes: {
    title?: string;
    description?: string | null;
    library_video_url?: string | null;
    library_video_thumbnail_url?: string | null;
    video_thumbnail_url?: string | null;
    art?: { attributes?: { variants?: PCArtVariants } };
    published_to_library_at?: string | null;
  };
  relationships?: {
    series?: { data?: { id: string } | null };
  };
}

interface PCSeriesListResponse {
  data: PCSeries[];
  links?: { next?: string };
}

interface PCEpisodeListResponse {
  data: PCEpisode[];
  links?: { next?: string };
}

/**
 * Pick the largest available variant of a PC art file. Used for the
 * /sermons hero where the card spans up to 1152px wide.
 */
function pickArtUrl(variants?: PCArtVariants): string | null {
  if (!variants) return null;
  return (
    variants.large ||
    variants.medium ||
    variants.small ||
    variants.original ||
    variants.original_ratio_small ||
    null
  );
}

/**
 * Pick a smaller variant of a PC art file for grid/sidebar cards
 * (~320–400px wide). Prefers `medium` over `large` so each tile
 * downloads a few hundred KB instead of multiple MB. Falls back to
 * pickArtUrl's chain if the smaller variants don't exist.
 *
 * PC's "large" variant is typically 2000×1125 — fine for the hero,
 * wildly oversized for a 320px card. With unoptimized=true (because
 * Vercel can't transform PC's signed URLs), the browser pays full
 * download cost for whatever variant we pick, so picking the right
 * size up front is the only lever we have.
 */
function pickArtThumbUrl(variants?: PCArtVariants): string | null {
  if (!variants) return null;
  return (
    variants.medium ||
    variants.small ||
    variants.original_ratio_small ||
    variants.large ||
    variants.original ||
    null
  );
}

/**
 * Extract YouTube video ID from a `library_video_url` like
 * "https://www.youtube.com/watch?v=ABC123" or "https://youtu.be/ABC123".
 */
function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  return null;
}

/**
 * Convert a series title into a URL slug. Mirrors how the live site
 * already constructs URLs (lowercase, hyphenated, alphanum + hyphens).
 */
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Format a date range from started_at/ended_at into the existing
 * "Month D, YYYY - Month D, YYYY" or "Month D, YYYY - Present" format.
 */
function formatDateRange(startedAt?: string | null, endedAt?: string | null): string {
  if (!startedAt) return "";
  const start = new Date(startedAt);
  const startStr = start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!endedAt) return `${startStr} - Present`;

  const end = new Date(endedAt);
  // If the series hasn't actually ended yet (ended_at is in the future),
  // show "Present" rather than a future end date — matches what editors
  // expect for ongoing series.
  if (end.getTime() > Date.now()) return `${startStr} - Present`;

  const endStr = end.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} - ${endStr}`;
}

/**
 * Fetch all series in the Messages channel, ordered newest first.
 * Paginates if necessary (50 per page).
 */
async function fetchAllSeriesPages(): Promise<PCSeries[]> {
  const all: PCSeries[] = [];
  let url = `/publishing/v2/channels/${SERMONS_CHANNEL_ID}/series?order=-started_at&per_page=50`;
  // Hard limit on pagination depth as a safety guard
  for (let i = 0; i < 10; i++) {
    const data = await pcFetch<PCSeriesListResponse>(url, "sermons");
    all.push(...(data.data || []));
    if (!data.links?.next) break;
    // links.next is an absolute URL — strip the host so pcFetch can prepend
    url = data.links.next.replace(PC_BASE, "");
  }
  return all;
}

/**
 * Fetch all published episodes across the channel, newest first.
 * Used to populate `sermons[]` for each series in a single pass.
 */
async function fetchAllEpisodesPages(): Promise<PCEpisode[]> {
  const all: PCEpisode[] = [];
  let url = `/publishing/v2/episodes?filter=published&order=-published_to_library_at&per_page=100`;
  for (let i = 0; i < 10; i++) {
    const data = await pcFetch<PCEpisodeListResponse>(url, "sermons");
    all.push(...(data.data || []));
    if (!data.links?.next) break;
    url = data.links.next.replace(PC_BASE, "");
  }
  return all;
}

/**
 * Fetch all sermon series with their nested episodes from Planning Center.
 *
 * Image priority for each series:
 *   1. PC series artwork (art.variants.large)
 *   2. First episode's library_video_thumbnail_url (YouTube maxres)
 *   3. First episode's video_thumbnail_url (PC override if present)
 *   4. null (consumer falls back to placeholder)
 *
 * Returns a slug-keyed map matching SermonSeriesData[] shape used by
 * the existing /sermons and /sermons/[slug] pages.
 */
export async function getSermonSeriesFromPC(): Promise<
  Record<string, SermonSeriesData>
> {
  // One call for all series, one call for all episodes — group locally
  const [series, episodes] = await Promise.all([
    fetchAllSeriesPages(),
    fetchAllEpisodesPages(),
  ]);

  // Group episodes by series ID
  const episodesBySeriesId: Record<string, PCEpisode[]> = {};
  for (const ep of episodes) {
    const seriesId = ep.relationships?.series?.data?.id;
    if (!seriesId) continue;
    (episodesBySeriesId[seriesId] = episodesBySeriesId[seriesId] || []).push(ep);
  }

  const result: Record<string, SermonSeriesData> = {};

  for (const s of series) {
    const attrs = s.attributes;
    if (!attrs.title) continue;
    if (attrs.published === false) continue;

    const slug = slugifyTitle(attrs.title);
    const seriesEpisodes = episodesBySeriesId[s.id] || [];

    // Build sermons list, newest first
    const sermons = seriesEpisodes
      .map((ep) => {
        const title = ep.attributes.title || "";
        const youtubeId = extractYouTubeId(ep.attributes.library_video_url);
        const date = ep.attributes.published_to_library_at
          ? new Date(ep.attributes.published_to_library_at).toLocaleDateString(
              "en-US",
              { month: "long", day: "numeric", year: "numeric" }
            )
          : "";
        return {
          title,
          date,
          youtubeId: youtubeId || "",
          speaker: undefined as string | undefined,
        };
      })
      .filter((s) => s.title);

    // Image fallback chain — large variant for the hero
    const seriesArt = pickArtUrl(attrs.art?.attributes?.variants);
    const firstEpisodeYouTubeThumb =
      seriesEpisodes[0]?.attributes.library_video_thumbnail_url;
    const firstEpisodeYouTubeId = sermons[0]?.youtubeId;
    const youtubeFallback = firstEpisodeYouTubeId
      ? `https://i.ytimg.com/vi/${firstEpisodeYouTubeId}/hqdefault.jpg`
      : null;

    const image =
      seriesArt ||
      firstEpisodeYouTubeThumb ||
      youtubeFallback ||
      "/images/series/placeholder.jpg";

    // Smaller variant for grid + sidebar tiles. Falls back to the same
    // chain if no medium PC variant; YouTube's hqdefault is already
    // the right size so we just reuse it for both contexts.
    const seriesArtThumb = pickArtThumbUrl(attrs.art?.attributes?.variants);
    const imageThumb =
      seriesArtThumb ||
      firstEpisodeYouTubeThumb ||
      youtubeFallback ||
      undefined;

    // Description: PC field is plain text or null; split on double newlines
    const descriptionRaw = (attrs.description || "").trim();
    const description = descriptionRaw
      ? descriptionRaw.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
      : [];

    // Subtitle: first paragraph of description, falling back to
    // a constructed phrase from the date range
    const subtitle = description[0] || "";

    result[slug] = {
      title: attrs.title,
      subtitle,
      slug,
      description,
      image,
      imageThumb,
      dateRange: formatDateRange(attrs.started_at, attrs.ended_at),
      churchCenterUrl: attrs.church_center_url,
      sermons,
    };
  }

  return result;
}

// ---------------------------------------------------------------------------
// Health checks (consumed by /api/wordpress-health and the 180 Life Sync plugin)
// ---------------------------------------------------------------------------

/**
 * Run reachability + auth checks against the Planning Center products
 * we depend on. Returns an array of HealthCheck items that can be
 * concatenated with the WordPress checks for a unified site-health
 * response.
 *
 * Catches the kinds of failures we hit in real life:
 *   - PAT credentials missing or never set in Vercel env
 *   - PAT lacks Registrations or Publishing product access
 *   - PC rebrands/relocates an endpoint (the events → signups
 *     migration that broke the May 2026 build)
 *   - Sermons channel deleted or its ID changed in Church Center
 *   - General network/upstream errors
 */
export async function checkPlanningCenterHealth(): Promise<HealthCheck[]> {
  const checks: HealthCheck[] = [];

  // Env vars present?
  if (!PC_APP_ID || !PC_SECRET) {
    checks.push({
      name: "Planning Center configuration",
      status: "fail",
      message: "Credentials not configured",
      detail:
        "Set PLANNING_CENTER_APP_ID and PLANNING_CENTER_SECRET in Vercel " +
        "(Settings > Environment Variables) and redeploy. Generate the " +
        "PAT at https://api.planningcenteronline.com/oauth/applications.",
    });
    // Without creds, the rest of the checks would be noise; bail early.
    return checks;
  }
  checks.push({
    name: "Planning Center configuration",
    status: "pass",
    message: "Credentials configured",
    detail: "PLANNING_CENTER_APP_ID and PLANNING_CENTER_SECRET both set",
  });

  // Registrations API (signups endpoint) — this is what broke in May 2026
  // when PC renamed events → signups; checking it explicitly prevents
  // similar silent breakage in the future.
  await pingPC(
    checks,
    "Planning Center Registrations API",
    `${PC_BASE}/registrations/v2/signups?per_page=1`,
    "Signups endpoint reachable",
    {
      403: "PAT lacks Registrations product access",
      404:
        "Endpoint moved or removed — Planning Center may have rebranded the " +
        "Registrations API again. Last verified path: " +
        "/registrations/v2/signups",
    }
  );

  // Publishing API (sermons channel) — verifies the church's specific
  // sermons channel is accessible, not just the API root.
  await pingPC(
    checks,
    "Planning Center Publishing API",
    `${PC_BASE}/publishing/v2/channels/${SERMONS_CHANNEL_ID}`,
    `Sermons channel ${SERMONS_CHANNEL_ID} accessible`,
    {
      403: "PAT lacks Publishing product access",
      404:
        `Sermons channel ${SERMONS_CHANNEL_ID} not found. The channel may ` +
        `have been deleted or its ID changed in Church Center. Update ` +
        `SERMONS_CHANNEL_ID in src/lib/planning-center.ts.`,
    }
  );

  return checks;
}

/**
 * Internal: hit a PC URL and append a HealthCheck describing the result.
 * Centralizes the auth + status-code → message logic so each check
 * stays one line at the call site.
 */
async function pingPC(
  out: HealthCheck[],
  name: string,
  url: string,
  okDetail: string,
  errorMessages: Record<number, string>
): Promise<void> {
  try {
    const res = await fetch(url, {
      headers: { Authorization: getAuthHeader() },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      out.push({ name, status: "pass", message: "Reachable and authenticated", detail: okDetail });
      return;
    }
    if (res.status === 401) {
      out.push({
        name,
        status: "fail",
        message: "Authentication failed (HTTP 401)",
        detail: "Personal Access Token may be expired, revoked, or the App ID/Secret pair is wrong.",
      });
      return;
    }
    const knownDetail = errorMessages[res.status];
    out.push({
      name,
      status: "fail",
      message: `Unexpected response (HTTP ${res.status})`,
      detail: knownDetail || `Endpoint returned ${res.status} ${res.statusText}.`,
    });
  } catch (err) {
    out.push({
      name,
      status: "fail",
      message: "Network error",
      detail: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
