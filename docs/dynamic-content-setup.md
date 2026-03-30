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

## 4. Formspree (Contact Form) -- Currently Active

### What It Powers
- Contact page form submissions

### Current Configuration
- Form ID: `xpqynyda` (hardcoded in `ContactForm.tsx`)
- Submissions go to the email configured in the Formspree dashboard

### What We Need (if changing)

| Item | Who Provides | Notes |
|---|---|---|
| Formspree account email | Church admin | Who receives form submissions |
| Formspree form ID | Developer | Already configured |

### Cost
- Free tier: 50 submissions/month
- Gold plan: $10/month (1,000 submissions)
- If volume exceeds free tier, consider switching to FormSubmit.co ($0/year, unlimited)

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

## Summary: Action Items for Church Admin

### Priority 1 (Makes events dynamic immediately)
- [ ] Generate a Planning Center Personal Access Token
- [ ] Send `PLANNING_CENTER_APP_ID` and `PLANNING_CENTER_SECRET` to developer securely

### Priority 2 (Makes all content editable by staff)
- [ ] Confirm WordPress admin access is available
- [ ] Install ACF Pro plugin ($49)
- [ ] Developer sets up custom post types and field groups
- [ ] Generate WordPress Application Password

### Priority 3 (Nice to have)
- [ ] Create YouTube playlists matching sermon series names (enables auto-grouping)
- [ ] Consider upgrading Formspree if form volume exceeds 50/month
- [ ] Set up Google Cloud project for YouTube Data API (more reliable than scraping)

### Environment Variables Checklist

| Variable | Required For | Priority |
|---|---|---|
| `PLANNING_CENTER_APP_ID` | Live events | P1 |
| `PLANNING_CENTER_SECRET` | Live events | P1 |
| `WORDPRESS_URL` | CMS content | P2 |
| `WORDPRESS_AUTH_TOKEN` | CMS content | P2 |
| `YOUTUBE_API_KEY` | Reliable sermon data | P3 |
