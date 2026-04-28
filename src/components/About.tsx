"use client";

import Image from "next/image";
import { FadeIn } from "./FadeIn";
import type { WPAboutData } from "@/lib/wordpress-types";

interface AboutProps {
  about: WPAboutData;
}

export function About({ about }: AboutProps) {
  const isRemoteImage = about.image.startsWith("http");

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-soft-white">
      {/* Subtle warm accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <div>
            <FadeIn>
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                {about.label}
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2
                className="text-4xl sm:text-5xl font-bold text-charcoal mt-4 mb-6 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {about.heading}
                <br />
                <span className="text-amber-dark">{about.headingAccent}</span>
              </h2>
            </FadeIn>
            {about.body.map((paragraph, i) => (
              <FadeIn key={i} delay={0.2 + i * 0.1}>
                <p className="text-warm-gray-light text-lg leading-relaxed mb-6">
                  {paragraph}
                </p>
              </FadeIn>
            ))}
            <FadeIn delay={0.2 + about.body.length * 0.1}>
              <a
                href={about.linkUrl}
                className="inline-flex items-center text-amber-dark font-semibold hover:text-amber transition-colors group"
              >
                {about.linkText}
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </FadeIn>
          </div>

          {/* Right image */}
          <FadeIn direction="right" delay={0.2}>
            <div className="relative">
              {/*
                aspect-[4/3] container is GPU-promoted so framer-motion's
                transform animation doesn't reveal sub-pixel artifacts at
                the rounded corners. No background color on the wrapper —
                the image fills it edge to edge, and any temporary
                rendering gap reveals the section background instead of
                a contrasting cream sliver.
              */}
              <div
                className="aspect-[4/3] rounded-2xl overflow-hidden transform-gpu"
                style={{ backfaceVisibility: "hidden", willChange: "transform" }}
              >
                <Image
                  src={about.image}
                  alt="Community at 180 Life Church"
                  fill
                  className="object-cover"
                  {...(isRemoteImage ? { unoptimized: true } : {})}
                />
              </div>
              {/* Decorative accents — intentionally muted, behind image */}
              <div
                aria-hidden
                className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber/15 rounded-2xl -z-10 transform-gpu"
              />
              <div
                aria-hidden
                className="absolute -top-4 -left-4 w-24 h-24 bg-teal/15 rounded-2xl -z-10 transform-gpu"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
