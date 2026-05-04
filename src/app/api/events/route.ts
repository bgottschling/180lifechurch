import { NextResponse } from "next/server";
import { getEventsFromPC } from "@/lib/planning-center";

/**
 * GET /api/events
 *
 * Returns upcoming events from Planning Center Registrations.
 * Now a thin wrapper over the shared `getEventsFromPC` fetcher in
 * src/lib/planning-center.ts so the homepage and this endpoint
 * share filtering, ordering, and caching behavior.
 *
 * ISR cache: 24 hours (set via the shared fetcher). Daily refresh
 * is enforced by Vercel Cron at /api/cron/refresh-content (see
 * vercel.json), so this endpoint never serves data more than ~24h old.
 *
 * Returns empty array on PC outage so the data layer can fall through
 * to hardcoded fallbacks gracefully.
 */
export const revalidate = 86400; // mirror the fetcher's tag TTL

export async function GET() {
  try {
    const events = await getEventsFromPC();
    return NextResponse.json(
      { events, count: events.length },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=172800",
        },
      }
    );
  } catch (error) {
    console.error("[/api/events] Planning Center unavailable:", error);
    return NextResponse.json(
      {
        events: [],
        count: 0,
        error: "Planning Center unavailable",
      },
      { status: 200 }
    );
  }
}
