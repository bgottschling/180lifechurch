"use client";

import { FadeIn } from "@/components/FadeIn";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Calendar,
  MapPin,
  Mail,
  Zap,
  Users,
  BookOpen,
  Compass,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

/* ─── bold electric palette for youth energy ─── */
const BLUE = "#4F46E5";
const BLUE_LIGHT = "#818CF8";
const CYAN = "#06B6D4";
const DARK = "#0F0F1A";
const DARK_MID = "#161625";
const SURFACE = "#1C1C2E";

/* ─── page data ─── */
const data = {
  title: "Student Ministry",
  subtitle:
    "A Christ-centered community for middle school and high school students to grow, connect, and find their place in God's story.",
  verse: {
    text: "Don't let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.",
    ref: "1 Timothy 4:12",
  },
  description: [
    "Our Student Ministry (Grades 6 through 12) partners with Wintonbury Church and their NextGen Youth Ministry. Our goal is to provide a safe place where students can feel comfortable sharing challenges during their teen years, help prepare them for their future by digging deeper into God's Word, and build relationships with trusted leaders.",
    "Both Middle School and High School groups meet weekly and separately on two different days of the week. On Sunday mornings, students enjoy live worship in the adult service before connecting with small group leaders for lessons and activities.",
    "We also have outings, service projects, retreats, and trips throughout the year. We are currently looking for additional leaders. If serving, inspiring, and encouraging the next generation to follow God is something God has put on your heart, please contact Chip to learn how you can be a part of 180 Life Students.",
  ],
  highlights: [
    {
      icon: BookOpen,
      label: "Grounded in Truth",
      desc: "Weekly small groups digging into Scripture and real-life application.",
    },
    {
      icon: Users,
      label: "Real Community",
      desc: "A safe place to be yourself, ask hard questions, and find lifelong friends.",
    },
    {
      icon: Compass,
      label: "Adventures Together",
      desc: "Retreats, service projects, outings, and trips that build lasting memories.",
    },
    {
      icon: Zap,
      label: "Next-Gen Leaders",
      desc: "Equipping students to lead with courage in their schools, homes, and beyond.",
    },
  ],
  groups: [
    {
      label: "Middle School",
      grades: "Grades 6 through 8",
      day: "Friday",
      time: "6:30 to 8:30 PM",
    },
    {
      label: "High School",
      grades: "Grades 9 through 12",
      day: "Sunday",
      time: "5:30 to 8:00 PM",
    },
  ],
  sundayMorning: {
    time: "9:00 AM and 11:00 AM",
    note: "Students join the adult worship service, then break into small groups with dedicated leaders for lessons and activities.",
  },
  contactName: "Chip",
  contactEmail: "chip@180lifechurch.org",
};

