"use client";

import { FadeIn } from "@/components/FadeIn";
import { Breadcrumb } from "@/components/Breadcrumb";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Mail,
  Shield,
  Flame,
  Swords,
  Mountain,
  ChevronRight,
} from "lucide-react";

/* ─── brand reds pulled from the 180 MEN logo ─── */
const RED = "#C41E2A";
const RED_LIGHT = "#D9343F";
const DARK = "#111111";
const DARK_MID = "#1A1A1A";

/* ─── page data (will come from WP later) ─── */
const data = {
  title: "Men's Ministry",
  subtitle:
    "Equipping men of all ages and walks of life to live on mission as godly men and leaders in their homes, church, community, and world.",
  verse: {
    text: "Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love.",
    ref: "1 Corinthians 16:13-14",
  },
  description: [
    "Our church challenges, equips, and encourages men to love God and live lives that reflect His priorities and purposes at home, in our communities, and beyond.",
    "We have life groups specifically for men here at 180 Life Church. One meets on Monday nights from 7 to 8:30 PM online and the other meets Friday morning from 6 to 7:30 AM at our church building on Still Road in Bloomfield.",
  ],
  events:
    "Typical events each year include Men's Breakfast, Iron Sharpens Iron conference in March, a Summer BBQ, and a Fall Retreat.",
  schedule: [
    { day: "Monday", time: "7:00 – 8:30 PM", location: "Online" },
    {
      day: "Friday",
      time: "6:00 – 7:30 AM",
      location: "180 Still Road, Bloomfield",
    },
  ],
  pillars: [
    {
      icon: Shield,
      label: "Stand Firm",
      desc: "Rooted in God's Word, unwavering in faith.",
    },
    {
      icon: Flame,
      label: "Take Courage",
      desc: "Bold action in the face of adversity.",
    },
    {
      icon: Swords,
      label: "Be Strong",
      desc: "Iron sharpening iron, stronger together.",
    },
    {
      icon: Mountain,
      label: "Prepare",
      desc: "Equipped to lead at home, church & beyond.",
    },
  ],
  contactEmail: "info@180lifechurch.org",
};

