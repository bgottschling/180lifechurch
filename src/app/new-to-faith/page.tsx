import { ContentPageTemplate } from "@/components/templates/ContentPageTemplate";
import { CONTENT_PAGES } from "@/lib/subpage-fallbacks";
import type { Metadata } from "next";

const data = CONTENT_PAGES["new-to-faith"];

export const metadata: Metadata = {
  title: "New to Faith | 180 Life Church",
  description:
    "Did you recently give your life to Christ? We are here to help you start your journey with Bible resources, devotionals, and community.",
};

export default function NewToFaithPage() {
  return <ContentPageTemplate data={data} />;
}
