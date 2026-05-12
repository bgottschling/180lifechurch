/**
 * Image source helpers for Next.js <Image>.
 *
 * Planning Center serves images from a CDN that returns signed, Imgix-
 * style transform URLs (e.g.
 * https://images.planningcenterusercontent.com/v1/transform.jpg?...).
 * Vercel's image optimizer cannot re-transform these and rejects the
 * request with `INVALID_IMAGE_OPTIMIZE_REQUEST`. PC also already serves
 * appropriately-sized WebP/JPEG variants, so re-optimizing through
 * Vercel adds latency and cost without benefit.
 *
 * Use `isPlanningCenterImage(src)` to flip the `unoptimized` prop on
 * <Image> for sources that should bypass Vercel optimization.
 */

const PC_HOST_SUFFIXES = [
  "planningcenterusercontent.com",
  "planningcenteronline.com",
];

const PC_BUCKET_HOSTS = [
  "publishing-production-attachments.s3.amazonaws.com",
  "registrations-production.s3.amazonaws.com",
];

/**
 * Returns true if the given URL points to a Planning Center asset
 * host that should bypass Vercel's image optimizer.
 *
 * Safe on null/undefined and on malformed URLs (returns false rather
 * than throwing) so callers can use it inline:
 *
 *   <Image
 *     src={src}
 *     unoptimized={isPlanningCenterImage(src)}
 *     ...
 *   />
 */
/**
 * Visible-fallback image used everywhere a hardcoded ministry /
 * content / leadership thumbnail used to live.
 *
 * Why the church logo and not a generic placeholder: when any tile
 * on the site renders this image, the editor knows at a glance
 * that the real WP data path didn't deliver — the fallback chain
 * is active. It's a debugging aid baked into the design system.
 * Editors who upload real photos in wp-admin replace it
 * automatically; sites that haven't been seeded yet read as
 * intentionally-branded rather than visibly broken.
 *
 * Hosted on the WordPress side (already in next.config.ts
 * remotePatterns) so updating it doesn't require a code deploy.
 */
export const BROKEN_IMAGE_PLACEHOLDER =
  "https://180lifechurch.org/wp-content/uploads/2024/07/180-Life-Church-Logo-2024-AIOSEO.png";

export function isPlanningCenterImage(
  src: string | null | undefined
): boolean {
  if (!src) return false;
  try {
    const u = new URL(src);
    if (PC_BUCKET_HOSTS.includes(u.hostname)) return true;
    return PC_HOST_SUFFIXES.some(
      (suffix) => u.hostname === suffix || u.hostname.endsWith("." + suffix)
    );
  } catch {
    // Relative paths and `/images/...` placeholders fall through to
    // optimized rendering, which is what we want for local public
    // assets.
    return false;
  }
}
