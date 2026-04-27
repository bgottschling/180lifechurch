# 180 Life Sync Plugin — Installation Guide

This guide walks through installing the `180life-sync` WordPress plugin on the church's WordPress site so content updates auto-propagate to the live Next.js site, with periodic health checks running in the background.

## Prerequisites

- WordPress 5.6+ with admin access
- The `WORDPRESS_REVALIDATION_SECRET` value (set in Vercel env vars)
- The Vercel deployment URL (preview or production)
- Optional: a Vercel Protection Bypass Token (only needed for protected preview deployments)
- Optional: an admin email for health alerts (e.g., `webmaster@180lifechurch.org`)

## Method 1: Upload via wp-admin (Easiest)

1. **Zip the plugin folder:**
   - On your machine, navigate to `wordpress/plugin/`
   - Right-click `180life-sync` and create a ZIP file (`180life-sync.zip`)
2. **Upload to WordPress:**
   - Log into wp-admin → **Plugins → Add New → Upload Plugin**
   - Select `180life-sync.zip`
   - Click **Install Now**
3. **Activate** when prompted

## Method 2: Upload via FTP/SFTP

If you have FTP/SFTP access (e.g., GoDaddy File Manager or FileZilla):

1. Upload the entire `180life-sync` folder to:
   ```
   wp-content/plugins/180life-sync/
   ```
2. Log into wp-admin → **Plugins**
3. Find **180 Life Sync** in the list
4. Click **Activate**

## Configuration

After activation, navigate to **Settings → 180 Life Sync**.

### General Tab

| Field | Value |
|---|---|
| **Enabled** | Toggle ON |
| **Webhook URL** | Preview: `https://180lifechurch-git-feat-wor-36a33e-brandon-gottschlings-projects.vercel.app/api/revalidate`<br>Production: `https://180lifechurch.org/api/revalidate` |
| **Revalidation Secret** | `180life-revalidate-2026` (must match Vercel env var) |
| **Vercel Bypass Token** | Required for preview only; leave blank for production |

Click **Run Test** — expected response: `✓ Success! Connected successfully (HTTP 200 in ~250 ms).`

Click **Save Settings**.

### Site Health Tab (New in 1.0.0)

Configure background monitoring of the Next.js integration so problems surface before editors notice.

| Field | Recommended |
|---|---|
| **Periodic Checks** | Toggle ON |
| **Health Check URL** | Same domain as the webhook URL, but ending in `/api/wordpress-health` |
| **Frequency** | Every 6 Hours (default) |
| **Alert Email** | A monitored church inbox (e.g., `webmaster@180lifechurch.org`) |

Click **Save Health Settings**.

Click **Run Health Check Now** to trigger an immediate check. The result panel below will populate with:
- Overall status (healthy / degraded / broken)
- Each diagnostic check (REST API connectivity, ACF detection, custom post types, content population)
- Round-trip time for the check

### Tag Mapping Tab

The default mapping covers all Phase A custom post types:

| Post Type     | Tags fired                |
|---------------|---------------------------|
| Site Settings | `wordpress`, `settings`   |
| Ministry      | `wordpress`, `ministries` |
| Staff         | `wordpress`, `leadership` |
| Elder         | `wordpress`, `leadership` |
| Sermon Series | `wordpress`, `sermons`    |
| Page          | (not mapped — no webhook) |
| Post          | (not mapped — no webhook) |

To monitor a new post type, edit the row for it in this tab and add comma-separated tags.

## Verify It's Working

1. Edit any **Site Settings**, **Ministry**, **Staff**, **Elder**, or **Sermon Series** entry
2. Click **Update / Publish**
3. Visit **Settings → 180 Life Sync → Activity Log**
4. You should see a new entry with status `pass` and HTTP 200

## Switching from Preview to Production

When the site goes live at the main domain:

1. Update **Webhook URL** to `https://180lifechurch.org/api/revalidate`
2. Update **Health Check URL** to `https://180lifechurch.org/api/wordpress-health`
3. **Clear** the Vercel Bypass Token field (production isn't protected)
4. Run **Test Connection** to verify
5. Run **Run Health Check Now** to verify
6. Save

## Uninstall

Deactivating from the Plugins screen suspends the plugin and cancels scheduled health checks but preserves settings. Deleting the plugin via the Plugins screen runs the uninstall hook which cleans up all stored settings, the activity log, and the latest health result.

## Troubleshooting

**Test Connection fails with HTTP 401:**
Revalidation Secret doesn't match `WORDPRESS_REVALIDATION_SECRET` in Vercel env vars.

**Test Connection fails with Vercel HTML response:**
The request is being blocked by Vercel deployment protection. Add the Bypass Token.

**Test Connection fails with HTTP 400:**
Invalid tag in the request body. Check the Tag Mapping tab.

**Webhook fires but content doesn't update:**
Check the Activity Log for status. If `pass` (HTTP 200), the issue is downstream (CDN propagation, Next.js cache). Wait 30-60 seconds and hard-refresh.

**No webhook fires when I publish:**
- Check that **Enabled** is ON in the General tab
- Check the Tag Mapping tab — the post type must have at least one tag listed
- Built-in `post` and `page` types don't fire webhooks by default

**Health Check shows "broken" but the site looks fine:**
The diagnostic API checks more than visible content (it also verifies CPT existence, ACF availability, content counts). Open the Site Health tab and look at per-check details to see what's flagged.

**Cron jobs aren't running:**
WordPress's built-in cron is "lazy" — it fires only when someone visits the site. For low-traffic sites, consider switching to a real cron (set `DISABLE_WP_CRON` in `wp-config.php` and add a server cron that hits `wp-cron.php` every minute).

## Source

The plugin source lives in the main repository at `wordpress/plugin/180life-sync/`.

GitHub: https://github.com/bgottschling/180lifechurch/tree/main/wordpress/plugin/180life-sync

## Support

Contact Brandon at `b@gottschling.dev` for questions or issues.
