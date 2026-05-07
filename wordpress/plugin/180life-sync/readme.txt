=== 180 Life Sync ===
Contributors: bgottschling
Tags: webhook, revalidation, headless, nextjs, vercel, health-check
Requires at least: 5.6
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.2.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Keeps the live Next.js site in sync with WordPress. Auto-fires cache revalidation webhooks when content is published or updated, and periodically verifies the headless integration is healthy.

== Description ==

Built for the 180 Life Church headless WordPress + Vercel architecture, but works with any Next.js site that exposes a `/api/revalidate` endpoint with a shared secret.

= What it does =

* **Auto-revalidation:** When an editor publishes or updates content, the plugin fires a webhook to the Next.js site so changes appear within seconds rather than waiting for the 1-hour ISR cache to expire.
* **Periodic health checks:** Every 6 hours by default, the plugin polls the Next.js diagnostic endpoint to verify the integration is working and stores the result. If overall status drops to "broken," an admin email alert is sent (debounced).
* **Activity log:** Last 50 webhook events with status, timing, and trigger source.

= Premium admin UI =

Built on WordPress core design language with status indicators, masked credential fields, in-page test buttons, and inline diagnostic results. No external dependencies.

= Four-tab settings page =

1. **General** — webhook URL, revalidation secret, Vercel bypass token, master enable/disable, test connection button
2. **Tag Mapping** — configurable per-post-type cache tag mapping with auto-discovery of registered post types
3. **Site Health** — periodic check schedule, alert email, manual run button, latest diagnostic detail
4. **Activity Log** — last 50 webhook events with status badges and round-trip timings

= Vercel preview support =

Optional bypass token field for testing on protected preview deployments before flipping to production. Switch URLs and clear the token when going live.

== Installation ==

1. Upload the `180life-sync` folder to `/wp-content/plugins/`
2. Activate the plugin through the **Plugins** menu in WordPress
3. Go to **Settings → 180 Life Sync**
4. Fill in the General tab:
   - **Webhook URL** — Next.js `/api/revalidate` endpoint
   - **Revalidation Secret** — must match `WORDPRESS_REVALIDATION_SECRET` in Vercel env vars
   - **Vercel Bypass Token** — optional, for protected preview deployments only
5. Click **Run Test** to verify the connection
6. Click **Save Settings**
7. Optionally, configure the **Site Health** tab to enable periodic checks and alerts

== Frequently Asked Questions ==

= Why isn't the webhook firing for my post? =

Check the Tag Mapping tab. Only post types listed there with at least one tag will trigger webhooks. Built-in `post` and `page` are not mapped by default.

= How often do periodic health checks run? =

Default is every 6 hours. Configurable to hourly, twice daily, or daily on the Site Health tab. WordPress runs scheduled tasks lazily — they fire on the next page request after the scheduled time, not at the exact second.

= Will I get spammed with alert emails if the site stays broken? =

No. Alerts are debounced — you only receive an email when overall status transitions into "broken" from a previous non-broken state. Subsequent re-checks that confirm the same broken status do not re-send.

= What are valid cache tags? =

`wordpress`, `events`, `ministries`, `leadership`, `sermons`, `settings`, `pages`. The `wordpress` tag invalidates everything; the others are more granular.

== Changelog ==

= 1.2.1 =
* New: **Send Test Alert button** on the Site Health tab next to the Alert Email field. Verifies wp_mail() delivery works on this WordPress host without waiting for a real outage. Most common reason real alerts never arrive is silent SMTP failure on shared hosts that block PHP sendmail; the test button surfaces this immediately and recommends installing an SMTP plugin if delivery fails.
* Improved: when a real broken-status alert is sent (or fails to send), the result is now logged to the Activity Log with the recipient address and the wp_mail() return value. If wp_mail returned false, the log entry includes the captured PHPMailer error and a hint about SMTP configuration.

