/**
 * JSON-LD structured data component.
 *
 * Renders schema.org metadata in a `<script type="application/ld+json">`
 * tag. Use the helper functions below to construct each schema type
 * the site emits.
 *
 * Why this matters: structured data lets Google show rich result
 * cards (knowledge panels, opening hours, breadcrumb trails, video
 * thumbnails, etc.) instead of generic blue links. The current
 * 180lifechurch.org WordPress site uses AIOSEO to emit Organization,
 * WebPage, WebSite, BreadcrumbList, ImageObject, and Article schemas
 * on every page. This component lets us match that.
 */
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML is the standard React pattern for
      // server-rendered <script> content. JSON.stringify produces
      // safe output here because the input is structured data we
      // construct ourselves, not arbitrary user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Schema constructors
// ---------------------------------------------------------------------------

const SITE_URL = "https://180lifechurch.org";

/**
 * Organization + LocalBusiness schema for the church.
 *
 * Emitted in the root layout so every page includes it. Powers
 * Google's knowledge panel, map listings, opening hours, and
 * sameAs social profile linking.
 */
export interface OrganizationSchemaInput {
  name: string;
  description: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    vimeo?: string;
  };
  logoUrl?: string;
}

export function buildOrganizationSchema(input: OrganizationSchemaInput) {
  const sameAs = [
    input.social.facebook,
    input.social.instagram,
    input.social.youtube,
    input.social.twitter,
    input.social.vimeo,
  ].filter(Boolean);

  // Parse "Bloomfield, CT 06002" into components
  const addrParts = input.addressLine2.split(",").map((s) => s.trim());
  const locality = addrParts[0] || "Bloomfield";
  const regionAndZip = (addrParts[1] || "CT 06002").split(/\s+/);
  const region = regionAndZip[0] || "CT";
  const postalCode = regionAndZip[1] || "06002";

  // Phone normalization: strip non-digits and prepend +1
  const phoneDigits = input.phone.replace(/\D/g, "");
  const phoneE164 = phoneDigits.startsWith("1")
    ? `+${phoneDigits}`
    : `+1${phoneDigits}`;

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Church"],
    "@id": `${SITE_URL}/#organization`,
    name: input.name,
    description: input.description,
    url: SITE_URL,
    telephone: phoneE164,
    email: input.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: input.addressLine1,
      addressLocality: locality,
      addressRegion: region,
      postalCode,
      addressCountry: "US",
    },
    ...(input.logoUrl
      ? {
          logo: {
            "@type": "ImageObject",
            url: input.logoUrl,
            "@id": `${SITE_URL}/#organizationLogo`,
          },
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/**
 * WebSite schema with site name and search action. Used in
 * conjunction with Organization at the site root.
 */
export function buildWebsiteSchema(input: {
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: input.name,
    description: input.description,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * BreadcrumbList schema. Pass an array of `{ name, url }` items
 * in the order they appear in the breadcrumb trail. Used on
 * every non-homepage route.
 */
export function buildBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * WebPage schema for a specific page. Combines with the
 * Organization + WebSite schemas into a single @graph.
 */
export function buildWebPageSchema(input: {
  url: string;
  name: string;
  description: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...(input.imageUrl
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: input.imageUrl,
          },
        }
      : {}),
  };
}

/**
 * Article schema for ministry pages, content pages, and similar
 * editorial content. Mirrors the pattern used by AIOSEO on the
 * current site.
 */
export function buildArticleSchema(input: {
  url: string;
  headline: string;
  description: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: input.url,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
}

/**
 * VideoObject schema for individual sermon videos. Helps Google
 * surface video content in search results and Discovery.
 */
export function buildVideoSchema(input: {
  name: string;
  description: string;
  uploadDate: string;
  thumbnailUrl: string;
  embedUrl: string;
  contentUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.name,
    description: input.description,
    uploadDate: input.uploadDate,
    thumbnailUrl: input.thumbnailUrl,
    embedUrl: input.embedUrl,
    ...(input.contentUrl ? { contentUrl: input.contentUrl } : {}),
  };
}
