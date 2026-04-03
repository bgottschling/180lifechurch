import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fetchFooterProps } from "@/lib/data";
import { MensMinistryContent } from "./MensMinistryContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Ministry | 180 Life Church",
  description:
    "Equipping men of all ages and walks of life to live on mission as godly men and leaders in their homes, church, community, and world.",
};

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
