# Dynamic Content Setup Guide

This document lists everything needed to make the 180lifechurch.org site pull live data from external services instead of using hardcoded fallback content.

---

## Current State

| Content Area | Source Today | Dynamic Source | Status |
|---|---|---|---|
| Latest Sermon (homepage banner) | YouTube scrape | YouTube | **Live** |
| Sermon Series (sermons page) | Hardcoded fallback | YouTube scrape API | **API built, not wired to page yet** |
| Events (homepage cards) | Hardcoded fallback | Planning Center Registrations | **API built, needs credentials** |
| Ministries (homepage cards) | Hardcoded fallback | WordPress CMS | **Needs WP setup** |
| Leadership / Staff | Hardcoded fallback | WordPress CMS | **Needs WP setup** |
| Page content (about, give, etc.) | Hardcoded fallback | WordPress CMS | **Needs WP setup** |

---

## 1. Planning Center (Events)

### What It Powers
- Homepage event cards (title, date, description, registration link)
- Future: events page, ministry-specific event filtering

### What We Need

| Item | Who Provides | Where to Find It |
|---|---|---|
| **Personal Access Token (PAT)** | Church admin with Planning Center access | See steps below |
| `PLANNING_CENTER_APP_ID` | Generated during PAT creation | Planning Center developer portal |
| `PLANNING_CENTER_SECRET` | Generated during PAT creation | Planning Center developer portal |

### How to Generate a PAT

1. Log in to [Planning Center](https://login.planningcenteronline.com)
2. Go to **api.planningcenteronline.com/oauth/applications**
3. Scroll to "Personal Access Tokens" section
4. Click "Create one now"
5. Give it a name like "180life-website"
6. Copy both the **Application ID** and the **Secret**
7. Send these securely (not via email) to the developer

### Required Planning Center Modules
The church's Planning Center subscription must include:
- **Registrations** (for events)

### Where to Add Credentials
Add to Vercel environment variables (Settings > Environment Variables):
```
PLANNING_CENTER_APP_ID=your_app_id_here
PLANNING_CENTER_SECRET=your_secret_here
```

### Cost
- **$0** -- Personal Access Tokens are free
- Planning Center subscription itself is a separate church expense (already active)

---

## 2. YouTube (Sermons)

### What It Powers
- Homepage "Latest Message" banner (already live)
- Sermons page series grid and individual sermon videos
- `/api/sermons` endpoint returning 20 most recent videos

### What We Need

| Item | Status | Notes |
|---|---|---|
| YouTube channel URL | **Already configured** | `@180lifechurch` |
| YouTube API Key (optional) | **Not needed** | We use HTML scraping + oEmbed (both free, no key required) |

### Current Architecture
- `/api/latest-sermon` scrapes the channel page HTML for the most recent video ID, then uses YouTube oEmbed for metadata
- `/api/sermons` extends this to return 20 recent videos
- Both are cached via ISR (1 hour) so YouTube is only hit once per hour per Vercel edge node

### Limitations
- YouTube channel page scraping could break if YouTube changes their HTML structure
- No way to auto-group videos into series (series grouping is manual in the fallback data)
- If the church creates YouTube playlists matching their series names, we could scrape those for automatic grouping

### Optional Enhancement: YouTube Data API v3
If the church wants more reliable sermon fetching:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or use existing)
3. Enable "YouTube Data API v3"
4. Create an API key (restrict to YouTube Data API)
5. Add to Vercel: `YOUTUBE_API_KEY=your_key_here`

**Cost:** Free tier includes 10,000 quota units/day. A channel videos list costs 1 unit. More than enough for hourly polling.

---

## 3. WordPress CMS (All Page Content)

### What It Powers
- All page content (about, give, leadership, ministries, etc.)
- Staff/elder bios and photos
- Ministry descriptions
- Homepage sections (hero, about blurb, CTA)

### What We Need

| Item | Who Provides | Notes |
|---|---|---|
| `WORDPRESS_URL` | Developer/hosting admin | The WP REST API base URL (e.g., `https://180lifechurch.org`) |
| `WORDPRESS_AUTH_TOKEN` | WP admin | Application password for authenticated REST API access |
| ACF Pro plugin | WP admin | Required for custom fields on pages/posts |
| Custom Post Types | Developer | Created via ACF or CPT UI plugin |

### WordPress Plugins Required
1. **Advanced Custom Fields (ACF) Pro** -- custom field groups for all content types
2. **ACF to REST API** -- exposes ACF fields in the WP REST API
3. **CPT UI** (optional) -- GUI for creating custom post types

