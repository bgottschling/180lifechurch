import { SermonSeriesTemplate } from "@/components/templates/SermonSeriesTemplate";
import {
  fetchSermonSeriesBySlug,
  fetchAllSermonSeries,
  getAllSeriesSlugs,
} from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSeriesSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = await fetchSermonSeriesBySlug(slug);
  if (!series) return {};

  return {
    title: `${series.title} | Sermons | 180 Life Church`,
    description: series.subtitle,
  };
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
      image: s.sermons[0]
        ? `https://i.ytimg.com/vi/${s.sermons[0].youtubeId}/hqdefault.jpg`
        : "/images/series/placeholder.jpg",
    }));

  return <SermonSeriesTemplate data={{ ...series, relatedSeries: related }} />;
}
