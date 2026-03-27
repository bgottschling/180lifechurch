"use client";

import Image from "next/image";
import { FadeIn } from "./FadeIn";
import { Play, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface SermonData {
  videoId: string | null;
  title: string;
  thumbnail: string | null;
  channelName: string;
  channelUrl: string;
}

export function SermonBanner() {
  const [sermon, setSermon] = useState<SermonData | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetch("/api/latest-sermon")
      .then((res) => res.json())
      .then(setSermon)
      .catch(() => {
        // Fallback if API fails
        setSermon({
          videoId: null,
          title: "Latest Message",
          thumbnail: null,
          channelName: "180 Life Church",
          channelUrl: "https://www.youtube.com/@180lifechurch",
        });
      });
  }, []);

  return (
    <section id="watch" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Dark worship background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-worship.jpg"
          alt="Worship atmosphere"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-charcoal/80" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left video */}
          <FadeIn direction="left">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-charcoal-light border border-white/10 group">
              {playing && sermon?.videoId ? (
                /* YouTube iframe embed */
                <iframe
                  src={`https://www.youtube.com/embed/${sermon.videoId}?autoplay=1&rel=0`}
                  title={sermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                /* Thumbnail with play button */
                <button
                  onClick={() => sermon?.videoId && setPlaying(true)}
                  className="absolute inset-0 w-full h-full cursor-pointer"
                  aria-label={`Play ${sermon?.title || "latest sermon"}`}
                >
                  {/* Thumbnail image */}
                  {sermon?.thumbnail ? (
                    <Image
                      src={sermon.thumbnail}
                      alt={sermon.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-charcoal-light to-charcoal" />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-amber/90 flex items-center justify-center group-hover:bg-amber group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-amber/30">
                      <Play
                        className="text-charcoal ml-1"
                        size={32}
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                      Latest Message
                    </p>
                    <p className="text-white font-semibold text-lg">
                      {sermon?.title || (
                        <span className="inline-block h-5 w-48 bg-white/10 rounded animate-pulse" />
                      )}
                    </p>
                  </div>
                </button>
              )}
            </div>
          </FadeIn>

          {/* Right text */}
          <div>
            <FadeIn delay={0.1}>
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                Watch &amp; Listen
              </span>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h2
                className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Missed a Sunday?
                <br />
                <span className="text-amber">We&apos;ve Got You</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Life gets busy. Catch up on our latest messages and past sermon
                series whenever it works for you. You can also subscribe to the
                180 Life Church podcast on Apple Podcasts or Spotify.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <a
                  href={
                    sermon?.channelUrl ||
                    "https://www.youtube.com/@180lifechurch"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/20"
                >
                  Browse Messages
                  <ExternalLink size={16} />
                </a>
                <a
                  href="https://www.youtube.com/@180LifeChurch?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 text-white border border-white/20 font-semibold rounded-full hover:bg-white/10 transition-all"
                >
                  Subscribe on YouTube
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
