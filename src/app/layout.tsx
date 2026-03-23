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
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
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
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "180 Life Church | Bloomfield, CT",
    description:
      "A warm, welcoming community in Bloomfield, Connecticut. Everyone is welcome.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "180 Life Church",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "180 Life Church | Bloomfield, CT",
    description:
      "A warm, welcoming community in Bloomfield, Connecticut. Everyone is welcome.",
    images: ["/api/og"],
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
