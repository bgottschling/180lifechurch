import { MinistryPageTemplate } from "@/components/templates/MinistryPageTemplate";
import { fetchMinistryPage } from "@/lib/data";
import { MINISTRY_SEO_DEFAULTS, metadataFromDefaults } from "@/lib/seo-defaults";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SLUG = "life-groups";
const ROUTE = `/ministries/${SLUG}`;

// SEO from audit takes precedence over CMS-derived metadata to
// preserve search rankings during cutover. See docs/seo-audit-current-site.md.
export const metadata: Metadata = metadataFromDefaults(
  MINISTRY_SEO_DEFAULTS[SLUG],
  ROUTE
);

export default async function Page() {
  const data = await fetchMinistryPage(SLUG);
  if (!data) notFound();
  return <MinistryPageTemplate data={data} />;
}
