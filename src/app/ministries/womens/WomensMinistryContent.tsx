"use client";

import { FadeIn } from "@/components/FadeIn";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Calendar,
  MapPin,
  Mail,
  Heart,
  BookOpen,
  Users,
  Flower2,
  ChevronRight,
} from "lucide-react";

/* --- brand palette: warm blush / rose tones --- */
const ROSE = "#C77D8A";
const ROSE_LIGHT = "#D99BA5";
const BLUSH = "#F5E6E8";
const WARM_CREAM = "#FDF8F6";
const DARK = "#2A2024";
const DARK_MID = "#352830";

/* --- page data (will come from WP later) --- */
const data = {
  title: "Women's Ministry",
  subtitle:
    "We seek to connect, encourage, and equip women to pursue a deep, transforming relationship with Christ.",
  verse: {
    text: "She is clothed with strength and dignity; she can laugh at the days to come.",
    ref: "Proverbs 31:25",
  },
  description: [
    "The women of our church seek to connect, encourage, and equip each other to pursue a deep, transforming relationship with Christ through Word study, authentic relationships, and ministry engagement.",
    "We have Life Groups specifically for women that meet throughout the week, providing spaces for spiritual growth, prayer, and genuine fellowship.",
    "Our Pray & Play program is designed for moms with young children, offering a chance to connect and grow together while little ones are cared for.",
  ],
  retreats:
    "We hold retreats each spring and fall, including our annual September retreat at Camp Berea in New Hampshire, where women can step away from the busyness of life to rest and be renewed.",
  pillars: [
    {
      icon: BookOpen,
      label: "Rooted in the Word",
      desc: "Studying Scripture together and growing in truth.",
    },
    {
      icon: Users,
      label: "Authentic Community",
      desc: "Real relationships built on trust and encouragement.",
    },
    {
      icon: Heart,
      label: "Serving with Love",
      desc: "Using our gifts to care for each other and our neighbors.",
    },
    {
      icon: Flower2,
      label: "Renewed and Refreshed",
      desc: "Retreats and gatherings that restore the soul.",
    },
  ],
  schedule: [
    {
      day: "Various Days",
      time: "Throughout the Week",
      location: "Life Groups and Events",
    },
  ],
  contactEmail: "women@180lifechurch.org",
};

