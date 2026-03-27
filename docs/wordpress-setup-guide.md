# WordPress Headless CMS Setup Guide

> This document describes everything needed to connect the 180 Life Church Next.js
> site to WordPress as a headless CMS. Until WordPress is configured, the site
> renders using hardcoded fallback content with zero visual difference.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Environment Variables](#environment-variables)
3. [Required WordPress Plugins](#required-wordpress-plugins)
4. [Custom Post Types](#custom-post-types)
5. [ACF Field Groups](#acf-field-groups)
6. [Webhook Configuration](#webhook-configuration)
7. [Vercel Deployment Settings](#vercel-deployment-settings)
8. [Testing the Integration](#testing-the-integration)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
WordPress (CMS)          Next.js (Vercel)           User
+-----------------+      +--------------------+
| WP REST API     | ---> | data.ts            | ---> Browser
| /wp-json/wp/v2/ |      |   fetchEvents()    |
| /wp-json/acf/v3/|      |   fetchLeadership()|
+-----------------+      |   fetchMinistry()  |
        |                |   ...              |
        |                +--------------------+
        |                         |
        |  on publish:            | on miss:
        |  POST /api/revalidate   | use fallback
        +-------------------------+ content
```

**Data flow:**

1. Every page calls a `fetchX()` function from `src/lib/data.ts`
2. `data.ts` calls the corresponding WP fetch function from `src/lib/wordpress.ts`
3. If `WORDPRESS_URL` is not set or the fetch fails, fallback data is returned
4. ISR caches responses for 1 hour; on-demand revalidation clears the cache instantly
5. Fallback content lives in `src/lib/wordpress-fallbacks.ts` (homepage) and `src/lib/subpage-fallbacks.ts` (subpages)

---

## Environment Variables

Set these in Vercel project settings (Settings > Environment Variables) and in `.env.local` for local dev:

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `WORDPRESS_URL` | Yes | `https://180lifechurch.org` | Base URL of the WordPress site (no trailing slash) |
| `WORDPRESS_REVALIDATION_SECRET` | Yes | `a-long-random-string-here` | Shared secret for the webhook. Generate with `openssl rand -hex 32` |

**Without these variables set, the site operates entirely on fallback content.**

---

## Required WordPress Plugins

| Plugin | Purpose | Free/Pro |
|--------|---------|----------|
| **Advanced Custom Fields (ACF)** | Custom field groups for all content | Free works; Pro recommended for repeaters and options pages |
| **ACF to REST API** | Exposes ACF fields via `/wp-json/acf/v3/` | Free (only needed if using ACF Pro options page for site settings) |
| **Custom Post Type UI (CPT UI)** | Register custom post types without code | Free |
| **WP Webhooks** (or custom `save_post` hook) | Fires a POST to Vercel on content publish | Free tier available |

### Alternative to plugins

All CPTs and ACF field groups can be registered via code in a custom theme's `functions.php` or a site-specific plugin. See the [CPT and ACF Field Reference](#custom-post-types) below for exact slugs and field names.

---

## Custom Post Types

Register each CPT with `show_in_rest = true` so the REST API exposes them.

| CPT Slug | Label | REST Base | Description |
|----------|-------|-----------|-------------|
| `event` | Events | `event` | Church events (Easter, retreats, etc.) |
| `ministry` | Ministries | `ministry` | Homepage ministry cards (6 featured) |
| `service` | Services | `service` | Sunday service times |
| `staff` | Staff | `staff` | Pastors and team members |
| `elder` | Elders | `elder` | Elder board members |
| `ministry-page` | Ministry Pages | `ministry-page` | Detailed content for each ministry subpage (12 total) |
| `content-page` | Content Pages | `content-page` | Static pages: about, partnership, baptism, stories, new-to-faith |
| `sermon-series` | Sermon Series | `sermon-series` | Sermon series with embedded YouTube videos |
| `site-settings` | Site Settings | `site-settings` | Singleton post for hero, about, contact, social, CTA (use ACF Pro options page if available) |

### CPT UI Settings (for each)

```
Show in REST:        true
REST Base:           (same as slug above)
Supports:            title, custom-fields
Has Archive:         false
Public:              true
Hierarchical:        false
```

### Ministry Page Slugs

Each `ministry-page` post must have its WordPress slug match exactly:

```
life-groups, students, young-adults, kids, mens, womens,
missions, deaf-ministry, care, prayer, serving, marriage-prep
```

### Content Page Slugs

Each `content-page` post must have its WordPress slug match exactly:

```
about, partnership, baptism, stories, new-to-faith
```

---

## ACF Field Groups

### Site Settings

> Attach to: Post Type = `site-settings` (or ACF Pro Options Page named "Site Settings")

**Hero Section**

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `hero_tagline` | Text | e.g. "No Perfect People Allowed" |
| `hero_heading_prefix` | Text | e.g. "Jesus Changes" |
| `hero_rotating_words` | Repeater | Subfield: `word` (Text). Each row is one rotating word |
| `hero_description` | Textarea | Paragraph below the heading |
| `hero_image` | Image | Return format: URL or Image Object. Hero background photo |
| `hero_cta_primary_text` | Text | e.g. "Plan Your Visit" |
| `hero_cta_primary_link` | Text (URL) | e.g. "/new" |
| `hero_cta_secondary_text` | Text | e.g. "Watch Online" |
| `hero_cta_secondary_link` | Text (URL) | e.g. "https://180life.online.church/" |

**About Section**

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `about_label` | Text | e.g. "Gather, Grow & Go" |
| `about_heading` | Text | e.g. "A Place Where" |
| `about_heading_accent` | Text | e.g. "You Belong" (rendered in amber) |
| `about_body` | WYSIWYG | Split into paragraphs automatically by `<p>` tags |
| `about_image` | Image | Community/church photo |
| `about_link_text` | Text | e.g. "Learn More About Us" |
| `about_link_url` | Text (URL) | e.g. "/about" |

**Contact Info**

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `contact_address_line1` | Text | e.g. "180 Still Road" |
| `contact_address_line2` | Text | e.g. "Bloomfield, CT 06002" |
| `contact_phone` | Text | e.g. "(860) 243-3576" |
| `contact_email` | Email | e.g. "info@180lifechurch.org" |
| `contact_service_times_summary` | Text | e.g. "Sundays at 9:00 & 11:00 AM" |
| `doors_open_text` | Text | e.g. "Doors open at 8:40 AM" |

**Social Media**

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `social_facebook` | URL | Full Facebook page URL |
| `social_instagram` | URL | Full Instagram profile URL |
| `social_youtube` | URL | Full YouTube channel URL |
| `social_vimeo` | URL | Full Vimeo channel URL (optional) |

**Call-to-Action**

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `cta_label` | Text | e.g. "Take Your Next Step" |
| `cta_heading` | Text | e.g. "Your Story" |
| `cta_heading_accent` | Text | e.g. "Starts Here" (rendered in amber) |
| `cta_body` | Textarea | |
| `cta_primary_text` | Text | e.g. "I'm New Here" |
| `cta_primary_link` | Text (URL) | e.g. "/new" |
| `cta_secondary_text` | Text | e.g. "Contact Us" |
| `cta_secondary_link` | Text (URL) | e.g. "/contact" |

**Global**

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `mission_statement` | Textarea | e.g. "We exist to make and send disciples..." |
| `church_tagline` | Text | e.g. "Jesus Changes Everything" |

---

### Events

> Attach to: Post Type = `event`

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `event_date` | Text | e.g. "April 20" (display format, not a date picker) |
| `event_time` | Text | e.g. "9:00 AM & 11:00 AM" |
| `event_description` | Textarea | Short description for the card |
| `event_featured` | True/False | Featured events get a dark card style |
| `event_link` | URL | Church Center or external registration link (optional) |

---

### Ministries (Homepage Cards)

> Attach to: Post Type = `ministry`

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `ministry_description` | Textarea | Short blurb for the homepage card |
| `ministry_image` | Image | Card background image |
| `ministry_tag` | Text | e.g. "Sundays", "Weekly", "Grades 6-12" |
| `ministry_icon` | Select | Lucide icon name: Users, BookOpen, Baby, Sparkles, HandHeart, Music |
| `ministry_sort_order` | Number | Display order on the homepage |

---

### Services

> Attach to: Post Type = `service`

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `service_day` | Text | e.g. "Sunday" |
| `service_time` | Text | e.g. "9:00 AM" |
| `service_description` | Textarea | |
| `service_sort_order` | Number | Display order |

---

### Staff

> Attach to: Post Type = `staff`

The post **title** is the staff member's name.

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `staff_role` | Text | e.g. "Lead Pastor", "Children's Ministry Director" |
| `staff_photo` | Image | Headshot photo. Return format: URL or Image Object |
| `staff_bio` | Textarea | Bio paragraph (optional) |

**Important:** Staff whose role contains the word "Pastor" are automatically sorted into the Pastors section on the leadership page. All others appear in the Team section.

---

### Elders

> Attach to: Post Type = `elder`

The post **title** is the elder's name.

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `elder_role` | Text | e.g. "Chair", "Secretary", "Treasurer", "Elder" |
| `elder_photo` | Image | Headshot (optional) |

---

### Ministry Pages (Subpage Content)

> Attach to: Post Type = `ministry-page`

The post **title** is the ministry name. The post **slug** must match the route slug exactly (see list above).

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `ministry_subtitle` | Textarea | Shown in the PageHero below the title |
| `ministry_description` | WYSIWYG | Main body content. Split into paragraphs by `<p>` tags |
| `ministry_schedule` | Repeater | Subfields: `day` (Text), `time` (Text), `location` (Text, optional) |
| `ministry_contact_email` | Email | Contact email shown in the CTA section |
| `ministry_external_links` | Repeater | Subfields: `label` (Text), `href` (URL), `description` (Text, optional). Used for Church Center links, Google Drive folders, etc. |

---

### Content Pages

> Attach to: Post Type = `content-page`

The post **title** is the page name. The post **slug** must match the route slug exactly.

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `page_subtitle` | Textarea | Shown in the PageHero |
| `page_sections` | Repeater | Each row is a content section. Subfields below |
| `page_cta` | Group | CTA block at the bottom. Subfields below |

**`page_sections` subfields:**

| Subfield | Type | Notes |
|----------|------|-------|
| `label` | Text | Optional section label (e.g. "Our Mission") |
| `heading` | Text | Section heading (e.g. "Following, Changing,") |
| `heading_accent` | Text | Amber-colored word (e.g. "Committed") |
| `body` | WYSIWYG | Section content. Split into paragraphs by `<p>` tags |
| `image_src` | Image (URL) | Optional section image |
| `image_alt` | Text | Image alt text |
| `image_position` | Select | "left" or "right" (default: right) |

**`page_cta` subfields:**

| Subfield | Type | Notes |
|----------|------|-------|
| `heading` | Text | e.g. "Got Questions?" |
| `description` | Textarea | Optional description |
| `text` | Text | Button text (e.g. "Ask Now") |
| `link` | URL | Button link. Can be internal ("/contact") or external ("https://...") |

---

### Sermon Series

> Attach to: Post Type = `sermon-series`

The post **title** is the series name.

| Field Name | Field Type | Notes |
|------------|-----------|-------|
| `series_slug` | Text | URL slug (e.g. "at-the-movies"). Falls back to slugified title if empty |
| `series_subtitle` | Text | Short tagline |
| `series_description` | WYSIWYG | Longer description. Split by `<p>` tags |
| `series_image` | Image | Series cover/thumbnail |
| `series_sermons` | Repeater | Individual sermons in the series. Subfields below |

**`series_sermons` subfields:**

| Subfield | Type | Notes |
|----------|------|-------|
| `title` | Text | Sermon title |
| `date` | Text | Display date (e.g. "February 2024") |
| `youtube_id` | Text | YouTube video ID (e.g. "dQw4w9WgXcQ") |
| `speaker` | Text | Speaker name (optional) |

---

## Webhook Configuration

When editorial publishes or updates content in WordPress, the Next.js ISR cache
must be invalidated so the site serves fresh data.

### Option A: WP Webhooks Plugin (recommended)

1. Install "WP Webhooks" (free tier)
2. Go to WP Webhooks > Send Data > Post Updated
3. Add a new webhook:
   - **URL:** `https://180lifechurch.vercel.app/api/revalidate` (replace with your Vercel domain)
   - **Method:** POST
   - **Headers:** `x-revalidation-secret: YOUR_SECRET_HERE`
4. Set it to trigger on: `publish`, `update`, `trash` for all relevant CPTs

### Option B: Custom functions.php Hook

Add to your theme's `functions.php` or a site-specific plugin:

```php
function trigger_nextjs_revalidation($post_id, $post, $update) {
    // Only trigger for our custom post types
    $tracked_types = [
        'event', 'ministry', 'service', 'staff', 'elder',
        'ministry-page', 'content-page', 'sermon-series', 'site-settings'
    ];

    if (!in_array($post->post_type, $tracked_types)) {
        return;
    }

    // Only trigger on publish/update, not drafts
    if ($post->post_status !== 'publish') {
        return;
    }

    $vercel_url = 'https://180lifechurch.vercel.app/api/revalidate';
    $secret = defined('NEXTJS_REVALIDATION_SECRET')
        ? NEXTJS_REVALIDATION_SECRET
        : '';

    wp_remote_post($vercel_url, [
        'headers' => [
            'Content-Type'          => 'application/json',
            'x-revalidation-secret' => $secret,
        ],
        'body'    => wp_json_encode(['post_id' => $post_id]),
        'timeout' => 5,
    ]);
}
add_action('save_post', 'trigger_nextjs_revalidation', 10, 3);
```

Then add to `wp-config.php`:

```php
define('NEXTJS_REVALIDATION_SECRET', 'your-secret-here');
```

---

## Vercel Deployment Settings

### Environment Variables

In Vercel project dashboard (Settings > Environment Variables), add:

| Key | Value | Environments |
|-----|-------|-------------|
| `WORDPRESS_URL` | `https://180lifechurch.org` | Production, Preview |
| `WORDPRESS_REVALIDATION_SECRET` | (generate with `openssl rand -hex 32`) | Production, Preview |

### ISR Behavior

- **Default cache:** 1 hour (`revalidate: 3600` in fetch options)
- **On-demand revalidation:** Instant via `POST /api/revalidate` webhook
- **Cache tag:** All WordPress data is tagged `"wordpress"`. A single revalidation call clears all cached WP data across all pages.

---

## Testing the Integration

### Step 1: Local Testing

```bash
# Add to .env.local
WORDPRESS_URL=https://180lifechurch.org
WORDPRESS_REVALIDATION_SECRET=test-secret-123

# Start dev server
npm run dev
```

If ACF fields are not yet configured in WordPress, the site will fall back to
hardcoded content. Check the terminal for `WordPress API error` messages to
confirm the fetch is being attempted.

### Step 2: Verify REST API Access

Test that the WordPress REST API is accessible:

```bash
# Should return JSON array of posts
curl https://180lifechurch.org/wp-json/wp/v2/pages?per_page=1

# Should return ACF options (if ACF Pro + ACF to REST API installed)
curl https://180lifechurch.org/wp-json/acf/v3/options/site-settings
```

If you get a 404 or 403:
- Ensure permalinks are set to anything other than "Plain" in WP Settings > Permalinks
- Check that custom post types have `show_in_rest = true`
- ACF fields need "Show in REST API" enabled in field group settings

### Step 3: Test Revalidation

```bash
# Trigger cache clear
curl -X POST https://your-vercel-url.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidation-secret: YOUR_SECRET" \
  -d '{}'
```

Expected response: `{"revalidated":true,"now":1234567890}`

### Step 4: End-to-End Test

1. Update a staff member's bio in WordPress
2. Publish the change
3. Wait 2-3 seconds for the webhook to fire
4. Refresh the leadership page on the Vercel site
5. The updated bio should appear

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| Site shows fallback content despite WP being configured | `WORDPRESS_URL` not set or typo | Check Vercel env vars; redeploy after adding |
| 404 from WP REST API | CPT not registered with `show_in_rest` | Add `'show_in_rest' => true` to CPT registration |
| ACF fields missing from API response | ACF REST support not enabled | In ACF field group settings, enable "Show in REST API" |
| Stale content after WP update | Webhook not firing or wrong secret | Test webhook manually with curl; check secret matches |
| Images not loading | Domain not in Next.js config | `180lifechurch.org` is already in `next.config.ts` `remotePatterns` |
| Ministry page 404 | WP post slug does not match route | Ensure the WP slug matches exactly (e.g. `life-groups`, not `life_groups`) |
| "WORDPRESS_URL not configured" in logs | Expected in local dev without `.env.local` | Add `WORDPRESS_URL` to `.env.local` or ignore (fallbacks work fine) |

---

## File Reference

| File | Purpose |
|------|---------|
| `src/lib/data.ts` | **Import from here.** Unified data access layer. Tries WP, falls back to hardcoded |
| `src/lib/wordpress.ts` | Raw WP REST API fetch functions and ACF field parsers |
| `src/lib/wordpress-types.ts` | TypeScript interfaces for WP data shapes |
| `src/lib/wordpress-fallbacks.ts` | Hardcoded homepage content (hero, about, events, services, etc.) |
| `src/lib/subpage-fallbacks.ts` | Hardcoded subpage content (ministries, content pages, leadership, sermons) |
| `src/lib/subpage-types.ts` | TypeScript interfaces for subpage data shapes |
| `src/app/api/revalidate/route.ts` | Webhook endpoint for on-demand ISR cache clearing |
| `next.config.ts` | Image remote patterns (already includes `180lifechurch.org`) |
