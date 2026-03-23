import { NextResponse } from "next/server";

const CHANNEL_HANDLE = "180lifechurch";
const CHANNEL_URL = `https://www.youtube.com/@${CHANNEL_HANDLE}/videos`;

export const revalidate = 3600; // Re-fetch every hour via ISR

interface SermonData {
  videoId: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelUrl: string;
}

export async function GET() {
  try {
    // Step 1: Scrape the channel page for the latest video ID
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

    // Extract the first videoId from the page
    const videoIdMatch = html.match(/"videoId":"([A-Za-z0-9_-]{11})"/);
    if (!videoIdMatch) {
      throw new Error("Could not find video ID on channel page");
    }

    const videoId = videoIdMatch[1];

    // Step 2: Use YouTube oEmbed (free, no API key) to get metadata
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedRes = await fetch(oembedUrl, {
      next: { revalidate: 3600 },
    });

    if (!oembedRes.ok) {
      throw new Error(`oEmbed fetch failed: ${oembedRes.status}`);
    }

    const oembed = await oembedRes.json();

    const data: SermonData = {
      videoId,
      title: oembed.title || "Latest Message",
      thumbnail:
        oembed.thumbnail_url ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      channelName: oembed.author_name || "180 Life Church",
      channelUrl:
        oembed.author_url || `https://www.youtube.com/@${CHANNEL_HANDLE}`,
    };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Failed to fetch latest sermon:", error);

    // Return a graceful fallback
    return NextResponse.json(
      {
        videoId: null,
        title: "Latest Message",
        thumbnail: null,
        channelName: "180 Life Church",
        channelUrl: `https://www.youtube.com/@${CHANNEL_HANDLE}`,
      },
      { status: 200 }
    );
  }
}
