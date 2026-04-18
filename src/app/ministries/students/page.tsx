import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fetchFooterProps } from "@/lib/data";
import { StudentsMinistryContent } from "./StudentsMinistryContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Ministry | 180 Life Church",
  description:
    "A Christ-centered community for middle school and high school students to grow, connect, and find their place in God's story.",
};

export default async function Page() {
  const footerProps = await fetchFooterProps();
  return (
    <>
      <Navbar />
      <StudentsMinistryContent />
      <Footer {...footerProps} />
    </>
  );
}
