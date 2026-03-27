import { ContentPageTemplate } from "@/components/templates/ContentPageTemplate";
import { CONTENT_PAGES } from "@/lib/subpage-fallbacks";
import type { Metadata } from "next";

const data = CONTENT_PAGES["baptism"];

export const metadata: Metadata = {
  title: "Baptism | 180 Life Church",
  description: data.subtitle,
};

export default function BaptismPage() {
  return <ContentPageTemplate data={data} />;
}
