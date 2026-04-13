import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fetchFooterProps } from "@/lib/data";
import { WomensMinistryContent } from "./WomensMinistryContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Ministry | 180 Life Church",
  description:
    "We seek to connect, encourage, and equip women to pursue a deep, transforming relationship with Christ.",
};

export default async function Page() {
  const footerProps = await fetchFooterProps();
  return (
    <>
      <Navbar />
      <WomensMinistryContent />
      <Footer {...footerProps} />
    </>
  );
}
