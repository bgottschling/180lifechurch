# API Reference

180 Life Church Next.js site exposes 6 API routes. All routes are under `/api/`.

---

## GET `/api/latest-sermon`

Returns metadata for the most recent sermon video from the church's YouTube channel.

**Auth:** None
**Env vars:** None
**Caching:** ISR 1 hour, `stale-while-revalidate` 2 hours

### How it works

1. Scrapes `https://www.youtube.com/@180lifechurch/videos` for the first `videoId`
2. Calls YouTube oEmbed (free, no API key) to get title and thumbnail
3. Returns structured sermon data

### Response

```json
{
  "videoId": "coQieDuSL3o",
  "title": "Consequences - Sermon 3/29/2026",
  "thumbnail": "https://i.ytimg.com/vi/coQieDuSL3o/hqdefault.jpg",
  "channelName": "180 Life Church",
  "channelUrl": "https://www.youtube.com/@180lifechurch"
}
```

### Fallback (on error)

Returns `videoId: null` with generic metadata. The `SermonBanner` component hides itself when `videoId` is null.

### Used by

- `SermonBanner` component (homepage)

---

## GET `/api/sermons`

Returns up to 20 recent sermon videos scraped from the YouTube channel.

**Auth:** None
**Env vars:** None
**Caching:** ISR 1 hour, `stale-while-revalidate` 2 hours

### How it works

1. Scrapes the YouTube channel page HTML
2. Extracts all `videoId` + `title` pairs via regex on the embedded JSON
3. Deduplicates by `videoId`
4. Filters out non-sermon content (full service recordings, "Church at Home" streams)
5. Returns up to 20 videos sorted by recency

### Response

```json
{
  "videos": [
    {
      "videoId": "coQieDuSL3o",
      "title": "Consequences - Sermon 3/29/2026",
      "thumbnail": "https://i.ytimg.com/vi/coQieDuSL3o/hqdefault.jpg"
    }
  ],
  "count": 20
}
```

### Fallback (on error)

Returns `{ "videos": [], "count": 0, "error": "..." }`. The data layer in `data.ts` falls through to hardcoded sermon series from `subpage-fallbacks.ts`.

### Used by

- Available for future dynamic sermon page population
- Currently sermon pages use fallback data from `subpage-fallbacks.ts`

---

## GET `/api/events`

Fetches upcoming events from Planning Center Registrations API.

**Auth:** HTTP Basic (Planning Center PAT)
**Env vars:**
- `PLANNING_CENTER_APP_ID` -- Personal Access Token application ID
- `PLANNING_CENTER_SECRET` -- Personal Access Token secret

**Caching:** ISR 1 hour, `stale-while-revalidate` 2 hours

### How it works

1. Checks for `PLANNING_CENTER_APP_ID` and `PLANNING_CENTER_SECRET` env vars
2. If missing, returns empty array with message (data layer uses hardcoded fallbacks)
3. If present, calls `GET https://api.planningcenter.com/registrations/v2/events?filter=upcoming&order=starts_at`
4. Maps Planning Center JSON:API response to the app's `WPEvent` shape
5. Generates Church Center registration links from event IDs

### Response (with credentials)

```json
{
  "events": [
    {
      "id": "3506531",
      "title": "Baptism",
      "date": "April 4",
      "time": "",
      "description": "...",
      "featured": false,
      "planningCenterLink": "https://180life.churchcenter.com/registrations/events/3506531"
    }
  ],
  "count": 8
}
```

### Response (without credentials)

```json
{
  "events": [],
  "count": 0,
  "message": "Planning Center credentials not configured. Using fallback data."
}
```

### How to activate

See `docs/dynamic-content-setup.md` for instructions on generating a Planning Center PAT and adding it to Vercel.

### Used by

- `data.ts` -> `fetchEvents()` (will try this API, then fall back to `FALLBACK_EVENTS`)
- `Events` component (homepage)

---

## POST `/api/revalidate`

Webhook endpoint for on-demand ISR revalidation. Called by WordPress when content changes.

**Auth:** Secret header
**Env vars:**
- `WORDPRESS_REVALIDATION_SECRET` -- shared secret between WordPress and Vercel

**Caching:** None (webhook)

### How it works

