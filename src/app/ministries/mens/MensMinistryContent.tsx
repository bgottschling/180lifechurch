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
      desc: "Iron sharpening iron — stronger together.",
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
          HERO — dark, rugged, with SVG mountain landscape
         ═══════════════════════════════════════════════════ */}
      <section
        className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, rgba(196,30,42,0.10) 0%, transparent 55%), linear-gradient(to bottom, ${DARK} 0%, ${DARK_MID} 100%)`,
        }}
      >
        {/* SVG Mountain landscape — dramatic central peak */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            viewBox="0 0 1440 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 left-0 w-full h-full"
          >
            <defs>
              {/* Subtle red glow for ridgelines */}
              <linearGradient id="ridgeGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={RED} stopOpacity="0.2" />
                <stop offset="100%" stopColor={RED} stopOpacity="0" />
              </linearGradient>
              {/* Atmospheric haze */}
              <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#111111" stopOpacity="0" />
                <stop offset="100%" stopColor="#111111" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Far distant range — faintest, atmospheric */}
            <path
              d="M0 580 L80 540 L180 560 L300 500 L400 530 L500 480 L580 510 L650 440 L700 380 L720 300 L740 380 L790 430 L860 470 L940 500 L1020 460 L1100 490 L1200 450 L1300 480 L1400 460 L1440 470 L1440 900 L0 900Z"
              fill="#1c1c1c"
              opacity="0.4"
            />
            <path
              d="M0 580 L80 540 L180 560 L300 500 L400 530 L500 480 L580 510 L650 440 L700 380 L720 300 L740 380 L790 430 L860 470 L940 500 L1020 460 L1100 490 L1200 450 L1300 480 L1400 460 L1440 470"
              stroke={RED}
              strokeWidth="1"
              opacity="0.06"
              fill="none"
            />

            {/* Mid-distant range — flanking peaks */}
            <path
              d="M0 640 L60 600 L140 620 L240 560 L340 530 L420 560 L500 500 L560 470 L620 420 L670 360 L700 310 L720 240 L740 310 L770 370 L820 420 L880 460 L960 500 L1040 530 L1100 500 L1180 540 L1240 510 L1320 540 L1400 530 L1440 540 L1440 900 L0 900Z"
              fill="#171717"
              opacity="0.6"
            />
            {/* Red ridgeline — mid range */}
            <path
              d="M0 640 L60 600 L140 620 L240 560 L340 530 L420 560 L500 500 L560 470 L620 420 L670 360 L700 310 L720 240 L740 310 L770 370 L820 420 L880 460 L960 500 L1040 530 L1100 500 L1180 540 L1240 510 L1320 540 L1400 530 L1440 540"
              stroke={RED}
              strokeWidth="1.2"
              opacity="0.10"
              fill="none"
            />

            {/* Primary central peak — the hero mountain */}
            <path
              d="M0 700 L100 660 L200 680 L320 620 L420 590 L500 550 L560 510 L620 460 L660 400 L690 340 L710 260 L720 180 L730 260 L750 340 L780 400 L820 460 L880 510 L940 550 L1020 590 L1100 620 L1200 650 L1300 670 L1400 660 L1440 670 L1440 900 L0 900Z"
              fill="#141414"
              opacity="0.85"
            />
            {/* Red ridgeline glow — primary peak */}
            <path
              d="M0 700 L100 660 L200 680 L320 620 L420 590 L500 550 L560 510 L620 460 L660 400 L690 340 L710 260 L720 180 L730 260 L750 340 L780 400 L820 460 L880 510 L940 550 L1020 590 L1100 620 L1200 650 L1300 670 L1400 660 L1440 670"
              stroke={RED}
              strokeWidth="1.5"
              opacity="0.18"
              fill="none"
            />
            {/* Snow cap / light highlight on central summit */}
            <path
              d="M710 260 L720 180 L730 260"
              stroke="white"
              strokeWidth="1"
              opacity="0.06"
              fill="none"
            />

            {/* Foreground ridge — nearest, darkest */}
            <path
              d="M0 780 L80 740 L180 760 L300 710 L400 730 L500 690 L600 710 L680 680 L720 660 L760 680 L840 710 L940 690 L1040 720 L1140 700 L1240 730 L1340 720 L1440 740 L1440 900 L0 900Z"
              fill="#0F0F0F"
              opacity="0.95"
            />
            <path
              d="M0 780 L80 740 L180 760 L300 710 L400 730 L500 690 L600 710 L680 680 L720 660 L760 680 L840 710 L940 690 L1040 720 L1140 700 L1240 730 L1340 720 L1440 740"
              stroke={RED}
              strokeWidth="1"
              opacity="0.08"
              fill="none"
            />

            {/* Base fill — seamless blend into page */}
            <path
              d="M0 830 L100 810 L250 820 L400 800 L550 815 L720 795 L890 810 L1050 800 L1200 815 L1350 805 L1440 810 L1440 900 L0 900Z"
              fill="#0D0D0D"
            />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <Breadcrumb
              items={[
                { label: "Ministries", href: "/ministries" },
                { label: "Men's Ministry", href: "#" },
              ]}
            />
          </FadeIn>

          {/* Logo badge — red/gray color version */}
          <FadeIn delay={0.1}>
            <div className="flex justify-center mt-6 mb-8">
              <Image
                src="/images/ministries/mens/logo-color.png"
                alt="180 Men Logo"
                width={200}
                height={200}
                className="w-32 sm:w-44 drop-shadow-[0_0_40px_rgba(196,30,42,0.35)]"
                priority
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-wider mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Men&apos;s{" "}
              <span style={{ color: RED }}>Ministry</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
              {data.subtitle}
            </p>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={0.3}>
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
          SCRIPTURE BANNER — full-width dark band
         ═══════════════════════════════════════════════════ */}
      <section
        className="relative py-16 sm:py-20 overflow-hidden"
        style={{ backgroundColor: DARK_MID }}
      >
        {/* Subtle red line accent at top */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${RED}40, transparent)`,
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <div
              className="text-6xl sm:text-8xl font-bold leading-none mb-4 opacity-20"
              style={{ color: RED, fontFamily: "var(--font-playfair)" }}
            >
              &ldquo;
            </div>
            <blockquote
              className="text-xl sm:text-2xl text-white/80 italic leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {data.verse.text}
            </blockquote>
            <p
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: RED }}
            >
              — {data.verse.ref}
            </p>
          </FadeIn>
        </div>

        {/* Bottom line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${RED}40, transparent)`,
          }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════
          FOUR PILLARS — from the stamp logo ring text
         ═══════════════════════════════════════════════════ */}
      <section className="bg-[#0D0D0D] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] text-center mb-3"
              style={{ color: RED }}
            >
              Our Foundation
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white text-center mb-14"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Four Pillars of{" "}
              <span style={{ color: RED }}>180 Men</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.pillars.map((pillar, i) => (
              <FadeIn key={pillar.label} delay={i * 0.1}>
                <div
                  className="group relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: DARK_MID,
                    borderColor: "rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${RED}50`;
                    e.currentTarget.style.boxShadow =
                      "0 8px 30px rgba(196, 30, 42, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.06)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${RED}15` }}
                  >
                    <pillar.icon size={22} style={{ color: RED }} />
                  </div>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-2">
                    {pillar.label}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ABOUT / DESCRIPTION — lighter dark section
         ═══════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24"
        style={{
          background: `linear-gradient(to bottom, ${DARK_MID}, #141414)`,
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left — text */}
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

            {/* Right — events + schedule */}
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
          CONTACT CTA — rugged red glow
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
              just a group of guys who get it — we&apos;d love to have you.
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
