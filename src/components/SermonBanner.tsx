"use client";

import Image from "next/image";
import { FadeIn } from "./FadeIn";
import { Play } from "lucide-react";

export function SermonBanner() {
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
          {/* Left video placeholder */}
          <FadeIn direction="left">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-charcoal-light border border-white/10 group cursor-pointer">
              {/* Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-charcoal-light to-charcoal">
                <div className="w-20 h-20 rounded-full bg-amber/20 flex items-center justify-center group-hover:bg-amber/30 transition-all group-hover:scale-110">
                  <Play className="text-amber ml-1" size={32} />
                </div>
              </div>
              {/* Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                  Latest Message
                </p>
                <p className="text-white font-semibold text-lg">
                  180 Life Church Podcast
                </p>
              </div>
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
                  href="#sermons"
                  className="inline-flex items-center px-6 py-3 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/20"
                >
                  Browse Messages
                </a>
                <a
                  href="#subscribe"
                  className="inline-flex items-center px-6 py-3 text-white border border-white/20 font-semibold rounded-full hover:bg-white/10 transition-all"
                >
                  Subscribe to Podcast
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
