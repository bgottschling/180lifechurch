import { NextResponse } from "next/server";

const CHANNEL_HANDLE = "180lifechurch";
const CHANNEL_URL = `https://www.youtube.com/@${CHANNEL_HANDLE}/videos`;

export const revalidate = 3600; // Re-fetch every hour via ISR

interface SermonVideo {
  videoId: string;
  title: string;
  thumbnail: string;
}

/**
 * Scrapes the 180 Life Church YouTube channel page for recent sermon videos.
 * Returns up to 20 unique videos with titles and thumbnails.
 * Uses the same proven scraping pattern as /api/latest-sermon.
 */
export async function GET() {
  try {
    const channelRes = await fetch(CHANNEL_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!channelRes.ok) {
      throw new Error(`YouTube channel fetch failed: ${channelRes.status}`);
    }

    const html = await channelRes.text();

    // Extract all videoId + title pairs from the page JSON
    // YouTube embeds structured data like: {"videoId":"xxx","title":{"runs":[{"text":"..."}]}}
    const videoMatches = [
      ...html.matchAll(
        /"videoId":"([A-Za-z0-9_-]{11})".*?"title":\{"runs":\[\{"text":"([^"]+)"\}/g
      ),
    ];

    // Deduplicate by videoId, keep first occurrence (most recent)
    const seen = new Set<string>();
    const videos: SermonVideo[] = [];

    for (const match of videoMatches) {
      const videoId = match[1];
      const title = match[2];

      // Skip duplicates and non-sermon videos (full service recordings, etc.)
      if (seen.has(videoId)) continue;
      seen.add(videoId);

      // Filter: only include "Sermon" videos, skip full service replays
      const isSermon =
        title.includes("Sermon") ||
        title.includes("sermon") ||
        (!title.includes("Online Service") &&
          !title.includes("Church at Home"));

      if (!isSermon) continue;

      videos.push({
        videoId,
        title,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      });

      if (videos.length >= 20) break;
    }

    return NextResponse.json(
      { videos, count: videos.length },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch sermons from YouTube:", error);

    return NextResponse.json(
      { videos: [], count: 0, error: "Failed to fetch sermon data" },
      { status: 200 }
    );
  }
}
