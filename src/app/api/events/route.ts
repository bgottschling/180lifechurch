import { NextResponse } from "next/server";

export const revalidate = 3600; // Re-fetch every hour via ISR

const PC_APP_ID = process.env.PLANNING_CENTER_APP_ID;
const PC_SECRET = process.env.PLANNING_CENTER_SECRET;
const PC_BASE = "https://api.planningcenteronline.com";

interface PCEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  featured: boolean;
  planningCenterLink: string;
}

/**
 * Fetches upcoming events from Planning Center Registrations API.
 *
 * Requires env vars:
 *   PLANNING_CENTER_APP_ID - Personal Access Token application ID
 *   PLANNING_CENTER_SECRET - Personal Access Token secret
 *
 * When these env vars are not set, returns an empty array so the
 * data layer falls through to hardcoded fallbacks.
 *
 * To generate a PAT:
 *   1. Log in to https://api.planningcenteronline.com/oauth/applications
 *   2. Create a new Personal Access Token
 *   3. Copy the Application ID and Secret
 *   4. Add to Vercel env vars (or .env.local for dev)
 */
export async function GET() {
  // If no credentials configured, return empty so data.ts uses fallbacks
  if (!PC_APP_ID || !PC_SECRET) {
    return NextResponse.json(
      {
        events: [],
        count: 0,
        message:
          "Planning Center credentials not configured. Using fallback data.",
      },
      { status: 200 }
    );
  }

  try {
    const auth = Buffer.from(`${PC_APP_ID}:${PC_SECRET}`).toString("base64");

    const res = await fetch(
      `${PC_BASE}/registrations/v2/events?filter=upcoming&order=starts_at&per_page=10&include=event_times`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      throw new Error(`Planning Center API returned ${res.status}`);
    }

    const data = await res.json();

    // Map Planning Center JSON:API response to our event shape
    const events: PCEvent[] = (data.data || []).map(
      (event: {
        id: string;
        attributes: {
          name?: string;
          starts_at?: string;
          ends_at?: string;
          event_time?: string;
          description?: string;
          featured?: boolean;
        };
      }) => {
        const attrs = event.attributes;
        const startsAt = attrs.starts_at
          ? new Date(attrs.starts_at)
          : new Date();
        const dateStr = startsAt.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        });

        return {
          id: event.id,
          title: attrs.name || "Untitled Event",
          date: dateStr,
          time: attrs.event_time || "",
          description: attrs.description || "",
          featured: attrs.featured || false,
          planningCenterLink: `https://180life.churchcenter.com/registrations/events/${event.id}`,
        };
      }
    );

    return NextResponse.json(
      { events, count: events.length },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch events from Planning Center:", error);

    return NextResponse.json(
      { events: [], count: 0, error: "Failed to fetch event data" },
      { status: 200 }
    );
  }
}
