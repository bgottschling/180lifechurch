import { ContentPageTemplate } from "@/components/templates/ContentPageTemplate";
import { CONTENT_PAGES } from "@/lib/subpage-fallbacks";
import type { Metadata } from "next";

const data = CONTENT_PAGES["stories"];

export const metadata: Metadata = {
  title: "Stories | 180 Life Church",
  description: data.subtitle,
};

export default function StoriesPage() {
  return <ContentPageTemplate data={data} />;
}