1. Reads `x-revalidation-secret` header from the incoming request
2. Compares against `WORDPRESS_REVALIDATION_SECRET` env var
3. If matched, calls `revalidateTag("wordpress")` and `revalidateTag("default")` to bust the ISR cache
4. All pages fetching WordPress data will re-render on next request

### Request

```
POST /api/revalidate
x-revalidation-secret: your-secret-here
```

### Response

```json
{ "revalidated": true, "now": 1711900800000 }
```

### Error responses

| Status | Body | Cause |
|--------|------|-------|
| 500 | `{ "error": "Revalidation secret not configured" }` | Missing env var |
| 401 | `{ "error": "Invalid secret" }` | Header doesn't match |

### How to activate

1. Add `WORDPRESS_REVALIDATION_SECRET` to Vercel env vars
2. In WordPress, install a webhook plugin (e.g., WP Webhooks)
3. Configure it to POST to `https://yourdomain.com/api/revalidate` with the secret header on post publish/update

---

## POST `/api/auth`

Validates a preview password for the site's gated preview mode.

**Auth:** Password-based
**Env vars:**
- `PREVIEW_PASSWORD_HASH` -- format: `salt:scryptHash` (hex-encoded)

**Caching:** None

### How it works

1. Reads `password` from the request body
2. Extracts salt and stored hash from `PREVIEW_PASSWORD_HASH` env var
3. Runs scrypt on the provided password with the stored salt
4. Compares the result to the stored hash
5. On match, sets an HTTP-only cookie (`preview_auth`) with 30-day expiration

### Request

```json
{ "password": "your-preview-password" }
```

### Response (success)

```json
{ "success": true }
```

Sets cookie: `preview_auth=1; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`

### Error responses

| Status | Body | Cause |
|--------|------|-------|
| 500 | `{ "error": "Not configured" }` | Missing `PREVIEW_PASSWORD_HASH` |
| 401 | `{ "error": "Invalid password" }` | Password doesn't match |

### Generating a password hash

```bash
node -e "
const crypto = require('crypto');
const password = 'your-password';
const salt = crypto.randomBytes(16).toString('hex');
crypto.scrypt(password, salt, 64, (err, key) => {
  console.log(salt + ':' + key.toString('hex'));
});
"
```

---

## GET `/api/og`

Generates a dynamic Open Graph image for social sharing.

**Auth:** None
**Env vars:** None
**Caching:** Default Next.js `ImageResponse` caching

### How it works

1. Uses `next/og` `ImageResponse` to render a 1200x630 PNG
2. Reads the church logo from `public/images/logo-white.png` (base64-encoded at build)
3. Renders a dark gradient background with amber accents (#D4A054)
4. Displays: logo, tagline ("No Perfect People Allowed"), heading ("Jesus Changes Everything"), and service times

### Response

`Content-Type: image/png` -- 1200x630 pixel image

### Used by

- `<meta property="og:image">` in the root layout metadata
- Social media platforms (Facebook, Twitter/X, iMessage, Slack, etc.)

---

## Environment Variables Summary

| Variable | Required by | Purpose |
|----------|------------|---------|
| `PLANNING_CENTER_APP_ID` | `/api/events` | Planning Center PAT app ID |
| `PLANNING_CENTER_SECRET` | `/api/events` | Planning Center PAT secret |
| `WORDPRESS_REVALIDATION_SECRET` | `/api/revalidate` | Webhook auth for ISR cache busting |
| `PREVIEW_PASSWORD_HASH` | `/api/auth` | Scrypt hash for preview password gate |
| `PREVIEW_PASSWORD_ENABLED` | Middleware | Toggles preview gate on/off |

Routes without env vars (`/api/latest-sermon`, `/api/sermons`, `/api/og`) work out of the box with zero configuration.

---

## Data Flow

```
Homepage:
  Events     -> data.ts -> /api/events (Planning Center) -> FALLBACK_EVENTS
  Ministries -> data.ts -> WordPress -> FALLBACK_MINISTRIES
  Sermon     -> /api/latest-sermon (YouTube scrape) -> null fallback

Sermons page:
  Series     -> data.ts -> WordPress -> SERMON_SERIES (subpage-fallbacks.ts)
  Videos     -> /api/sermons (YouTube scrape) -> available for future use

All pages:
  Footer/Nav -> data.ts -> WordPress -> FALLBACK_SETTINGS
```
