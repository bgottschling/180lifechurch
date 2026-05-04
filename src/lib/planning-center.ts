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

interface PCRegistrationsEventResponse {
  data: Array<{
    id: string;
    attributes: {
      name?: string;
      starts_at?: string | null;
      ends_at?: string | null;
      event_time?: string;
      description?: string;
      featured?: boolean;
      logo_url?: string | null;
    };
  }>;
}

/**
 * Fetch upcoming events from Planning Center Registrations.
 *
 * We send `filter=upcoming` AND additionally drop any event whose
 * `ends_at` (or `starts_at` if no end) is in the past. This double
 * filter protects us from cache staleness — even if the ISR-cached
 * response contains an event that has since started/ended, our
 * client-side filter catches it.
 */
export async function getEventsFromPC(): Promise<WPEvent[]> {
  const data = await pcFetch<PCRegistrationsEventResponse>(
    "/registrations/v2/events?filter=upcoming&order=starts_at&per_page=15",
    "events"
  );

  const now = Date.now();

  const mapped: (WPEvent | null)[] = (data.data || []).map((event) => {
    const attrs = event.attributes;
    const startsAt = attrs.starts_at ? new Date(attrs.starts_at) : null;
    const endsAt = attrs.ends_at ? new Date(attrs.ends_at) : null;

    // Drop events that have already ended (or started, if no end set)
    const cutoff = endsAt || startsAt;
    if (cutoff && cutoff.getTime() < now) {
      return null;
    }

    const dateStr = startsAt
      ? startsAt.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })
      : "";

    const result: WPEvent = {
      id: Number(event.id) || 0,
      title: attrs.name || "Untitled Event",
      date: dateStr,
      time: attrs.event_time || "",
      description: attrs.description || "",
      featured: Boolean(attrs.featured),
      planningCenterLink: `https://180life.churchcenter.com/registrations/events/${event.id}`,
    };
    return result;
  });

  return mapped
    .filter((e): e is WPEvent => e !== null)
    .slice(0, 6);
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
 * Pick the largest available variant of a PC art file.
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

    // Image fallback chain
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
      dateRange: formatDateRange(attrs.started_at, attrs.ended_at),
      churchCenterUrl: attrs.church_center_url,
      sermons,
    };
  }

  return result;
}
