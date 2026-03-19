"use client";

import { FadeIn } from "./FadeIn";

export function VisitCTA() {
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
            Take the Next Step
          </span>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-4 mb-6 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your Story
            <br />
            <span className="text-amber">Starts Here</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-white/60 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            No matter where you&apos;ve been or what you&apos;ve been through,
            there&apos;s a seat saved for you. Come as you are.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#visit-form"
              className="px-8 py-4 bg-amber text-charcoal font-semibold rounded-full text-lg hover:bg-amber-light transition-all hover:shadow-xl hover:shadow-amber/20 hover:-translate-y-0.5"
            >
              I&apos;m New — What to Expect
            </a>
            <a
              href="#contact"
              className="px-8 py-4 text-white font-semibold rounded-full text-lg border-2 border-white/20 hover:bg-white/10 transition-all hover:-translate-y-0.5"
            >
              Contact Us
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
