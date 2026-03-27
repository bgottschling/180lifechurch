import { SermonSeriesTemplate } from "@/components/templates/SermonSeriesTemplate";
import { SERMON_SERIES, ALL_SERIES_SLUGS } from "@/lib/subpage-fallbacks";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_SERIES_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = SERMON_SERIES[slug];
  if (!series) return {};

  return {
    title: `${series.title} | Sermons | 180 Life Church`,
    description: series.subtitle,
  };
}

export default async function SermonSeriesPage({ params }: Props) {
  const { slug } = await params;
  const series = SERMON_SERIES[slug];

  if (!series) {
    notFound();
  }

  // Add related series (all except current)
  const related = Object.values(SERMON_SERIES)
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
