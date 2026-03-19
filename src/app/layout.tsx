import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "180 Life Church | Bloomfield, CT",
  description:
    "A warm, welcoming community in Bloomfield, Connecticut. Join us for worship, connection, and life-changing experiences. Everyone is welcome.",
  keywords: [
    "church",
    "Bloomfield",
    "CT",
    "Connecticut",
    "worship",
    "community",
    "non-denominational",
  ],
  openGraph: {
    title: "180 Life Church | Bloomfield, CT",
    description:
      "A warm, welcoming community in Bloomfield, Connecticut. Everyone is welcome.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