= 1.2.0 =
* New: **Quick Actions on the Content Hub.** "Site Health" status pill and "Refresh Content" panel are now surfaced directly on the 180 Life landing page in wp-admin, so editors can see at a glance whether the live site integration is healthy and force-refresh the cache without digging into Settings. The full diagnostic table and configuration options still live on the Sync settings page.
* Internal: removed the legacy `sermon-series` post-type entry from the headless-site health probe — Sermon Series was deprecated in v1.1.0 (sermons sourced from Planning Center Publishing API), and the probe was producing a misleading "post type not found" warning every time it ran.
* Companion change on the Next.js side: the `/api/wordpress-health` endpoint now also pings Planning Center's Registrations and Publishing APIs, so a future API rebrand surfaces as a `degraded` health status (and triggers an alert email if configured) before it can break the next deploy.

= 1.1.2 =
* "Refresh Planning Center Content" replaced with a more flexible "Refresh Content" panel that supports a scope selector. Default is "All content" (full global cache reset). Narrow scopes available for "Planning Center only" and "WordPress only" if you only want to invalidate one source's cache.
* The Activity Log now records the chosen scope (e.g. `admin/refresh-all`, `admin/refresh-planning-center`) so you can see at a glance which kind of refresh was triggered.

= 1.1.1 =
* New: "Refresh Planning Center Content" button on the General tab → Quick Actions section. Force-refreshes events and sermons from Church Center on demand, skipping the 24-hour cache wait. Use this immediately after publishing a new sermon series or event registration.
* Companion change on the Next.js side: a second Vercel Cron schedule fires automatically every Sunday at ~10:30 AM Eastern (14:30 UTC) so the Sunday morning service has the freshest content right when traffic peaks.

= 1.1.0 =
* **Sermon Series CPT removed.** Sermons are now sourced live from Planning Center Publishing API directly by the headless Next.js site, with daily refresh via Vercel Cron. No more dual-entry between Church Center and WordPress.
* `Sermon Series` removed from default Tag Mapping, Content Hub landing page, and managed CPT list.
* Editors with existing Sermon Series entries can safely deactivate or delete them after the headless site picks up Planning Center as the source of truth (no data is read from these entries anymore).

= 1.0.3 =
* New: consolidated admin menu. All church-managed content (Site Settings, Ministries, Staff, Elders, Sermon Series) is grouped under a single "180 Life" top-level menu in wp-admin instead of free-floating top-level entries. Includes a content hub landing page with quick-access cards for each content type and a count of published entries.
* New: "Consolidate Menus" toggle on the General tab to opt in or out (defaults to ON for new installs).
* Internal: AdminMenu class hooks `register_post_type_args` to redirect each managed CPT's `show_in_menu` to the parent slug; uses `parent_file` filter for accurate sidebar highlighting.

= 1.0.2 =
* **Critical fix:** Saving the General tab no longer silently disables the Site Health periodic check, and saving the Site Health tab no longer disables the master enabled toggle. Each tab now preserves the other tab's checkbox states across saves. Recommended for anyone who hit "I can't have both webhooks AND periodic checks turned on at the same time."
* Internal: sanitize uses array_key_exists() to distinguish "field not on this form" from "field explicitly unchecked"; checkbox markup adds a hidden input fallback so unchecked submits as 0 rather than missing.

= 1.0.1 =
* Fix: status bar now shows the gray "idle" indicator when the master toggle is off (previously showed green if the last test had passed, which was misleading)
* Add: inline warning notice on the General tab when webhooks are disabled, so editors know publish events won't trigger revalidation
* Add: download Activity Log as CSV (Excel-friendly) or JSON (full detail for debugging) from the Activity Log tab
* Polish: refresh / clear / download buttons grouped with dashicons in the log toolbar

= 1.0.0 =
* Initial release
* Renamed from "180 Life Revalidation" to "180 Life Sync" before first install
* Webhook firing on `transition_post_status` and `acf/save_post`
* Settings page with four tabs (General, Tag Mapping, Site Health, Activity Log)
* AJAX test connection button
* AJAX manual health check button
* Periodic health checks via WP-Cron with configurable frequency
* Email alerts on health-status transition to broken (debounced)
* 50-entry activity log
* Vercel bypass token support for preview deployments
