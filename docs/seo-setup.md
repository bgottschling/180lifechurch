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

## Phase 2b: Per-Post SEO via ACF (Implemented)

After deliberation, the church chose **Option B from `docs/seo-phase-2-plan.md`**: add per-post SEO overrides via ACF field groups directly on our existing custom post types, rather than depending on AIOSEO's data structure.

### Why this approach

The headless site stays decoupled from any specific SEO plugin. AIOSEO can remain installed (it provides value for the WordPress admin side and the legacy WP sitemap), but our public Next.js site does not depend on it. If the church ever switches plugins or even moves off WordPress, the SEO data lives in our own ACF schema.

### How editors use it

Each of our managed custom post types now has an "SEO Override" tab in the editor:

- **Sermon Series** — fully wired up; per-series SEO flows through `generateMetadata` on `/sermons/[slug]`
- **Ministry / Staff / Elder** — fields exist for future use when those CPTs gain dedicated landing pages

Fields per CPT:

| Field | Purpose |
|---|---|
| SEO Title | Browser tab + search-result title for this page |
| Meta Description | Search-result snippet (140-160 characters ideal) |
| Social Sharing Image | 1200x630 image for Facebook, LinkedIn, iMessage previews |
| Hide from Search Engines | Adds a noindex tag (use sparingly) |

Any blank field inherits the route default; any unset route default inherits site-wide defaults from Site Settings → SEO tab.

### Resolution chain

```
Per-post SEO (ACF on the CPT entry)
        ↓ if blank
Per-route default (src/lib/seo-defaults.ts)
        ↓ if blank
Site-wide default (Site Settings → SEO tab → ACF)
        ↓ if blank
Hardcoded fallback (FALLBACK_SETTINGS in code)
```

The `buildMergedMetadata()` helper in `src/lib/seo-defaults.ts` walks this chain and produces a Next.js Metadata object.

### Roadmap: Option C (custom SEO admin in 180 Life Sync plugin)

ACF SEO fields work but lack the polish of a purpose-built SEO admin. A future enhancement to the **180 Life Sync** plugin would add a dedicated meta box on each post edit screen with:

- Live SERP preview (what the result looks like in Google)
- OG and Twitter card preview
- Title and description character counters with green/yellow/red bands
- Keyword phrase analysis
- Schema.org type selector
- Robots directive toggles (noindex, nofollow, noarchive, etc.)

This is roughly 2-3 days of focused PHP/JS work and would give editors an experience on par with AIOSEO Pro without the dependency. Tracked as Phase 2c in `docs/seo-phase-2-plan.md`.

For now, the ACF tab is functional and consistent with how editors already manage content in our CMS.

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