### Custom Post Types to Create

| Post Type | Slug | Fields |
|---|---|---|
| Staff Member | `staff` | name, title, bio, photo, email, sort_order |
| Elder | `elder` | name, role, photo, sort_order |
| Ministry | `ministry` | title, description, image, icon_name, tag, slug, schedule, sort_order, sections (repeater) |
| Sermon Series | `sermon_series` | title, subtitle, description, image, sermons (repeater: title, date, youtube_id, speaker) |
| Event | `event` | title, date, time, description, featured, planning_center_link, image |

### ACF Field Groups to Create

See `docs/wordpress-setup-guide.md` for the complete list of 12 field groups with all field definitions.

### WordPress Application Password
1. Log in to WP Admin
2. Go to Users > Your Profile
3. Scroll to "Application Passwords"
4. Enter a name like "180life-nextjs"
5. Click "Add New Application Password"
6. Copy the generated password
7. Add to Vercel: `WORDPRESS_AUTH_TOKEN=your_password_here`

### Cost
- WordPress hosting: already paid by church
- ACF Pro: ~$49/year (one-time purchase for lifetime updates available)
- All other plugins: free

---

## 4. Contact Form -- Needs Church Account

### What It Powers
- Contact page form submissions

### Current Configuration
- Form ID: `xpqynyda` (hardcoded in `ContactForm.tsx`)
- **Currently using the developer's personal Formspree account -- NOT the church's**
- Submissions go to the developer's email, not the church office

### What We Need

| Item | Who Provides | Notes |
|---|---|---|
| Decision on form provider | Church admin + developer | See options below |
| Church email for submissions | Church admin | e.g., `info@180lifechurch.org` |
| New form ID | Whoever creates the account | Replace `xpqynyda` in `ContactForm.tsx` |

