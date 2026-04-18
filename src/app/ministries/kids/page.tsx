import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fetchFooterProps } from "@/lib/data";
import { KidsMinistryContent } from "./KidsMinistryContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kids Ministry | 180 Life Church",
  description:
    "Partnering with parents and caregivers to help lead their children into a relationship with Jesus and to grow in their faith.",
};

export default async function Page() {
  const footerProps = await fetchFooterProps();
  return (
    <>
      <Navbar />
      <KidsMinistryContent />
      <Footer {...footerProps} />
    </>
  );
}
