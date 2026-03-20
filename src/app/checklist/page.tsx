import type { Metadata } from "next";
import ChecklistClient from "./ChecklistClient";

export const metadata: Metadata = {
  title: "Discovery Checklist | 180 Life Church",
  description:
    "Help us set up your new website by completing this short discovery checklist. Fill in what you know, come back anytime.",
};

export default function ChecklistPage() {
  return <ChecklistClient />;
}
