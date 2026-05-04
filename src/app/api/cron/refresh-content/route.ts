import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * GET /api/cron/refresh-content
 *
 * Vercel Cron handler. Triggered daily (see `vercel.json`) to refresh
 * Planning Center data — events drop off after they end and new
 * sermon series propagate without waiting for the 24h ISR timer.
 *
 * Vercel sends `Authorization: Bearer <CRON_SECRET>` automatically
 * when configured via vercel.json + the CRON_SECRET env var. We
 * verify that header to prevent unauthorized invocations.
 *
 * If CRON_SECRET is not configured, allows the request through
 * (defensive default for setups where Vercel's automatic Cron auth
 * is enabled and the secret is implicit).
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = Date.now();
  const results = {
    events: false,
    sermons: false,
    "planning-center": false,
  };

  try {
    revalidateTag("events", "max");
    results.events = true;
  } catch (err) {
    console.error("[cron] revalidateTag(events) failed:", err);
  }

  try {
    revalidateTag("sermons", "max");
    results.sermons = true;
  } catch (err) {
    console.error("[cron] revalidateTag(sermons) failed:", err);
  }

  try {
    revalidateTag("planning-center", "max");
    results["planning-center"] = true;
  } catch (err) {
    console.error("[cron] revalidateTag(planning-center) failed:", err);
  }

  return NextResponse.json({
    revalidated: results,
    elapsedMs: Date.now() - start,
    timestamp: new Date().toISOString(),
  });
}
