import type { MetadataRoute } from "next";
import {
  fetchAllMinistryPages,
  fetchAllSermonSeries,
  getAllMinistrySlugs,
  getAllSeriesSlugs,
} from "@/lib/data";

const SITE_URL = "https://180lifechurch.org";

/**
 * XML sitemap for search engines.
 *
 * Auto-generated from the route list (static pages) plus the
 * dynamic ministries and sermon series. Next.js serves this at
 * /sitemap.xml without further configuration.
 *
 * `lastModified` is omitted on static routes since Next.js will
 * use the build time, which is reasonable for content-driven pages
 * where ISR keeps things fresh. Dynamic routes set lastModified
 * to the current request time so the sitemap always reflects
 * the most recent revalidation.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes — listed in order of importance for SEO
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${SITE_URL}/about`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/sermons`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_URL}/ministries`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/leadership`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/connect`, priority: 0.85, changeFrequency: "monthly" },
    { url: `${SITE_URL}/stories`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/give`, priority: 0.8, changeFrequency: "yearly" },
    { url: `${SITE_URL}/new`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/contact`, priority: 0.7, changeFrequency: "yearly" },
    { url: `${SITE_URL}/baptism`, priority: 0.7, changeFrequency: "yearly" },
    { url: `${SITE_URL}/partnership`, priority: 0.7, changeFrequency: "yearly" },
    { url: `${SITE_URL}/immeasurably-more`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${SITE_URL}/membership`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${SITE_URL}/serving`, priority: 0.6, changeFrequency: "yearly" },
    { url: `${SITE_URL}/new-to-faith`, priority: 0.6, changeFrequency: "yearly" },
  ];

  // Dynamic ministry pages
  const ministrySlugs = getAllMinistrySlugs();
  const ministryRoutes: MetadataRoute.Sitemap = ministrySlugs.map((slug) => ({
    url: `${SITE_URL}/ministries/${slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
    lastModified: now,
  }));

  // Dynamic sermon series pages
  let seriesRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllSeriesSlugs();
    seriesRoutes = slugs.map((slug) => ({
      url: `${SITE_URL}/sermons/${slug}`,
      priority: 0.6,
      changeFrequency: "monthly",
      lastModified: now,
    }));
  } catch {
    // If sermon series can't load, continue without them rather
    // than breaking the whole sitemap.
  }

  // Resolve unused promises so the typechecker is happy. These are
  // imported for forward compatibility when sitemap entries grow
  // to include `lastModified` from CMS data.
  void fetchAllMinistryPages;
  void fetchAllSermonSeries;

  return [...staticRoutes, ...ministryRoutes, ...seriesRoutes];
}
