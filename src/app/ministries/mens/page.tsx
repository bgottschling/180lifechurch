import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fetchFooterProps } from "@/lib/data";
import { MensMinistryContent } from "./MensMinistryContent";
import { MINISTRY_SEO_DEFAULTS, metadataFromDefaults } from "@/lib/seo-defaults";
import type { Metadata } from "next";

// SEO from audit. See docs/seo-audit-current-site.md.
export const metadata: Metadata = metadataFromDefaults(
  MINISTRY_SEO_DEFAULTS["mens"],
  "/ministries/mens"
);

export default async function MensMinistryPage() {
  const footerProps = await fetchFooterProps();

  return (
    <>
      <Navbar />
      <MensMinistryContent />
      <Footer {...footerProps} />
    </>
  );
}
