import { ContentPageTemplate } from "@/components/templates/ContentPageTemplate";
import { fetchContentPage } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SLUG = "new-to-faith";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchContentPage(SLUG);
  if (!data) return {};
  return {
    title: `${data.title} | 180 Life Church`,
    description: data.subtitle,
  };
}

export default async function Page() {
  const data = await fetchContentPage(SLUG);
  if (!data) notFound();
  return <ContentPageTemplate data={data} />;
}
