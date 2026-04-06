import { NextResponse } from "next/server";

/**
 * Live Service Status API
 *
 * Hybrid approach:
 *   1. Scrape Church Online Platform (180life.online.church) for real-time
 *      currentService data embedded in the page's __NEXT_DATA__.
 *   2. Fall back to hardcoded Sunday service windows (9 AM and 11 AM ET).
 *
 * The banner in the navbar shows "We're Live" when either:
 *   - The platform reports an active currentService, OR
 *   - Current time is within a Sunday service window (with buffer).
 *
 * ISR: Revalidates every 5 minutes so Sunday services get quick updates
 * without hammering the platform.
 */

const ONLINE_CHURCH_URL = "https://180life.online.church/";

// Hardcoded service windows (Eastern Time)
// Services at 9:00 AM and 11:00 AM, with a 15-min pre-service buffer
// and run for ~75 minutes
const SUNDAY_SERVICE_WINDOWS = [
  { startHour: 8, startMin: 45, endHour: 10, endMin: 15 }, // 9 AM service
  { startHour: 10, startMin: 45, endHour: 12, endMin: 15 }, // 11 AM service
];

export const revalidate = 300; // Revalidate every 5 minutes

export interface LiveStatusData {
  isLive: boolean;
  source: "platform" | "schedule" | "none";
  nextServiceTime?: string;
  checkedAt: string;
}

/**
 * Get the current time in America/New_York timezone.
 * Returns { day, hour, minute } where day is 0=Sunday.
 */
function getEasternTime(): { day: number; hour: number; minute: number } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const weekdayStr = parts.find((p) => p.type === "weekday")?.value || "Sun";
  const hourStr = parts.find((p) => p.type === "hour")?.value || "0";
  const minuteStr = parts.find((p) => p.type === "minute")?.value || "0";

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    day: dayMap[weekdayStr] ?? 0,
    // "24" can appear for midnight in some locales — normalize to 0
    hour: parseInt(hourStr, 10) % 24,
    minute: parseInt(minuteStr, 10),
  };
}

/**
 * Check if current ET time is within a hardcoded Sunday service window.
 */
function isWithinServiceWindow(): boolean {
  const { day, hour, minute } = getEasternTime();
  if (day !== 0) return false;

  const currentMinutes = hour * 60 + minute;
  return SUNDAY_SERVICE_WINDOWS.some((w) => {
    const start = w.startHour * 60 + w.startMin;
    const end = w.endHour * 60 + w.endMin;
    return currentMinutes >= start && currentMinutes < end;
  });
}

/**
 * Scrape the Church Online Platform page for embedded live service data.
 * Returns true if a service is actively scheduled/running.
 */
async function checkPlatformStatus(): Promise<boolean> {
  try {
    const res = await fetch(ONLINE_CHURCH_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) return false;

    const html = await res.text();

    // Look for populated currentService data in the embedded JSON.
    // Empty state looks like: "currentService":{"id":"","startTime":""...
    // Active state has a non-empty id and startTime.
    const match = html.match(
      /"currentService":\{"id":"([^"]*)","startTime":"([^"]*)"/,
    );

    if (match && match[1] && match[2]) {
      // Verify startTime is within a reasonable window (not a stale value)
      const startTime = new Date(match[2]);
      const now = new Date();
      const diffMs = now.getTime() - startTime.getTime();
      // Consider "live" if service started within the last 3 hours
      if (diffMs >= -30 * 60 * 1000 && diffMs <= 3 * 60 * 60 * 1000) {
        return true;
      }
    }

    return false;
  } catch (err) {
    console.error("Live status platform check failed:", err);
    return false;
  }
}

export async function GET() {
  const scheduleLive = isWithinServiceWindow();
  const platformLive = await checkPlatformStatus();

  const data: LiveStatusData = {
    isLive: scheduleLive || platformLive,
    source: platformLive ? "platform" : scheduleLive ? "schedule" : "none",
    checkedAt: new Date().toISOString(),
  };

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
