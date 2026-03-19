"use client";

import { FadeIn } from "./FadeIn";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32 bg-soft-white">
      {/* Subtle warm accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <FadeIn>
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                Our Heart
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2
                className="text-4xl sm:text-5xl font-bold text-charcoal mt-4 mb-6 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                A Place Where
                <br />
                <span className="text-amber-dark">You Belong</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-warm-gray-light text-lg leading-relaxed mb-6">
                At 180 Life Church, we believe that everyone deserves a place to
                call home. Whether you&apos;re exploring faith for the first
                time or looking for a new church family, you&apos;ll find open
                doors and open hearts here.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="text-warm-gray-light text-lg leading-relaxed mb-8">
                Our name reflects our mission — a 180-degree turn toward hope,
                purpose, and community. We&apos;re a diverse, multi-generational
                church in Bloomfield, CT, passionate about seeing lives
                transformed.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <a
                href="#about-more"
                className="inline-flex items-center text-amber-dark font-semibold hover:text-amber transition-colors group"
              >
                Learn More About Us
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </FadeIn>
          </div>

          {/* Right — image placeholder */}
          <FadeIn direction="right" delay={0.2}>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-cream-dark">
                {/* Placeholder for community photo */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-dark to-cream">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber/20 flex items-center justify-center">
                      <span className="text-3xl text-amber-dark">&#9829;</span>
                    </div>
                    <p className="text-warm-gray-light text-sm">
                      Community photo placeholder
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal/10 rounded-2xl -z-10" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
