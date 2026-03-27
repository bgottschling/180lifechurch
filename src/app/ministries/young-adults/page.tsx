import { MinistryPageTemplate } from "@/components/templates/MinistryPageTemplate";
import { MINISTRY_PAGES } from "@/lib/subpage-fallbacks";
import type { Metadata } from "next";

const data = MINISTRY_PAGES["young-adults"];

export const metadata: Metadata = {
  title: `${data.title} | 180 Life Church`,
  description: data.subtitle,
};

export default function YoungAdultsPage() {
  return <MinistryPageTemplate data={data} />;
}
