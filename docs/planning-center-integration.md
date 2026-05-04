# Planning Center Integration

Source of truth for **events** and **sermons** is now Planning Center, not WordPress.

## Why

Editors update Planning Center anyway (it's the system of record for both registrations and sermon publishing). Maintaining a parallel WordPress copy created two problems:

1. Stale events on the homepage (events that already happened weren't dropping off, new events took an hour to appear)
2. Broken sermon series page (no thumbnail carry-over from Church Center, manual data entry required for every new series)

By reading directly from Planning Center, editors only have to update content in one place and the public site picks it up within 24 hours (or sooner via manual revalidation).

## Architecture

```
Planning Center (source of truth)
        │
        │  Daily cron job pings /api/cron/refresh-content
        │  to bust cache tags and force fresh fetches
        ▼
src/lib/planning-center.ts
        │   - getEventsFromPC()           → /registrations/v2/events
        │   - getSermonSeriesFromPC()     → /publishing/v2/channels/12038/series
        │   ISR cache: 24 hours, tags: events / sermons / planning-center
        ▼
src/lib/data.ts
        │   - fetchEvents()             → calls PC, falls back to hardcoded
        │   - fetchAllSermonSeries()    → calls PC, falls back to hardcoded
        │   - fetchSermonSeriesBySlug() → calls PC, falls back to hardcoded
        ▼
Pages (homepage events, /sermons, /sermons/[slug])
```

## API Endpoints Used

### Events: Registrations API
```
GET /registrations/v2/events?filter=upcoming&order=starts_at&per_page=15
```

We additionally drop any event whose `ends_at` (or `starts_at`) is in the past, as defense in depth against ISR cache staleness.

Limited to the next 6 events.

### Sermon Series: Publishing API
```
GET /publishing/v2/channels/12038/series?order=-started_at&per_page=50
GET /publishing/v2/episodes?filter=published&order=-published_to_library_at&per_page=100
```

Two requests per cache cycle (one for series, one for all episodes), then we group episodes by `series_id` client-side. This is more efficient than per-series episode fetches and stays well within Planning Center's rate limits.

### Image priority
For each series:
1. PC series artwork (`art.attributes.variants.large`) — uploaded in Church Center
2. First episode's `library_video_thumbnail_url` (YouTube max-res via PC)
3. YouTube thumbnail derived from first sermon's video ID
4. Generic placeholder

Series art on Church Center → site card automatically.

## Caching Strategy

- **ISR**: 24 hours (`next.revalidate: 86400`) on every PC fetcher
- **Vercel Cron**: hits `/api/cron/refresh-content` daily at 5:00 UTC (12:00 AM ET) to bust the `events`, `sermons`, and `planning-center` cache tags
- **Manual revalidation**: anyone with the `CRON_SECRET` can hit the cron endpoint to force-refresh

The combination means events and sermons are guaranteed fresh within 24 hours of any change in Planning Center, often sooner if a visitor lands during the cache window.

## Required Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `PLANNING_CENTER_APP_ID` | Vercel + .env.local | PAT App ID (Basic Auth username) |
| `PLANNING_CENTER_SECRET` | Vercel + .env.local | PAT Secret (Basic Auth password) |
| `CRON_SECRET` | Vercel | Optional. Bearer token for /api/cron/refresh-content. Vercel sets this automatically when you configure crons via vercel.json. |

## Removing the WordPress Sermon Series CPT

The WP `sermon_series` custom post type is no longer used. To clean up:

1. Re-import `wordpress/acf-post-types.json` and `wordpress/acf-field-groups.json` (the CPT and its field group are no longer in either file)
2. After re-import, ACF will leave the existing `sermon_series` registration in WP because ACF doesn't auto-delete things it didn't create. To fully remove:
   - In wp-admin: ACF → Post Types → Sermon Series → Delete
   - In wp-admin: ACF → Field Groups → Sermon Series Fields → Delete
3. Existing `sermon_series` posts in the database can be safely deleted via the bulk action in **Sermon Series → All Series**
4. Update the 180 Life Sync plugin to v1.1.0 (also removes Sermon Series from the content hub landing page and tag mapping)

This cleanup is optional — the headless site reads from Planning Center exclusively, so leaving the WP entries doesn't break anything. They just become inert.

## Failure Modes & Fallbacks

If Planning Center is unreachable (outage, expired credentials, network blip):
1. The fetcher throws
2. `data.ts` catches and logs
3. The site renders hardcoded fallback data from `wordpress-fallbacks.ts` (events) and `subpage-fallbacks.ts` (sermons)
4. The site never crashes from a PC failure

Hardcoded fallbacks are intentionally kept up-to-date when major changes happen so even a multi-hour PC outage doesn't show wildly stale content.

## Monitoring

The 180 Life Sync plugin's health check (Site Health tab) does not currently include a Planning Center reachability check. Future enhancement: add a "Planning Center API: reachable / authenticated" check parallel to the existing WordPress checks.