export function StudentsMinistryContent() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO
         ═══════════════════════════════════════════════════ */}
      <section
        className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, rgba(79,70,229,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.10) 0%, transparent 40%), linear-gradient(to bottom, ${DARK} 0%, ${DARK_MID} 100%)`,
        }}
      >
        {/* Geometric grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
            {/* Grid dots */}
            {Array.from({ length: 12 }).map((_, row) =>
              Array.from({ length: 16 }).map((_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={25 + col * 50}
                  cy={25 + row * 50}
                  r="1.5"
                  fill="white"
                  opacity={0.6}
                />
              ))
            )}
            {/* Accent lines */}
            <line x1="100" y1="0" x2="400" y2="600" stroke="white" strokeWidth="0.5" opacity="0.3" />
            <line x1="700" y1="0" x2="400" y2="600" stroke="white" strokeWidth="0.5" opacity="0.3" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <Breadcrumb
              items={[
                { label: "Ministries", href: "/ministries" },
                { label: "Student Ministry", href: "#" },
              ]}
            />
          </FadeIn>

          {/* Icon badge */}
          <FadeIn delay={0.1}>
            <div className="flex justify-center mt-6 mb-6">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center rotate-3"
                style={{
                  background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`,
                  boxShadow: `0 0 50px ${BLUE}40, 0 0 100px ${CYAN}15`,
                }}
              >
                <Zap size={36} className="text-white sm:w-11 sm:h-11" />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-wider mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Student{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${BLUE_LIGHT}, ${CYAN})`,
                }}
              >
                Ministry
              </span>
            </h1>
          </FadeIn>

          {/* Scripture */}
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
                style={{ color: BLUE_LIGHT }}
              >
                {data.verse.ref}
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
                background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`,
                boxShadow: `0 8px 32px ${BLUE}40`,
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
            background: `linear-gradient(to bottom, transparent, ${DARK_MID})`,
          }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════
          HIGHLIGHTS — four value cards with gradient borders
         ═══════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24"
        style={{ backgroundColor: DARK_MID }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] text-center mb-3"
              style={{ color: CYAN }}
            >
              What Makes Us Different
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white text-center mb-14"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Built for the{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${BLUE_LIGHT}, ${CYAN})`,
                }}
              >
                Next Generation
              </span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.highlights.map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.1}>
                <div
                  className="group relative rounded-2xl p-[1px] h-full transition-all duration-500 hover:-translate-y-1.5"
                  style={{
                    boxShadow: `0 0 0 rgba(79,70,229,0)`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = `0 8px 40px ${BLUE}30, 0 0 20px ${CYAN}15`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = `0 0 0 rgba(79,70,229,0)`)
                  }
                >
                  {/* Gradient border */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`,
                    }}
                  />
                  {/* Card body — fixed height, flex column for pinned layout */}
                  <div
                    className="relative rounded-2xl p-6 h-full min-h-[220px] flex flex-col"
                    style={{ backgroundColor: SURFACE }}
                  >
                    {/* Top: icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-auto transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${BLUE}25, ${CYAN}15)`,
                      }}
                    >
                      <item.icon size={22} style={{ color: BLUE_LIGHT }} />
                    </div>
                    {/* Bottom: title + desc pinned together */}
                    <div className="mt-5">
                      <h3
                        className="text-white font-bold text-base mb-2"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {item.label}
                      </h3>
                      <p className="text-white/45 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GROUPS — Middle School + High School split cards
         ═══════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24"
        style={{
          background: `linear-gradient(to bottom, ${DARK_MID}, ${DARK})`,
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] text-center mb-3"
              style={{ color: BLUE_LIGHT }}
            >
              Weekly Gatherings
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white text-center mb-12"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              When We{" "}
              <span style={{ color: CYAN }}>Meet</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {data.groups.map((g, i) => (
              <FadeIn key={g.label} delay={i * 0.12}>
                <div
                  className="relative rounded-2xl overflow-hidden p-6 sm:p-8 border transition-all duration-300 hover:border-opacity-40"
                  style={{
                    backgroundColor: SURFACE,
                    borderColor: i === 0 ? `${BLUE}20` : `${CYAN}20`,
                  }}
                >
                  {/* Accent glow */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{
                      background: i === 0
                        ? `linear-gradient(to right, ${BLUE}, ${BLUE_LIGHT})`
                        : `linear-gradient(to right, ${CYAN}, ${BLUE_LIGHT})`,
                    }}
                  />
                  <span
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-1 block"
                    style={{ color: i === 0 ? BLUE_LIGHT : CYAN }}
                  >
                    {g.grades}
                  </span>
                  <h3
                    className="text-white text-2xl font-bold mb-5"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {g.label}
                  </h3>
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: i === 0 ? `${BLUE}15` : `${CYAN}15` }}
                    >
                      <Calendar size={16} style={{ color: i === 0 ? BLUE_LIGHT : CYAN }} />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {g.day}
                      </p>
                      <p className="text-white/50 text-sm">{g.time}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Sunday morning callout */}
          <FadeIn delay={0.25}>
            <div
              className="rounded-2xl p-6 border text-center"
              style={{
                backgroundColor: SURFACE,
                borderColor: `${BLUE}12`,
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar size={16} style={{ color: BLUE_LIGHT }} />
                <span
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: BLUE_LIGHT }}
                >
                  Sunday Mornings
                </span>
              </div>
              <p className="text-white font-semibold mb-1">
                {data.sundayMorning.time}
              </p>
              <p className="text-white/45 text-sm max-w-lg mx-auto leading-relaxed">
                {data.sundayMorning.note}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ABOUT / DESCRIPTION
         ═══════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24"
        style={{ backgroundColor: DARK }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] mb-3"
              style={{ color: CYAN }}
            >
              Who We Are
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-8"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Partnering for the{" "}
              <span style={{ color: BLUE_LIGHT }}>Future</span>
            </h2>
          </FadeIn>
          {data.description.map((p, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <p className="text-white/55 leading-relaxed mb-5 text-lg">
                {p}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CONTACT CTA
         ═══════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${BLUE}14 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, ${CYAN}08 0%, transparent 40%), linear-gradient(to bottom, ${DARK}, ${DARK_MID})`,
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{
                background: `linear-gradient(135deg, ${BLUE}20, ${CYAN}15)`,
              }}
            >
              <Mail size={24} style={{ color: BLUE_LIGHT }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Ready to{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${BLUE_LIGHT}, ${CYAN})`,
                }}
              >
                Jump In?
              </span>
            </h2>
            <p className="text-white/50 mb-8 text-lg max-w-lg mx-auto">
              Whether your student is looking for community, Christ-centered
              friendships, or a place to grow, we would love to meet them.
              Reach out to {data.contactName} to learn more.
            </p>
            <a
              href={`mailto:${data.contactEmail}`}
              className="inline-flex items-center gap-2 px-10 py-4 text-white font-bold rounded-full transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`,
                boxShadow: `0 8px 32px ${BLUE}40`,
              }}
            >
              Email {data.contactName}
              <Mail size={16} />
            </a>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