### Option A: Formspree (current setup, easiest migration)
1. Church admin creates a Formspree account at [formspree.io](https://formspree.io)
2. Create a new form pointing to `info@180lifechurch.org`
3. Copy the form ID
4. Developer replaces the form ID in `ContactForm.tsx`

**Cost:** Free tier = 50 submissions/month. Gold = $10/month for 1,000 submissions.

### Option B: FormSubmit.co (zero cost, unlimited)
1. No account needed -- works by sending to a verification email
2. Developer changes `ContactForm.tsx` to POST to `https://formsubmit.co/info@180lifechurch.org`
3. Church admin clicks a one-time verification link sent to that email

**Cost:** $0/year, unlimited submissions. No dashboard, but email notifications are instant.

### Option C: Planning Center People Forms (already in the ecosystem)
1. Church admin creates a form in Planning Center People
2. Embed the Church Center form URL or redirect to it from the contact page
3. Submissions land in Planning Center People, which the church already uses

**Cost:** $0 additional (included in Planning Center subscription).

### Recommendation
**Option B (FormSubmit.co)** for zero ongoing cost, or **Option C** if the church prefers keeping everything in Planning Center. Formspree (Option A) works but adds a recurring expense if volume grows past 50/month.

---

## 5. Church Center Embeds (Direct Links)

### What It Powers
- Event registration links (already wired)
- Life Groups finder link
- Serving team application link
- Giving page link
- Baptism registration link

### What We Need
- **Nothing** -- these are public URLs that don't require authentication
- All Church Center links use the pattern: `https://180life.churchcenter.com/...`

### Current Links Configured

| Destination | URL |
|---|---|
| Giving | `180life.churchcenter.com/giving` |
| Events | `180life.churchcenter.com/registrations/events/campus/13393` |
| Life Groups | `180life.churchcenter.com/groups/180-life-groups` |
| Serving | `180life.churchcenter.com/people/forms/405849` |
| Baptism | `180life.churchcenter.com/registrations/events/3506531` |
| Messages | `180life.churchcenter.com/channels/12038/series` |
| Child Dedication | `180life.churchcenter.com/people/forms/298308` |

### Maintenance
These URLs are stable as long as the church doesn't delete/recreate their Church Center configuration. If an event expires (e.g., Baptism date passes), the link still works but shows "registration closed."

---

## 6. Livestream

### What It Powers
- "Watch Live" button in navbar and hero

### What We Need
- **Nothing** -- already configured
- URL: `https://180life.online.church/`

---

## 7. WordPress Migration Plan: Editable Card Images

### What It Covers
Several pages use photo-backed cards with hardcoded images in the source code. Once WordPress is connected, editorial staff will be able to swap these images from the WP dashboard without developer involvement.

### Pages with Hardcoded Card Images

| Page | Cards | Current Image Source | WordPress Target |
|---|---|---|---|
| **Homepage** (Ministries section) | 6 ministry cards | `/public/images/ministries/*.jpg` | `ministry` custom post type `image` field |
| **About** (Next Steps section) | 4 cards: Meet Our Team, Partnership, Baptism, Stories | `/public/images/` (community, life-groups, worship, serving) | New ACF field group on the About page, or a `next_steps` repeater field |
| **Sermons** (series grid) | Series thumbnail cards | YouTube video thumbnails (auto-generated) | No change needed -- thumbnails come from YouTube automatically |

### How Staff Would Update Card Images (Once WordPress is Connected)

**Homepage Ministry Cards:**
1. Log in to WordPress Admin
2. Go to Ministries > (select a ministry, e.g., "Kids Ministry")
3. Upload a new image to the "Featured Image" or "Card Image" ACF field
4. Click Update
5. The website refreshes within 1 hour (ISR revalidation), or click "Revalidate" in the admin toolbar for immediate update

**About Page Next Steps Cards:**
1. Log in to WordPress Admin
2. Go to Pages > About
3. Scroll to the "Next Steps Cards" ACF repeater field
4. Each row has: Title, Description, Tag, Link, and **Image** (file upload)
5. Click the image field to open the media library, choose or upload a new photo
6. Click Update

### ACF Field Group Needed: "About Page - Next Steps"

| Field Name | Field Type | Notes |
|---|---|---|
| `next_steps` | Repeater | Min 1, max 6 rows |
| `next_steps > title` | Text | Card heading (e.g., "Meet Our Team") |
| `next_steps > tag` | Text | Badge label (e.g., "Leadership") |
| `next_steps > description` | Textarea | 1-2 sentence card description |
| `next_steps > link` | URL | Internal link (e.g., `/leadership`) |
| `next_steps > image` | Image (return URL) | Card background photo |
| `next_steps > icon` | Select | Dropdown: Users, Heart, BookOpen, HandHeart, etc. |

**Location rule:** Post Type = Page, AND Page = About

### Data Layer Integration

Once WordPress is set up, the developer will:
1. Add `fetchAboutNextSteps()` to `src/lib/data.ts`
2. This function fetches from `WORDPRESS_URL/wp-json/acf/v3/pages/{about_page_id}`
3. Falls back to the current hardcoded `nextSteps` array if WordPress is unavailable
4. The About page calls this function instead of using the local `const`

Same pattern already used for homepage ministries (`fetchMinistries()` → `WPMinistry[]` → fallback array).

### Image Recommendations for Staff
- **Minimum size:** 800x600px (cards display at various sizes depending on viewport)
- **Aspect ratio:** Landscape preferred (4:3 or 16:9) -- cards crop to fill
- **File format:** JPEG for photos, PNG only if transparency is needed
- **File size:** Under 500KB per image (Next.js optimizes automatically)
- **Content:** Photos should have visual interest but not too much detail in the center/bottom where text overlays appear. Darker or less busy images work best as card backgrounds.

---

## Summary: Action Items for Church Admin

### Priority 1 (Immediate)
- [ ] **Contact form**: Church admin decides on form provider and provides the receiving email (e.g., `info@180lifechurch.org`). Current form goes to developer's personal account.
- [ ] Generate a Planning Center Personal Access Token
- [ ] Send `PLANNING_CENTER_APP_ID` and `PLANNING_CENTER_SECRET` to developer securely

### Priority 2 (Makes all content editable by staff)
- [ ] Confirm WordPress admin access is available
- [ ] Install ACF Pro plugin ($49)
- [ ] Developer sets up custom post types and field groups
- [ ] Generate WordPress Application Password

### Priority 3 (Nice to have)
- [ ] Create YouTube playlists matching sermon series names (enables auto-grouping)
- [ ] Set up Google Cloud project for YouTube Data API (more reliable than scraping)

### Environment Variables Checklist

| Variable | Required For | Priority |
|---|---|---|
| `PLANNING_CENTER_APP_ID` | Live events | P1 |
| `PLANNING_CENTER_SECRET` | Live events | P1 |
| `WORDPRESS_URL` | CMS content | P2 |
| `WORDPRESS_AUTH_TOKEN` | CMS content | P2 |
| `YOUTUBE_API_KEY` | Reliable sermon data | P3 |
