=== 180 Life Revalidation ===
Contributors: bgottschling
Tags: webhook, revalidation, headless, nextjs, vercel
Requires at least: 5.6
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Auto-fires Next.js cache revalidation webhooks when content is published or updated. Built for the 180 Life Church headless WordPress + Vercel architecture.

== Description ==

This plugin watches WordPress publish and update events and sends a webhook to the configured Next.js revalidation endpoint, so editors see their changes reflected on the live site within seconds without needing to wait on cache timers or developer involvement.

= Features =

* **Premium admin UI** built on WordPress core design language
* **Tag-based cache invalidation** — each post type maps to specific Next.js cache tags
* **Vercel preview support** — optional bypass token field for testing on protected preview deployments
* **Live activity log** — last 50 webhook events with status, timing, and trigger source
* **One-click test button** — fires a sample webhook with current form values without saving first
* **Show/hide secret fields** — credentials masked by default, toggle to verify
* **Configurable post-type → tag mapping** — add new post types and map them to cache tags from the admin UI
* **ACF-aware** — also fires when ACF fields are saved on a published post
* **Non-blocking** — webhook is dispatched without slowing down the editor's publish action

== Installation ==

1. Upload the `180life-revalidation` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the **Plugins** menu in WordPress
3. Go to **Settings → 180 Life Revalidation**
4. Fill in:
   - **Webhook URL** — the Next.js `/api/revalidate` endpoint (preview or production)
   - **Revalidation Secret** — must match `WORDPRESS_REVALIDATION_SECRET` in Vercel env vars
   - **Vercel Bypass Token** — optional, only needed for protected preview deployments
5. Click **Run Test** to verify the connection
6. Click **Save Settings**

The plugin is now active. Publish or update any mapped post type and the webhook fires automatically.

== Frequently Asked Questions ==

= Why isn't the webhook firing for my post? =

Check **Settings → 180 Life Revalidation → Tag Mapping**. Only post types listed there with at least one tag will trigger webhooks. The default mapping covers `site_settings`, `ministry`, `staff`, `elder`, and `sermon_series`. Built-in `post` and `page` are not mapped by default.

= How do I add a new post type to the mapping? =

After registering the post type in WordPress (via Custom Post Type UI or code), it will appear in the Tag Mapping table. Enter the cache tags (comma-separated) and save.

= What are valid cache tags? =

The Next.js endpoint accepts: `wordpress`, `events`, `ministries`, `leadership`, `sermons`, `settings`, `pages`. The `wordpress` tag is a broad invalidator that affects all WordPress-sourced content; the others are more granular.

= Why do I need both a Revalidation Secret and a Vercel Bypass Token? =

They serve different gatekeepers:

* **Revalidation Secret** authenticates the request to the Next.js app code (sent as `x-revalidation-secret` header)
* **Vercel Bypass Token** lets the request through Vercel's deployment protection, which guards preview URLs

For production deployments at the main domain, only the Revalidation Secret is required.

= Where can I see if the plugin is working? =

The **Activity Log** tab shows the last 50 webhook events with timestamp, status, response time, and result. The status bar at the top of the settings page shows when the most recent webhook fired and whether it succeeded.

== Screenshots ==

1. General settings tab with status indicator, masked credential fields, and test connection button
2. Tag mapping table for configuring per-post-type cache invalidation
3. Activity log showing recent webhook events with status badges and round-trip timings

== Changelog ==

= 1.0.0 =
* Initial release
* Webhook firing on `transition_post_status` and `acf/save_post`
* Admin settings page with three tabs (General, Tag Mapping, Activity Log)
* AJAX test connection button
* 50-entry activity log
* Vercel bypass token support for preview deployments
