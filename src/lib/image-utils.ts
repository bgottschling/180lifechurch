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
