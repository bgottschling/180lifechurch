import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { BfcacheReloader } from "@/components/BfcacheReloader";
import { fetchSiteSettings, fetchPublicConfig } from "@/lib/data";
import {
  JsonLd,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "@/components/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const SITE_URL = "https://180lifechurch.org";

/**
 * Site-wide metadata pulled from WordPress Site Settings (SEO tab).
 * Individual pages override via their own `generateMetadata` export.
 */
export async function generateMetadata(): Promise<Metadata> {
  // Fetch site settings + plugin-managed config in parallel. Plugin
  // config holds the Search Console verification token (editor-managed
  // on the Analytics tab in wp-admin), so it needs to be available
  // before we build the verification metadata block.
  const [settings, publicConfig] = await Promise.all([
    fetchSiteSettings(),
    fetchPublicConfig(),
  ]);
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

  // Use the production URL in metadataBase whenever we're on Vercel,
  // so Open Graph image URLs resolve correctly. Falls back to
  // Vercel's preview URL only if production isn't configured yet.
  const productionUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL;
  const metadataBase = new URL(productionUrl);

  return {
    metadataBase,
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
      url: SITE_URL,
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
    // max-image-preview:large matches the current AIOSEO-emitted directive
    // and lets Google show large image thumbnails in search results.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    // Google Search Console verification — plugin-managed on the
    // Analytics tab in wp-admin (Settings → 180 Life Sync → Analytics).
    // Editors can change it without a deploy. GOOGLE_SITE_VERIFICATION
    // env var is honored as a fallback so existing infra keeps working
    // if the plugin endpoint is ever unreachable.
    ...(() => {
      const googleVerification =
        publicConfig.searchConsole.verification ||
        process.env.GOOGLE_SITE_VERIFICATION ||
        "";
      return googleVerification
        ? { verification: { google: googleVerification } }
        : {};
    })(),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch site settings + analytics/SC config to populate the
  // Organization schema and inject the GA4 tag. Both fetches are
  // deduped against the same calls in generateMetadata via React's
  // request memoization, so they're effectively free here.
  const [settings, publicConfig] = await Promise.all([
    fetchSiteSettings(),
    fetchPublicConfig(),
  ]);

  const gaId = publicConfig.analytics.enabled
    ? publicConfig.analytics.measurementId
    : "";

  const organizationSchema = buildOrganizationSchema({
    name: "180 Life Church",
    description: settings.churchTagline,
    phone: settings.contact.phone,
    email: settings.contact.email,
    addressLine1: settings.contact.addressLine1,
    addressLine2: settings.contact.addressLine2,
    social: {
      facebook: settings.social.facebook,
      instagram: settings.social.instagram,
      youtube: settings.social.youtube,
      twitter: settings.seo.twitterHandle
        ? `https://twitter.com/${settings.seo.twitterHandle.replace("@", "")}`
        : undefined,
      vimeo: settings.social.vimeo,
    },
    logoUrl: `${SITE_URL}/icon-512.png`,
  });

  const websiteSchema = buildWebsiteSchema({
    name: "180 Life Church",
    description: settings.churchTagline,
  });

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <BfcacheReloader />
        <JsonLd data={[organizationSchema, websiteSchema]} />
        {/*
          Google Analytics 4 — plugin-managed measurement ID, loaded with
          strategy="afterInteractive" so it doesn't block the page paint.
          The plugin returns an empty ID when tracking is disabled, which
          renders nothing here. Two scripts: the loader (gtag.js) and the
          config call. Order matters — gtag must be defined before
          gtag('config', ...) runs.
        */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: true });`}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
