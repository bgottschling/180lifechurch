import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { BfcacheReloader } from "@/components/BfcacheReloader";
import { fetchSiteSettings } from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

/**
 * Site-wide metadata pulled from WordPress Site Settings (SEO tab).
 * Individual pages may override via their own `generateMetadata` export.
 *
 * The `title` here is set as a `template` so child pages calling
 * `metadata: { title: "Sermons" }` get rendered as "Sermons | 180 Life Church"
 * automatically. The default title (sans template) is used on the homepage.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings();
  const seo = settings.seo;

  // OG image: prefer editor-uploaded, fall back to dynamic /api/og
  const ogImage = seo.defaultOgImage || "/api/og";

  // Twitter handle: include leading @ but strip if user already added one
  const twitter =
    seo.twitterHandle && !seo.twitterHandle.startsWith("@")
      ? `@${seo.twitterHandle}`
      : seo.twitterHandle;

  const keywords = seo.keywords
    ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  return {
    metadataBase: new URL(
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"
    ),
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.defaultDescription,
    keywords,
    icons: {
      icon: [
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      type: "website",
      locale: "en_US",
      siteName: "180 Life Church",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seo.defaultTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: [ogImage],
      ...(twitter ? { creator: twitter, site: twitter } : {}),
    },
  };
}

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
      <body className="min-h-screen flex flex-col">
        <BfcacheReloader />
        {children}
      </body>
    </html>
  );
}