export function WomensMinistryContent() {
  return (
    <>
      {/* ===================================================
          HERO -- soft, warm with botanical accents
         =================================================== */}
      <section
        className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, rgba(199,125,138,0.15) 0%, transparent 55%), linear-gradient(to bottom, ${DARK} 0%, ${DARK_MID} 100%)`,
        }}
      >
        {/* Soft floral watermark pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
            <circle cx="200" cy="150" r="120" stroke="white" strokeWidth="0.5" opacity="0.5" />
            <circle cx="200" cy="150" r="80" stroke="white" strokeWidth="0.3" opacity="0.3" />
            <circle cx="600" cy="400" r="100" stroke="white" strokeWidth="0.5" opacity="0.5" />
            <circle cx="600" cy="400" r="60" stroke="white" strokeWidth="0.3" opacity="0.3" />
            <circle cx="700" cy="100" r="50" stroke="white" strokeWidth="0.3" opacity="0.3" />
            <circle cx="100" cy="450" r="70" stroke="white" strokeWidth="0.3" opacity="0.3" />
            <path d="M350 300 Q400 200 450 300 Q500 200 550 300" stroke="white" strokeWidth="0.5" opacity="0.4" fill="none" />
            <path d="M300 350 Q400 250 500 350" stroke="white" strokeWidth="0.3" opacity="0.3" fill="none" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <Breadcrumb
              items={[
                { label: "Ministries", href: "/ministries" },
                { label: "Women's Ministry", href: "#" },
              ]}
            />
          </FadeIn>

          {/* Decorative icon */}
          <FadeIn delay={0.1}>
            <div className="flex justify-center mt-6 mb-6">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${ROSE}30, ${ROSE}15)`,
                  border: `1.5px solid ${ROSE}40`,
                  boxShadow: `0 0 40px ${ROSE}20`,
                }}
              >
                <Flower2 size={36} style={{ color: ROSE_LIGHT }} className="sm:w-11 sm:h-11" />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-wide mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Women&apos;s{" "}
              <span style={{ color: ROSE_LIGHT }}>Ministry</span>
            </h1>
          </FadeIn>

          {/* Scripture inline */}
          <FadeIn delay={0.2}>
            <blockquote className="max-w-2xl mx-auto mb-6">
              <p
                className="text-base sm:text-lg text-white/60 italic leading-relaxed"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                &ldquo;{data.verse.text}&rdquo;
              </p>
              <cite
                className="not-italic text-xs font-semibold uppercase tracking-widest mt-2 block"
                style={{ color: ROSE_LIGHT }}
              >
                &mdash; {data.verse.ref}
              </cite>
            </blockquote>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p className="text-white/40 text-base max-w-xl mx-auto leading-relaxed">
              {data.subtitle}
            </p>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={0.35}>
            <a
              href={`mailto:${data.contactEmail}`}
              className="inline-flex items-center gap-2 mt-10 px-10 py-4 font-bold text-white rounded-full transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${ROSE}, ${ROSE_LIGHT})`,
                boxShadow: `0 8px 32px ${ROSE}40`,
              }}
            >
              Get Connected
              <ChevronRight size={18} />
            </a>
          </FadeIn>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: `linear-gradient(to bottom, transparent, ${WARM_CREAM})`,
          }}
        />
      </section>

      {/* ===================================================
          FOUR PILLARS -- soft cards on warm cream
         =================================================== */}
      <section
        className="py-16 sm:py-24"
        style={{ backgroundColor: WARM_CREAM }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] text-center mb-3"
              style={{ color: ROSE }}
            >
              What We Value
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-center mb-14"
              style={{
                fontFamily: "var(--font-playfair)",
                color: DARK,
              }}
            >
              Pillars of Our{" "}
              <span style={{ color: ROSE }}>Community</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.pillars.map((pillar, i) => (
              <FadeIn key={pillar.label} delay={i * 0.1}>
                <div
                  className="group relative text-center p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: "white",
                    borderColor: `${ROSE}18`,
                    boxShadow: `0 2px 20px ${ROSE}08`,
                  }}
                >
                  {/* Soft glow behind icon on hover */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${BLUSH}, white)`,
                      border: `1px solid ${ROSE}20`,
                    }}
                  >
                    <pillar.icon size={24} style={{ color: ROSE }} />
                  </div>
                  <h3
                    className="font-bold text-base mb-2"
                    style={{
                      color: DARK,
                      fontFamily: "var(--font-playfair)",
                    }}
                  >
                    {pillar.label}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: `${DARK}90` }}
                  >
                    {pillar.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          ABOUT / DESCRIPTION -- split layout
         =================================================== */}
      <section
        className="py-16 sm:py-24"
        style={{ backgroundColor: "white" }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left -- text */}
            <div>
              <FadeIn>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.3em] mb-3"
                  style={{ color: ROSE }}
                >
                  Who We Are
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-bold mb-8"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    color: DARK,
                  }}
                >
                  Growing{" "}
                  <span style={{ color: ROSE }}>Together</span>
                </h2>
              </FadeIn>
              {data.description.map((p, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <p
                    className="leading-relaxed mb-5 text-lg"
                    style={{ color: `${DARK}80` }}
                  >
                    {p}
                  </p>
                </FadeIn>
              ))}
            </div>

            {/* Right -- retreats + schedule */}
            <div>
              <FadeIn delay={0.1}>
                <div
                  className="p-6 rounded-2xl border mb-6"
                  style={{
                    backgroundColor: WARM_CREAM,
                    borderColor: `${ROSE}15`,
                  }}
                >
                  <h3
                    className="font-bold uppercase tracking-wide mb-3"
                    style={{ color: DARK }}
                  >
                    Retreats and Gatherings
                  </h3>
                  <p
                    className="leading-relaxed text-sm"
                    style={{ color: `${DARK}70` }}
                  >
                    {data.retreats}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div
                  className="p-6 rounded-2xl border"
                  style={{
                    backgroundColor: WARM_CREAM,
                    borderColor: `${ROSE}15`,
                  }}
                >
                  <h3
                    className="font-bold uppercase tracking-wide mb-4"
                    style={{ color: DARK }}
                  >
                    When We Meet
                  </h3>
                  <div className="space-y-4">
                    {data.schedule.map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${ROSE}15` }}
                        >
                          <Calendar size={16} style={{ color: ROSE }} />
                        </div>
                        <div>
                          <p
                            className="font-semibold text-sm"
                            style={{ color: DARK }}
                          >
                            {s.day} &middot; {s.time}
                          </p>
                          {s.location && (
                            <p
                              className="text-sm flex items-center gap-1 mt-0.5"
                              style={{ color: `${DARK}60` }}
                            >
                              <MapPin size={12} /> {s.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          CONTACT CTA -- warm rose glow on dark
         =================================================== */}
      <section
        className="py-16 sm:py-24"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${ROSE}18 0%, transparent 60%), linear-gradient(to bottom, ${DARK_MID}, ${DARK})`,
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${ROSE}20` }}
            >
              <Mail size={24} style={{ color: ROSE_LIGHT }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Come as{" "}
              <span style={{ color: ROSE_LIGHT }}>You Are</span>
            </h2>
            <p className="text-white/50 mb-8 text-lg max-w-lg mx-auto">
              Whether you&apos;re looking for community, growth, or simply a
              place to belong, you&apos;re welcome here.
            </p>
            <a
              href={`mailto:${data.contactEmail}`}
              className="inline-flex items-center gap-2 px-10 py-4 text-white font-bold rounded-full transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${ROSE}, ${ROSE_LIGHT})`,
                boxShadow: `0 8px 32px ${ROSE}40`,
              }}
            >
              Email Us
              <Mail size={16} />
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
