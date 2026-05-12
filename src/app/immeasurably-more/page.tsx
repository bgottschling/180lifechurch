import { ContentPageTemplate } from "@/components/templates/ContentPageTemplate";
import { fetchContentPage } from "@/lib/data";
import {
  CONTENT_PAGE_SEO_DEFAULTS,
  metadataFromDefaults,
} from "@/lib/seo-defaults";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SLUG = "immeasurably-more";

// Vision-cast companion to /give. Editor-managed via the content_page
// CPT (slug: immeasurably-more). The Give button on the navbar still
// points to /give for fast access; this page is reached via the
// "Read the vision" callout on the /give page — that gives anyone
// looking for the practical info one click to action, while anyone
// looking for the why gets a fully fleshed-out page to read.
export const metadata: Metadata = metadataFromDefaults(
  CONTENT_PAGE_SEO_DEFAULTS[SLUG],
  `/${SLUG}`
);

export default async function Page() {
  const data = await fetchContentPage(SLUG);
  if (!data) notFound();
  return <ContentPageTemplate data={data} />;
}
