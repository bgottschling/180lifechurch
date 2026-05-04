// Unified data access layer.
//
// Source priority (defined per data type):
//   - Events:        Planning Center → hardcoded fallback
//   - Sermon Series: Planning Center → hardcoded fallback
//   - Site content:  WordPress       → hardcoded fallback
//
// Every page should import from here — never directly from fallbacks.
// Every fetcher is wrapped in .catch() so a failed source NEVER crashes
// rendering; the worst case is hardcoded fallback content.

import {
  getMinistries,
  getServices,
  getSiteSettings,
  getLeadership,
  getElders,
  getMinistryPage,
  getContentPage,
} from "./wordpress";

import {
  getEventsFromPC,
  getSermonSeriesFromPC,
} from "./planning-center";

import {
  FALLBACK_EVENTS,
  FALLBACK_MINISTRIES,
  FALLBACK_SERVICES,
  FALLBACK_SETTINGS,
} from "./wordpress-fallbacks";

import {
  MINISTRY_PAGES,
  CONTENT_PAGES,
  LEADERSHIP_DATA,
  ELDERS,
  ELDERS_DESCRIPTION,
  ELDERS_EMAIL,
  SERMON_SERIES,
  ALL_SERIES_SLUGS,
} from "./subpage-fallbacks";

import type { WPEvent, WPMinistry, WPService, WPSiteSettings } from "./wordpress-types";
import type {
  LeadershipData,
  MinistryPageData,
  ContentPageData,
  SermonSeriesData,
} from "./subpage-types";

// ---------------------------------------------------------------------------
// Homepage data (events, ministries, services, site settings)
// ---------------------------------------------------------------------------

/**
 * Events are sourced from Planning Center (single source of truth).
 * Falls back to hardcoded events only if PC is unreachable or
 * credentials are missing. The PC fetcher already filters out
 * past events client-side as defense in depth.
 */
export async function fetchEvents(): Promise<WPEvent[]> {
  return getEventsFromPC().catch((err) => {
    console.error("[fetchEvents] Planning Center unavailable, using fallback:", err);
    return FALLBACK_EVENTS;
  });
}

export async function fetchMinistries(): Promise<WPMinistry[]> {
  return getMinistries().catch(() => FALLBACK_MINISTRIES);
}

export async function fetchServices(): Promise<WPService[]> {
  return getServices().catch(() => FALLBACK_SERVICES);
}

export async function fetchSiteSettings(): Promise<WPSiteSettings> {
  return getSiteSettings().catch(() => FALLBACK_SETTINGS);
}

// ---------------------------------------------------------------------------
// Footer props (derived from site settings)
// ---------------------------------------------------------------------------

export async function fetchFooterProps() {
  const settings = await fetchSiteSettings();
  return {
    contact: settings.contact,
    missionStatement: settings.missionStatement,
    churchTagline: settings.churchTagline,
  };
}

// ---------------------------------------------------------------------------
// Leadership
// ---------------------------------------------------------------------------

export async function fetchLeadership(): Promise<LeadershipData> {
  return getLeadership().catch(() => LEADERSHIP_DATA);
}

export async function fetchElders(): Promise<
  { name: string; role: string; image?: string }[]
> {
  return getElders().catch(() => ELDERS);
}

/** These are unlikely to come from WP, so export directly */
export { ELDERS_DESCRIPTION, ELDERS_EMAIL };

// ---------------------------------------------------------------------------
// Ministry subpages
// ---------------------------------------------------------------------------

export async function fetchMinistryPage(
  slug: string
): Promise<MinistryPageData | undefined> {
  try {
    return await getMinistryPage(slug);
  } catch {
    return MINISTRY_PAGES[slug];
  }
}

/** All ministry slugs (for static generation) */
export function getAllMinistrySlugs(): string[] {
  return Object.keys(MINISTRY_PAGES);
}

/** Sync accessor for ministry hub page (grouped layout uses all entries) */
export async function fetchAllMinistryPages(): Promise<
  Record<string, MinistryPageData>
> {
  // When WP is connected, fetch each page; otherwise return all fallbacks
  try {
    const slugs = Object.keys(MINISTRY_PAGES);
    const results = await Promise.all(
      slugs.map(async (slug) => {
        const data = await getMinistryPage(slug).catch(
          () => MINISTRY_PAGES[slug]
        );
        return [slug, data] as const;
      })
    );
    return Object.fromEntries(results);
  } catch {
    return MINISTRY_PAGES;
  }
}

// ---------------------------------------------------------------------------
// Content pages (about, partnership, baptism, stories, new-to-faith)
// ---------------------------------------------------------------------------

export async function fetchContentPage(
  slug: string
): Promise<ContentPageData | undefined> {
  try {
    return await getContentPage(slug);
  } catch {
    return CONTENT_PAGES[slug];
  }
}

// ---------------------------------------------------------------------------
// Sermon series — Planning Center is source of truth
// ---------------------------------------------------------------------------

/**
 * Returns all sermon series from Planning Center Publishing API.
 * Falls back to hardcoded SERMON_SERIES only if PC is unreachable.
 *
 * The PC fetcher resolves artwork in this priority:
 *   1. PC series art (preferred — editor-uploaded in Church Center)
 *   2. First episode YouTube thumbnail
 *   3. Generic placeholder
 */
export async function fetchAllSermonSeries(): Promise<
  Record<string, SermonSeriesData>
> {
  return getSermonSeriesFromPC().catch((err) => {
    console.error(
      "[fetchAllSermonSeries] Planning Center unavailable, using fallback:",
      err
    );
    return SERMON_SERIES;
  });
}

export async function fetchSermonSeriesBySlug(
  slug: string
): Promise<SermonSeriesData | undefined> {
  try {
    const allSeries = await getSermonSeriesFromPC();
    return allSeries[slug];
  } catch (err) {
    console.error(
      `[fetchSermonSeriesBySlug] PC unavailable for slug=${slug}, using fallback:`,
      err
    );
    return SERMON_SERIES[slug];
  }
}

/**
 * All series slugs for `generateStaticParams`. Includes both
 * PC-known slugs and hardcoded fallback slugs so Next.js pre-renders
 * a stable URL set even during PC outages.
 */
export async function getAllSeriesSlugs(): Promise<string[]> {
  try {
    const allSeries = await getSermonSeriesFromPC();
    const liveSlugs = Object.keys(allSeries);
    // Union with hardcoded fallback so historical URLs still resolve
    return Array.from(new Set([...liveSlugs, ...ALL_SERIES_SLUGS]));
  } catch {
    return ALL_SERIES_SLUGS;
  }
}
