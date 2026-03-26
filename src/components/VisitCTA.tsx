"use client";

import { FadeIn } from "./FadeIn";
import type { WPCTAData } from "@/lib/wordpress-types";

interface VisitCTAProps {
  cta: WPCTAData;
}

export function VisitCTA({ cta }: VisitCTAProps) {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 50%, rgba(212, 160, 84, 0.2) 0%, transparent 60%),
              linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)
            `,
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
            {cta.label}
          </span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-4 mb-6 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {cta.heading}
            <br />
            <span className="text-amber">{cta.headingAccent}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-white/60 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            {cta.body}
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={cta.primaryLink}
              className="px-8 py-4 bg-amber text-charcoal font-semibold rounded-full text-lg hover:bg-amber-light transition-all hover:shadow-xl hover:shadow-amber/20 hover:-translate-y-0.5"
            >
              {cta.primaryText}
            </a>
            <a
              href={cta.secondaryLink}
              className="px-8 py-4 text-white font-semibold rounded-full text-lg border-2 border-white/20 hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              {cta.secondaryText}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
