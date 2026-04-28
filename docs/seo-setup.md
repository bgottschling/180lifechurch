# SEO Setup for 180 Life Church

This site uses a layered SEO approach:

1. **Site-wide defaults** — managed in WordPress under Site Settings → SEO tab. Apply to every page unless overridden.
2. **Per-page titles** — derived from the page's WordPress post title or set explicitly in code via `metadata` exports.
3. **Per-post overrides via All in One SEO (Phase 2)** — optional, requires AIOSEO Pro for full headless support.

---

## Phase 1: Site-Wide Defaults (Active)

All defaults live in **wp-admin → 180 Life → Site Settings → SEO tab**:

| Field | What it controls |
|---|---|
| Title Template | Pattern for non-homepage titles (e.g., `%s | 180 Life Church`) |
| Default Title | Homepage title and fallback for any untitled page |
| Default Description | Meta description and Open Graph description |
| Default Social Sharing Image | 1200x630 image used on Facebook, LinkedIn, iMessage, Slack |
| Twitter Handle | Used in Twitter Card meta tags |
| Default Keywords | Comma-separated, used on the homepage |

The `<head>` of every page is generated dynamically from these values via `generateMetadata` in `src/app/layout.tsx`. Changes to Site Settings propagate within seconds via the same revalidation webhook used for all other content.

### Page-specific titles

Pages can set their own title with a `metadata` export:

```typescript
// src/app/about/page.tsx
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About",
  // becomes "About | 180 Life Church" via the template
};
```

Or for dynamic titles (sermon series, ministries, etc.), use `generateMetadata`:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const series = await fetchSermonSeries(params.slug);
  return {
    title: series.title,
    description: series.subtitle,
    openGraph: { images: [series.image] },
  };
}
```

### Dynamic OG image fallback

If the **Default Social Sharing Image** field is empty in Site Settings, the site falls back to `/api/og` — a route that generates a branded OG image dynamically using the church logo and tagline. This means social sharing always has a presentable image, even before an editor uploads a custom one.

---

## Phase 2: All in One SEO Integration (Future)

The church has AIOSEO installed. Currently the integration is **passive** — AIOSEO handles its own admin UI for editors but does not yet override the defaults on the headless site.

To activate per-post AIOSEO overrides:

### Option A: AIOSEO Pro

Pro version exposes a REST endpoint at `/wp-json/aioseo/v1/posts/{id}` with full meta:
- Custom titles
- Custom descriptions
- Custom OG images
- Schema.org JSON-LD output
- Robots directives
- Canonical URLs

Once AIOSEO Pro is active:

1. Add a fetcher to `src/lib/wordpress.ts`: `getAioseoMeta(postId, postType)`
2. Each page's `generateMetadata` calls this and merges over the site defaults
3. Falls back gracefully when AIOSEO isn't configured

Cost: ~$99/year. Worth it if editors want full per-page SEO control.

### Option B: Stay with current ACF defaults

For most church sites, site-wide defaults + page titles are enough. The Phase 1 setup gives clean OG cards on social, accurate Twitter previews, indexable content, and dynamic titles via the template. AIOSEO Pro adds polish but isn't required for good SEO.

### Option C: Add ACF SEO fields per CPT (manual override path)

If AIOSEO Pro isn't an option but per-page overrides are wanted, we can add a small ACF field group attached to each managed CPT:

- `seo_title` — overrides the page title
- `seo_description` — overrides the meta description
- `seo_og_image` — overrides the social sharing image

Then update `generateMetadata` for each page type to read these. Less editor-friendly than AIOSEO but free and fully under our control.

---

## Sitemap

Currently absent. Phase 2 should add a `/sitemap.xml` route. Next.js App Router supports this natively via `src/app/sitemap.ts`. AIOSEO Pro generates a sitemap inside WordPress at `/sitemap.xml` — but since the headless site is on Vercel, that WP sitemap is irrelevant. We need our own.

When ready:
1. Create `src/app/sitemap.ts` with all known routes (homepage, ministries, sermons, content pages, sermon series detail pages)
2. Submit `https://180lifechurch.org/sitemap.xml` in Google Search Console

---

## Robots / Indexing Control

Currently no `robots.txt`. To control:
1. Create `src/app/robots.ts` with allow/disallow rules
2. By default Next.js generates `User-agent: *\nAllow: /\nSitemap: <url>`

For the preview deployment, robots are blocked via the password gate (Vercel deployment protection prevents indexing). Production should explicitly allow indexing.

---

## Common SEO Tasks

### Update homepage title
1. wp-admin → 180 Life → Site Settings → SEO tab → **Default Title**
2. Save → propagates within seconds

### Change sharing image for the whole site
1. wp-admin → 180 Life → Site Settings → SEO tab → **Default Social Sharing Image** → upload
2. Save → within an hour, sharing previews will pick up the new image

Note: Facebook, LinkedIn, etc. cache OG previews aggressively. To force a refresh, use the Facebook Sharing Debugger and "Scrape Again."

### Override title/description for a specific page
- For static pages built into the site (homepage, /sermons, /about, etc.): edit the `metadata` export in the page's `.tsx` file (developer task)
- For WordPress-managed pages (Phase 2): use AIOSEO's per-post settings in wp-admin
