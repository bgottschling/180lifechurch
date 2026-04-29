import { ContentPageTemplate } from "@/components/templates/ContentPageTemplate";
import { fetchContentPage } from "@/lib/data";
import {
  CONTENT_PAGE_SEO_DEFAULTS,
  metadataFromDefaults,
} from "@/lib/seo-defaults";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SLUG = "stories";

// SEO from audit. See docs/seo-audit-current-site.md.
export const metadata: Metadata = metadataFromDefaults(
  CONTENT_PAGE_SEO_DEFAULTS[SLUG],
  `/${SLUG}`
);

export default async function Page() {
  const data = await fetchContentPage(SLUG);
  if (!data) notFound();
  return <ContentPageTemplate data={data} />;
}
