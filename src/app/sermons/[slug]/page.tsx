import { SermonSeriesTemplate } from "@/components/templates/SermonSeriesTemplate";
import {
  fetchSermonSeriesBySlug,
  fetchAllSermonSeries,
  getAllSeriesSlugs,
} from "@/lib/data";
import { buildMergedMetadata } from "@/lib/seo-defaults";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSeriesSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Per-page metadata for sermon series. Resolves through the priority
 * chain: per-post SEO override (from the SEO tab on this entry in
 * WordPress) → series-derived fallback (title + subtitle + image)
 * → site-wide defaults (inherited from layout via Next.js metadata
 * cascade).
 *
 * Editors can override any field by filling in the SEO tab on the
 * Sermon Series post in wp-admin.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = await fetchSermonSeriesBySlug(slug);
  if (!series) return {};

  return buildMergedMetadata({
    override: series.seo,
    fallback: {
      title: `${series.title} | Sermons | 180 Life Church`,
      description: series.subtitle,
      ogImage: series.image,
    },
    canonicalPath: `/sermons/${slug}`,
  });
}

export default async function SermonSeriesPage({ params }: Props) {
  const { slug } = await params;
  const series = await fetchSermonSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  // Add related series (all except current)
  const allSeries = await fetchAllSermonSeries();
  const related = Object.values(allSeries)
    .filter((s) => s.slug !== slug)
    .map((s) => ({
      title: s.title,
      slug: s.slug,
      // Use the resolved series image (PC art → first episode YouTube
      // thumb → derived YT thumb → placeholder) instead of constructing
      // a YouTube URL inline that would break for series with no video.
      image: s.image || "/images/series/placeholder.jpg",
      // Smaller variant for the sidebar tiles, falls back to the
      // hero-sized image if PC didn't return a medium variant.
      imageThumb: s.imageThumb,
    }));

  return <SermonSeriesTemplate data={{ ...series, relatedSeries: related }} />;
}
