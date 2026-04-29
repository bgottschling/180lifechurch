# SEO Phase 2 Plan — Parity With Current Site

This document is the playbook for launching the new headless 180 Life Church site without losing the SEO presence the current WordPress + Divi + AIOSEO site has built up.

## Strategy Summary

The current site is well-optimized via **AIOSEO 4.9.5.1**:
- Every page has a unique, location-targeted title (e.g., "Men's ministry in Hartford, CT | 180 Life Church")
- Every page has a unique meta description
- Every page has a custom OG image
- Comprehensive Schema.org JSON-LD (Organization, WebPage, BreadcrumbList, Article, Person, ImageObject)
- Twitter Cards configured (`@180lifehartford`)
- AIOSEO-generated XML sitemap
- Google Site Verification configured

We must match or exceed all of this on the new site without AIOSEO Pro. Approach:

1. **Preserve URL equity via 301 redirects** (see `seo-url-mapping.md`)
2. **Apply audit data verbatim** to each new page's `generateMetadata`
3. **Add comprehensive JSON-LD** in the root layout and per-page where applicable
4. **Bridge AIOSEO Free into our REST API** so editors can continue customizing per-post SEO from WordPress
5. **Generate sitemap.xml and robots.txt** natively in Next.js

## Implementation Phases

### Phase 2a: Foundation (this PR)

| Task | Status | Notes |
|---|---|---|
| Audit current site SEO | ✅ Done | See `seo-audit-current-site.md` (30 URLs) |
| Document URL mapping | ✅ Done | See `seo-url-mapping.md` |
| `redirects()` in `next.config.ts` | Pending | All ministry + series + page slug redirects |
| `src/app/sitemap.ts` | Pending | Auto-generated from all routes including dynamic |
| `src/app/robots.ts` | Pending | Production allow-all + sitemap reference |
| Update Site Settings defaults | Pending | Twitter handle `@180lifehartford`, phone, address (audit findings differ from our seed) |
| Per-page `generateMetadata` for 10 core pages | Pending | About, Contact, Give, Leadership, Baptism, Membership, Partnership, Stories, New, New to Faith |
| Per-page `generateMetadata` for 11 ministry pages | Pending | Use audit titles + descriptions verbatim |
| Per-series `generateMetadata` for sermon series | Pending | Dynamic from WP + fallback patterns |
| Organization + LocalBusiness JSON-LD | Pending | In root layout, pulls from Site Settings |
| Page-type JSON-LD (Article, Person) | Pending | On ministries (Article), Leadership (Person) |
| BreadcrumbList JSON-LD | Pending | All non-homepage pages |
| Google Site Verification | Pending | Set in Site Settings → SEO tab → add field |

### Phase 2b: AIOSEO Free Bridge (this PR)

Add a class to the **180 Life Sync** plugin that exposes AIOSEO data via WordPress REST API:

- Read `wp_aioseo_posts` table (AIOSEO 4+ data location)
- Or read `_aioseo_*` postmeta as fallback
- Expose as a custom REST field (`aioseo`) on every post type the church edits
- Then the Next.js data layer reads `post.aioseo.title`, `post.aioseo.description`, etc. and uses those to override site defaults

This gives editors per-post SEO control without AIOSEO Pro, and they keep using the AIOSEO admin UI they're familiar with.

### Phase 2c: Polish & Hardening (final pre-launch)

- [ ] Image alt text audit (every CMS-managed image needs descriptive alt)
- [ ] Heading hierarchy review (one h1 per page, logical h2/h3 nesting)
- [ ] Open Graph debugger sweep (test every page in Facebook + Twitter previewer)
- [ ] Lighthouse audit (target 95+ on SEO, 90+ on performance)
- [ ] Submit new sitemap to Google Search Console after DNS cutover
- [ ] Verify Google Site Verification token carries over (or add a new one)

## Key Findings From Audit

These should be propagated to the new site:

### Twitter handle is `@180lifehartford` (not `@180lifechurch`)
Update FALLBACK_SETTINGS, Site Settings ACF default, and email signatures.

### Phone in current schema: `+18602319957` = (860) 231-9957
This differs from `(860) 243-3576` in our current Site Settings. Need to confirm with church which is correct. The schema pulls from AIOSEO's organization config, which is what Google reads.

### Location targeting: "West Hartford" / "Hartford" not "Bloomfield"
The church is physically in Bloomfield, CT, but their SEO targets the broader, more-searched "West Hartford" / "Hartford" area. We should preserve this strategy in our titles and meta. Use "Hartford" in titles, "Bloomfield" in addresses (for accuracy).

### Title patterns to preserve
- Ministry pages: "[Ministry Type] in Hartford, CT | 180 Life Church"
- Static pages: "[Topic] | 180 Life Church"
- Series: "[Series Name] | 180 Life Church" (or just the series name; current site varies)

### Schema patterns
- Every page: BreadcrumbList, Organization, WebPage, WebSite, ImageObject
- Ministry posts: Article, Person (likely the leader or pastor)
- Sermon series: probably need VideoObject for individual sermons

### Robots directive
All pages use `max-image-preview:large` to allow Google to show large image previews in results. We should match.

## Mismatches to Resolve

Items where current site says one thing and our codebase says another. Need church input:

1. **Twitter handle**: `@180lifehartford` vs `@180lifechurch` (our seed default)
2. **Phone number**: `(860) 231-9957` (current schema) vs `(860) 243-3576` (our setup)
3. **Mission**: "Jesus Changes Everything" (current schema description) vs "We exist to make and send disciples..." (our setting)

I lean toward "match the current site exactly so SEO continuity is preserved, then update both in tandem if the church wants to change things."

## Outcome

After Phase 2a + 2b complete, the new site will:
- Render the same titles, descriptions, and OG images Google has indexed
- Maintain or improve schema markup
- Redirect every old URL to its new equivalent (preserving backlinks)
- Allow editors to continue managing per-page SEO from AIOSEO
- Load 3-5x faster than the current Divi site (Core Web Vitals win)

That last point is where we exceed the current site. Same SEO content, better performance = better rankings over time.
