import { MinistryPageTemplate } from "@/components/templates/MinistryPageTemplate";
import { fetchMinistryPage } from "@/lib/data";
import { MINISTRY_SEO_DEFAULTS, metadataFromDefaults } from "@/lib/seo-defaults";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SLUG = "prayer";
const ROUTE = `/ministries/${SLUG}`;

// SEO from audit (docs/seo-audit-current-site.md) preserves search
// rankings during the cutover from the legacy WordPress site.
export const metadata: Metadata = metadataFromDefaults(
  MINISTRY_SEO_DEFAULTS[SLUG],
  ROUTE
);

export default async function Page() {
  const data = await fetchMinistryPage(SLUG);
  if (!data) notFound();
  return <MinistryPageTemplate data={data} />;
}
