import { ContentPageTemplate } from "@/components/templates/ContentPageTemplate";
import { CONTENT_PAGES } from "@/lib/subpage-fallbacks";
import type { Metadata } from "next";

const data = CONTENT_PAGES["partnership"];

export const metadata: Metadata = {
  title: "Partnership | 180 Life Church",
  description: data.subtitle,
};

export default function PartnershipPage() {
  return <ContentPageTemplate data={data} />;
}
