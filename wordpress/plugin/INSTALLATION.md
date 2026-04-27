# 180 Life Revalidation Plugin — Installation Guide

This guide walks through installing the `180life-revalidation` WordPress plugin on the church's WordPress site so content updates auto-propagate to the live Next.js site.

## Prerequisites

- WordPress 5.6+ with admin access
- The `WORDPRESS_REVALIDATION_SECRET` value (set in Vercel env vars)
- The Vercel deployment URL (preview or production)
- Optional: a Vercel Protection Bypass Token (only needed for protected preview deployments)

## Method 1: Upload via wp-admin (Easiest)

1. **Zip the plugin folder:**
   - On your machine, navigate to `wordpress/plugin/`
   - Right-click `180life-revalidation` and create a ZIP file (`180life-revalidation.zip`)
2. **Upload to WordPress:**
   - Log into wp-admin → **Plugins → Add New → Upload Plugin**
   - Select `180life-revalidation.zip`
   - Click **Install Now**
3. **Activate** when prompted

## Method 2: Upload via FTP/SFTP

If you have FTP/SFTP access to the WordPress server (e.g., via GoDaddy File Manager or a tool like FileZilla):

1. Upload the entire `180life-revalidation` folder to:
   ```
   wp-content/plugins/180life-revalidation/
   ```
2. Log into wp-admin → **Plugins**
3. Find **180 Life Revalidation** in the list
4. Click **Activate**

## Configuration

After activation:

1. Navigate to **Settings → 180 Life Revalidation**

2. **General Tab:**
   - **Enabled** — Toggle ON to start firing webhooks on publish/update events
   - **Webhook URL** — Set to:
     - **Preview testing:** `https://180lifechurch-git-feat-wor-36a33e-brandon-gottschlings-projects.vercel.app/api/revalidate`
     - **Production:** `https://180lifechurch.org/api/revalidate` (after launch)
   - **Revalidation Secret** — Paste the value from Vercel env vars: `180life-revalidate-2026`
   - **Vercel Bypass Token** — Required only for the preview URL. Paste the token generated in Vercel → Settings → Deployment Protection → Protection Bypass for Automation. Leave blank for production.

3. **Click "Run Test"** — verifies the connection without saving. Expected response:
   ```
   ✓ Success! Connected successfully (HTTP 200 in 250 ms).
   ```

4. **Click "Save Settings"**

## Verify It's Working

1. Edit any **Site Settings**, **Ministry**, **Staff**, **Elder**, or **Sermon Series** entry
2. Click **Update / Publish**
3. Visit **Settings → 180 Life Revalidation → Activity Log**
4. You should see a new entry with status `pass` and HTTP 200

## Tag Mapping (Advanced)

The default tag mapping covers all our Phase A custom post types:

| Post Type     | Tags fired                |
|---------------|---------------------------|
| Site Settings | `wordpress`, `settings`   |
| Ministry      | `wordpress`, `ministries` |
| Staff         | `wordpress`, `leadership` |
| Elder         | `wordpress`, `leadership` |
| Sermon Series | `wordpress`, `sermons`    |
| Page          | (not mapped — no webhook) |
| Post          | (not mapped — no webhook) |

To add tag mapping for a new post type (e.g., `event`), edit the **Tag Mapping** tab and add the tags as comma-separated values.

## Switching from Preview to Production

When the site goes live at the main domain:

1. Update **Webhook URL** to `https://180lifechurch.org/api/revalidate`
2. **Clear** the Vercel Bypass Token field (production isn't protected)
3. Run **Test Connection** to verify
4. Save

## Uninstall

Deactivating from the Plugins screen suspends the plugin but preserves settings. Deleting it via the Plugins screen runs the uninstall hook which cleans up all stored settings and the activity log.

## Troubleshooting

**Test Connection fails with HTTP 401:**
- Revalidation Secret doesn't match `WORDPRESS_REVALIDATION_SECRET` in Vercel env vars

**Test Connection fails with HTTP 401 + Vercel HTML:**
- The request is being blocked by Vercel deployment protection. Add the Bypass Token.

**Test Connection fails with HTTP 400:**
- Invalid tag in the request body. Check the Tag Mapping tab.

**Webhook fires but content doesn't update:**
- Check the Activity Log for status. If `pass` (HTTP 200), the issue is downstream (CDN propagation, Next.js cache). Wait 30-60 seconds and hard-refresh.

**No webhook fires when I publish:**
- Check **Settings → 180 Life Revalidation** to confirm the plugin is enabled
- Check the Tag Mapping tab — the post type must have at least one tag listed
- Built-in `post` and `page` types don't fire webhooks by default

## Source

The plugin is part of the main repository at `wordpress/plugin/180life-revalidation/`.

GitHub: https://github.com/bgottschling/180lifechurch/tree/main/wordpress/plugin/180life-revalidation

## Support

Contact Brandon at `b@gottschling.dev` for questions or issues.
