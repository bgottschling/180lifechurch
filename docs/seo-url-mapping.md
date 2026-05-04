# URL Mapping: Current Site → New Headless Site

When the new site goes live, the URL structure changes. To preserve search rankings and prevent broken external links, we need 301 redirects from every old URL to its new equivalent.

This document captures the mapping. Implementation will live in `next.config.ts` via the `redirects()` config.

## Top-Level Pages

| Current (WordPress) | New (Next.js) | Notes |
|---|---|---|
| `/` | `/` | No change |
| `/about/` | `/about` | Trailing slash dropped (Next.js convention) |
| `/baptism/` | `/baptism` | |
| `/contact/` | `/contact` | |
| `/give/` | `/give` | |
| `/leadership/` | `/leadership` | |
| `/membership/` | `/membership` | |
| `/partnership/` | `/partnership` | |
| `/serving/` | `/serving` | |
| `/stories/` | `/stories` | |
| `/new-here/` | `/new` | Slug rename |
| `/new-to-faith/` | `/new-to-faith` | |
| `/messages/` | `/sermons` | Renamed for clarity |
| `/west-hartford-church-ministries/` | `/ministries` | Big SEO improvement (cleaner URL) |

## Ministry Pages (significant URL restructure)

The current site has each ministry as a top-level post slug. The new site groups them under `/ministries/`. This is a cleaner taxonomy for users but requires explicit redirects from every old URL.

| Current | New |
|---|---|
| `/180-life-groups/` | `/ministries/life-groups` |
| `/childrens-kids-ministry/` | `/ministries/kids` |
| `/students/` | `/ministries/students` |
| `/young-adults/` | `/ministries/young-adults` |
| `/mens-ministry/` | `/ministries/mens` |
| `/womens-ministry/` | `/ministries/womens` |
| `/marriage-prep/` | `/ministries/marriage-prep` |
| `/care/` | `/ministries/care` |
| `/prayer/` | `/ministries/prayer` |
| `/deaf-ministry/` | `/ministries/deaf-ministry` |
| `/church-missions/` | `/ministries/missions` |

## Sermon Series

The current site puts series at root paths. The new site uses `/sermons/[slug]`.

| Current | New |
|---|---|
| `/at-the-movies/` | `/sermons/at-the-movies` |
| `/sabbath/` | `/sermons/sabbath` |
| `/say-yes/` | `/sermons/say-yes` |
| `/21daysofprayer/` | `/sermons/21-days-of-prayer` |
| `/asitisinheaven/` | `/sermons/as-it-is-in-heaven` |
| `/easter-events-2025-hartford-ct-church/` | `/sermons/easter-2025` (or similar) |
| `/easter-2023/` | `/sermons/easter-2023` |

Older series may also exist as posts at root that we should map. We will need to scan WordPress for any additional series URLs and add them to this map.

## Suggested next.config.ts redirects

```ts
async redirects() {
  return [
    // Page slug renames
    { source: "/new-here", destination: "/new", permanent: true },
    { source: "/messages", destination: "/sermons", permanent: true },
    { source: "/west-hartford-church-ministries", destination: "/ministries", permanent: true },

    // Ministry pages
    { source: "/180-life-groups", destination: "/ministries/life-groups", permanent: true },
    { source: "/childrens-kids-ministry", destination: "/ministries/kids", permanent: true },
    { source: "/students", destination: "/ministries/students", permanent: true },
    { source: "/young-adults", destination: "/ministries/young-adults", permanent: true },
    { source: "/mens-ministry", destination: "/ministries/mens", permanent: true },
    { source: "/womens-ministry", destination: "/ministries/womens", permanent: true },
    { source: "/marriage-prep", destination: "/ministries/marriage-prep", permanent: true },
    { source: "/care", destination: "/ministries/care", permanent: true },
    { source: "/prayer", destination: "/ministries/prayer", permanent: true },
    { source: "/deaf-ministry", destination: "/ministries/deaf-ministry", permanent: true },
    { source: "/church-missions", destination: "/ministries/missions", permanent: true },

    // Sermon series
    { source: "/at-the-movies", destination: "/sermons/at-the-movies", permanent: true },
    { source: "/sabbath", destination: "/sermons/sabbath", permanent: true },
    { source: "/say-yes", destination: "/sermons/say-yes", permanent: true },
    { source: "/21daysofprayer", destination: "/sermons/21-days-of-prayer", permanent: true },
    { source: "/asitisinheaven", destination: "/sermons/as-it-is-in-heaven", permanent: true },

    // Trailing slash → no trailing slash (Next.js handles automatically when trailingSlash: false)
  ];
}
```

`permanent: true` issues a 301 redirect, which Google honors for SEO equity transfer.

## Action Items

- [ ] Add `redirects()` to `next.config.ts` with the entries above
- [ ] Scan `post-sitemap.xml` for any additional sermon series we missed and add them
- [ ] After launch, monitor Google Search Console for 404 errors and add redirects for anything we missed
- [ ] Update internal links to use the new structure (already done since the new site was built fresh)
- [ ] Submit the new sitemap.xml to Google Search Console after DNS cutover

## SEO Equity Risk Assessment

| Risk | Mitigation |
|---|---|
| Lost backlinks pointing to old ministry URLs | 301 redirects (above) |
| Lost rankings on `/messages/` keyword (sermons) | 301 redirect + similar/better page content + internal linking |
| Search engines re-discovering everything | Submit new sitemap.xml + ping Google Search Console |
| Old URLs cached in browsers/aggregators | 301 redirects handle this; users get redirected silently |
| Loss of `/west-hartford-church-ministries/` keyword (locality + ministries) | Compensate with stronger location signals on /ministries (Hartford in title, breadcrumbs, schema) |