export function MensMinistryContent() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO - dark, rugged, with SVG mountain landscape
         ═══════════════════════════════════════════════════ */}
      <section
        className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, rgba(196,30,42,0.10) 0%, transparent 55%), linear-gradient(to bottom, ${DARK} 0%, ${DARK_MID} 100%)`,
        }}
      >
        {/* SVG Mountain landscape - external hand-drawn SVG */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "url(/images/ministries/mens/mountains-dark.svg)",
            backgroundPosition: "center bottom",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <Breadcrumb
              items={[
                { label: "Ministries", href: "/ministries" },
                { label: "Men's Ministry", href: "#" },
              ]}
            />
          </FadeIn>

          {/* Logo badge - red/gray color version */}
          <FadeIn delay={0.1}>
            <div className="flex justify-center mt-6 mb-8">
              <Image
                src="/images/ministries/mens/logo-color-hd.png"
                alt="180 Men Logo"
                width={1000}
                height={1250}
                className="w-44 sm:w-60 lg:w-72 drop-shadow-[0_0_50px_rgba(196,30,42,0.4)]"
                priority
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-wider mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Men&apos;s{" "}
              <span style={{ color: RED }}>Ministry</span>
            </h1>
          </FadeIn>

          {/* Scripture - inline between title and subtitle */}
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
                style={{ color: RED }}
              >
                - {data.verse.ref}
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
                backgroundColor: RED,
                boxShadow: "0 8px 32px rgba(196, 30, 42, 0.3)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = RED_LIGHT)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = RED)
              }
            >
              Get Connected
              <ChevronRight size={18} />
            </a>
          </FadeIn>
        </div>

        {/* Bottom fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: `linear-gradient(to bottom, transparent, ${DARK_MID})`,
          }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════
          FOUR PILLARS - Greek column / pillar design
         ═══════════════════════════════════════════════════ */}
      <section className="bg-[#0D0D0D] py-16 sm:py-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] text-center mb-3"
              style={{ color: RED }}
            >
              Our Foundation
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white text-center mb-16"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Four Pillars of{" "}
              <span style={{ color: RED }}>180 Men</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {data.pillars.map((pillar, i) => (
              <FadeIn key={pillar.label} delay={i * 0.12}>
                <div className="group flex flex-col items-center text-center transition-transform duration-500 hover:-translate-y-2">
                  {/* ── Capital (top ornament) ── */}
                  <div className="relative w-full flex justify-center">
                    {/* Volute scrolls */}
                    <svg viewBox="0 0 120 24" className="w-28 h-6 mb-0" fill="none">
                      <path
                        d="M10 20 C10 10, 20 4, 30 4 L90 4 C100 4, 110 10, 110 20"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path
                        d="M4 22 C4 8, 18 0, 32 0 L88 0 C102 0, 116 8, 116 22"
                        stroke={`${RED}30`}
                        strokeWidth="0.5"
                        fill="none"
                      />
                    </svg>
                  </div>

                  {/* ── Capital plate ── */}
                  <div
                    className="w-full py-3 flex justify-center"
                    style={{
                      background: `linear-gradient(to bottom, ${RED}12, transparent)`,
                      borderTop: `2px solid ${RED}35`,
                    }}
                  >
                    <pillar.icon
                      size={26}
                      style={{ color: RED }}
                      className="drop-shadow-[0_0_8px_rgba(196,30,42,0.3)]"
                    />
                  </div>

                  {/* ── Column shaft ── */}
                  <div
                    className="relative w-full flex-1 px-5 py-6 flex flex-col items-center justify-center"
                    style={{
                      background: `linear-gradient(to bottom, ${DARK_MID}, #151515)`,
                      borderLeft: "1px solid rgba(255,255,255,0.05)",
                      borderRight: "1px solid rgba(255,255,255,0.05)",
                      minHeight: "140px",
                    }}
                  >
                    {/* Fluting lines (column grooves) */}
                    <div
                      className="absolute inset-0 opacity-[0.03] pointer-events-none"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to right, transparent, transparent 8px, rgba(255,255,255,0.5) 8px, rgba(255,255,255,0.5) 9px)",
                      }}
                    />

                    <h3
                      className="relative text-white font-bold text-base sm:text-lg uppercase tracking-[0.15em] mb-3"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {pillar.label}
                    </h3>
                    <p className="relative text-white/40 text-sm leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  {/* ── Base (bottom ornament) ── */}
                  <div
                    className="w-full py-2"
                    style={{
                      borderBottom: `2px solid ${RED}35`,
                      background: `linear-gradient(to top, ${RED}08, transparent)`,
                    }}
                  />
                  <div
                    className="w-[110%] h-1 rounded-b-sm"
                    style={{
                      background: `linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)`,
                    }}
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ABOUT / DESCRIPTION - lighter dark section
         ═══════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24"
        style={{
          background: `linear-gradient(to bottom, ${DARK_MID}, #141414)`,
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left - text */}
            <div>
              <FadeIn>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.3em] mb-3"
                  style={{ color: RED }}
                >
                  Who We Are
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-bold text-white mb-8"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Built for{" "}
                  <span style={{ color: RED }}>Brotherhood</span>
                </h2>
              </FadeIn>
              {data.description.map((p, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <p className="text-white/60 leading-relaxed mb-5 text-lg">
                    {p}
                  </p>
                </FadeIn>
              ))}
            </div>

            {/* Right - events + schedule */}
            <div>
              <FadeIn delay={0.1}>
                <div
                  className="p-6 rounded-2xl border mb-6"
                  style={{
                    backgroundColor: DARK,
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <h3 className="text-white font-bold uppercase tracking-wide mb-3">
                    Annual Events
                  </h3>
                  <p className="text-white/50 leading-relaxed text-sm">
                    {data.events}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div
                  className="p-6 rounded-2xl border"
                  style={{
                    backgroundColor: DARK,
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                >
                  <h3 className="text-white font-bold uppercase tracking-wide mb-4">
                    When We Meet
                  </h3>
                  <div className="space-y-4">
                    {data.schedule.map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${RED}15` }}
                        >
                          <Calendar size={16} style={{ color: RED }} />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">
                            {s.day} · {s.time}
                          </p>
                          <p className="text-white/40 text-sm flex items-center gap-1 mt-0.5">
                            <MapPin size={12} /> {s.location}
                          </p>
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

      {/* ═══════════════════════════════════════════════════
          CONTACT CTA - rugged red glow
         ═══════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(196,30,42,0.10) 0%, transparent 60%), linear-gradient(to bottom, #141414, ${DARK})`,
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${RED}15` }}
            >
              <Mail size={24} style={{ color: RED }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Ready to{" "}
              <span style={{ color: RED }}>Join Us?</span>
            </h2>
            <p className="text-white/50 mb-8 text-lg max-w-lg mx-auto">
              Whether you&apos;re looking for accountability, community, or
              just a group of guys who get it. We&apos;d love to have you.
            </p>
            <a
              href={`mailto:${data.contactEmail}`}
              className="inline-flex items-center gap-2 px-10 py-4 text-white font-bold rounded-full transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: RED,
                boxShadow: "0 8px 32px rgba(196, 30, 42, 0.3)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = RED_LIGHT)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = RED)
              }
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
