import { MinistryPageTemplate } from "@/components/templates/MinistryPageTemplate";
import { fetchMinistryPage } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SLUG = "mens";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchMinistryPage(SLUG);
  if (!data) return {};
  return {
    title: `${data.title} | 180 Life Church`,
    description: data.subtitle,
  };
}

export default async function Page() {
  const data = await fetchMinistryPage(SLUG);
  if (!data) notFound();
  return <MinistryPageTemplate data={data} />;
}
