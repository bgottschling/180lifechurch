"use client";

import { FadeIn } from "@/components/FadeIn";
import { Breadcrumb } from "@/components/Breadcrumb";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Mail,
  Heart,
  ShieldCheck,
  Sun,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Video,
  FolderOpen,
  ClipboardCheck,
  Music,
  BookOpen,
  HandHeart,
  ArrowRight,
  Baby,
  GraduationCap,
  School,
  Users,
} from "lucide-react";

/* ─── warm, playful sunshine palette ─── */
const ORANGE = "#F59E0B";
const ORANGE_LIGHT = "#FBBF24";
const CORAL = "#FB923C";
const WARM = "#FFF7ED";
const CREAM = "#FFFBF5";
const DARK = "#1A1207";
const DARK_MID = "#231A0E";
const SURFACE = "#2A2010";

/* ─── page data ─── */
const data = {
  title: "Kids Ministry",
  subtitle:
    "Partnering with parents and caregivers to help lead their children into a relationship with Jesus and to grow in their faith.",
  verse: {
    text: "Start children off on the way they should go, and even when they are old they will not turn from it.",
    ref: "Proverbs 22:6",
  },
  description: [
    "Since no one has more potential to influence a child's relationship with God than his or her caretakers, we want to support you as you integrate Biblical truths into your children's everyday lives.",
    "Our Sunday programming (Nursery through 5th Grade) is offered during both our 9 AM and 11 AM services and is designed specifically to reinforce truths about God in meaningful, developmentally appropriate ways for your child. Middle School (6th through 8th grade) programming is offered during our 11 AM service only.",
  ],
  safety:
    "Safety is our top priority. We perform a complete background check on anyone who serves with our children and youth. Serving teammates are trained on the policies in place to keep kids safe from check-in to check-out. Each child receives a name tag with a unique alphanumeric code that is changed each week to ensure we can contact families during service and children are returned to their rightful guardians.",
  values: [
    {
      icon: Sun,
      label: "Faith-Filled Fun",
      desc: "Age-appropriate experiences that make learning about God exciting and memorable.",
      image: "/images/ministries/kids/faith-fun.jpg",
    },
    {
      icon: Heart,
      label: "Family Partnership",
      desc: "Walking alongside parents to nurture faith at home and at church.",
      image: "/images/ministries/kids/family.jpg",
    },
    {
      icon: ShieldCheck,
      label: "Safe and Secure",
      desc: "Background-checked volunteers, secure check-in, and trained teams every week.",
      image: "/images/ministries/kids/safety.jpg",
    },
    {
      icon: Sparkles,
      label: "Growing Together",
      desc: "Helping every child discover who God made them to be from the very start.",
      image: "/images/ministries/kids/growing.jpg",
    },
  ],
  timeline: [
    { icon: ClipboardCheck, label: "Check-In", desc: "Secure name tags and a warm welcome" },
    { icon: Music, label: "Worship", desc: "Singing and praising together" },
    { icon: BookOpen, label: "Lesson", desc: "Age-appropriate Bible teaching" },
    { icon: HandHeart, label: "Pick-Up", desc: "Safe code-matched checkout" },
  ],
  ageGroups: [
    {
      icon: Baby,
      label: "Nursery",
      ages: "Birth to 2 years",
      time: "9 AM and 11 AM",
      color: "#F472B6",
      bg: "#FDF2F8",
    },
    {
      icon: Sun,
      label: "Preschool",
      ages: "Ages 3 to 5",
      time: "9 AM and 11 AM",
      color: "#FB923C",
      bg: "#FFF7ED",
    },
    {
      icon: GraduationCap,
      label: "Elementary",
      ages: "Grades 1 through 5",
      time: "9 AM and 11 AM",
      color: "#34D399",
      bg: "#ECFDF5",
    },
    {
      icon: Users,
      label: "Middle School",
      ages: "Grades 6 through 8",
      time: "11 AM only",
      color: "#818CF8",
      bg: "#EEF2FF",
    },
  ],
  resources: [
    {
      icon: ExternalLink,
      label: "Child Dedication Form",
      href: "https://180life.churchcenter.com/people/forms/298308",
      desc: "Submit a child dedication request",
    },
    {
      icon: Video,
      label: "Kids Video Lessons",
      href: "https://www.youtube.com/channel/UCFBn8FidToPCTIE2F4FK_VQ",
      desc: "180 Kids lessons on YouTube",
    },
    {
      icon: FolderOpen,
      label: "Preschool Curriculum",
      href: "https://drive.google.com/drive/folders/1Y6Ju81CK_9uxhY5a0S7SJniMQvk1ooEh",
      desc: "Google Drive folder for preschool age group",
    },
    {
      icon: FolderOpen,
      label: "Elementary Curriculum",
      href: "https://drive.google.com/drive/folders/14BrOIECeTs3oDY0kO3ne3owUjwY2KAyf",
      desc: "Google Drive folder for elementary age group",
    },
    {
      icon: FolderOpen,
      label: "Middle School Curriculum",
      href: "https://drive.google.com/drive/folders/1Z4ktw7V6XGnX1uYVzLwGtONhW2FrBS3_",
      desc: "Google Drive folder for middle school age group",
    },
  ],
  contactEmail: "jennifer@180lifechurch.org",
  contactName: "Jennifer",
};

export function KidsMinistryContent() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO
         ═══════════════════════════════════════════════════ */}
      <section
        className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 40% 25%, rgba(251,191,36,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(251,146,60,0.10) 0%, transparent 40%), linear-gradient(to bottom, ${DARK} 0%, ${DARK_MID} 100%)`,
        }}
      >
        {/* Playful floating shapes */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
            <path d="M120 80 L124 92 L136 92 L126 100 L130 112 L120 104 L110 112 L114 100 L104 92 L116 92 Z" fill="white" opacity="0.6" />
            <path d="M680 120 L683 128 L691 128 L685 133 L687 141 L680 136 L673 141 L675 133 L669 128 L677 128 Z" fill="white" opacity="0.5" />
            <path d="M400 50 L403 58 L411 58 L405 63 L407 71 L400 66 L393 71 L395 63 L389 58 L397 58 Z" fill="white" opacity="0.4" />
            <circle cx="200" cy="400" r="40" stroke="white" strokeWidth="0.5" opacity="0.3" />
            <circle cx="600" cy="300" r="30" stroke="white" strokeWidth="0.5" opacity="0.3" />
            <path d="M0 500 Q100 470 200 500 Q300 530 400 500 Q500 470 600 500 Q700 530 800 500" stroke="white" strokeWidth="0.5" opacity="0.2" fill="none" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <Breadcrumb
              items={[
                { label: "Ministries", href: "/ministries" },
                { label: "Kids Ministry", href: "#" },
              ]}
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex justify-center mt-6 mb-6">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}35, ${CORAL}25)`,
                  border: `1.5px solid ${ORANGE}50`,
                  boxShadow: `0 0 50px ${ORANGE}25`,
                }}
              >
                <Sun size={36} style={{ color: ORANGE_LIGHT }} className="sm:w-11 sm:h-11" />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-wide mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Kids{" "}
              <span style={{ color: ORANGE_LIGHT }}>Ministry</span>
            </h1>
          </FadeIn>

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
                style={{ color: ORANGE_LIGHT }}
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

          <FadeIn delay={0.35}>
            <a
              href={`mailto:${data.contactEmail}`}
              className="inline-flex items-center gap-2 mt-10 px-10 py-4 font-bold text-white rounded-full transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${CORAL})`,
                boxShadow: `0 8px 32px ${ORANGE}40`,
              }}
            >
              Get Connected
              <ChevronRight size={18} />
            </a>
          </FadeIn>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: `linear-gradient(to bottom, transparent, ${WARM})`,
          }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════
          VALUES — photo-backed cards (like women's ministry)
         ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: WARM }}>
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] text-center mb-3"
              style={{ color: CORAL }}
            >
              What We Believe
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-center mb-14"
              style={{
                fontFamily: "var(--font-playfair)",
                color: DARK,
              }}
            >
              A Place Where Kids{" "}
              <span style={{ color: ORANGE }}>Shine</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.values.map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.1}>
                <div className="group relative rounded-2xl overflow-hidden h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-orange-900/10">
                  {/* Photo background */}
                  <div className="relative aspect-[3/4] flex flex-col">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Warm light overlay */}
                    <div
                      className="absolute inset-0 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.20) 0%, transparent 50%), linear-gradient(to top, ${DARK}ee 0%, ${DARK}90 40%, transparent 65%)`,
                      }}
                    />

                    {/* Icon badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: `${ORANGE}30`,
                          border: `1px solid ${ORANGE}50`,
                        }}
                      >
                        <item.icon size={18} className="text-white" />
                      </div>
                    </div>

                    {/* Content pinned flush to bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 pb-6 z-10">
                      <h3
                        className="text-white font-bold text-lg leading-tight mb-1"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {item.label}
                      </h3>
                      <p className="text-white/60 text-sm leading-snug group-hover:text-white/80 transition-colors duration-300">
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
          WHAT TO EXPECT — proper timeline
         ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: "white" }}>
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] text-center mb-3"
              style={{ color: CORAL }}
            >
              Sunday Morning
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-center mb-14"
              style={{
                fontFamily: "var(--font-playfair)",
                color: DARK,
              }}
            >
              What to{" "}
              <span style={{ color: ORANGE }}>Expect</span>
            </h2>
          </FadeIn>

          {/* ── Mobile: vertical timeline ── */}
          <div className="sm:hidden relative pl-10">
            {/* Vertical line */}
            <div
              className="absolute left-[18px] top-2 bottom-2 w-[2px]"
              style={{
                background: `linear-gradient(to bottom, ${ORANGE}40, ${CORAL}30, ${ORANGE}20)`,
              }}
            />

            <div className="space-y-8">
              {data.timeline.map((step, i) => (
                <FadeIn key={step.label} delay={i * 0.1}>
                  <div className="relative flex items-start gap-5">
                    {/* Node on the line */}
                    <div
                      className="absolute -left-10 top-0 w-9 h-9 rounded-full flex items-center justify-center z-10 shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${ORANGE}, ${CORAL})`,
                        boxShadow: `0 0 0 4px white, 0 0 0 6px ${ORANGE}25`,
                      }}
                    >
                      <span className="text-xs font-bold text-white">{i + 1}</span>
                    </div>

                    {/* Content */}
                    <div className="pt-0.5">
                      <div className="flex items-center gap-2 mb-1">
                        <step.icon size={16} style={{ color: ORANGE }} />
                        <h3 className="font-bold text-base" style={{ color: DARK }}>
                          {step.label}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: `${DARK}60` }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* ── Desktop: horizontal timeline ── */}
          <div className="hidden sm:block">
            <div className="relative">
              {/* Horizontal line through the center of nodes */}
              <div
                className="absolute top-[18px] left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(to right, transparent, ${ORANGE}40 10%, ${CORAL}35 50%, ${ORANGE}40 90%, transparent)`,
                }}
              />

              <div className="grid grid-cols-4 gap-4">
                {data.timeline.map((step, i) => (
                  <FadeIn key={step.label} delay={i * 0.12}>
                    <div className="flex flex-col items-center text-center">
                      {/* Node */}
                      <div
                        className="relative w-9 h-9 rounded-full flex items-center justify-center z-10 mb-5"
                        style={{
                          background: `linear-gradient(135deg, ${ORANGE}, ${CORAL})`,
                          boxShadow: `0 0 0 4px white, 0 0 0 6px ${ORANGE}20, 0 4px 12px ${ORANGE}25`,
                        }}
                      >
                        <span className="text-xs font-bold text-white">{i + 1}</span>
                      </div>

                      {/* Icon */}
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                        style={{
                          background: `linear-gradient(135deg, ${ORANGE}12, ${CORAL}08)`,
                          border: `1px solid ${ORANGE}15`,
                        }}
                      >
                        <step.icon size={24} style={{ color: ORANGE }} />
                      </div>

                      <h3 className="font-bold text-base mb-1" style={{ color: DARK }}>
                        {step.label}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: `${DARK}55` }}>
                        {step.desc}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          AGE GROUPS — colorful individual cards
         ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: WARM }}>
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] text-center mb-3"
              style={{ color: CORAL }}
            >
              Programming by Age
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-center mb-12"
              style={{
                fontFamily: "var(--font-playfair)",
                color: DARK,
              }}
            >
              Find Your Child&apos;s{" "}
              <span style={{ color: ORANGE }}>Group</span>
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-5">
            {data.ageGroups.map((group, i) => (
              <FadeIn key={group.label} delay={i * 0.1}>
                <div
                  className="group rounded-2xl p-6 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: group.bg,
                    borderColor: `${group.color}25`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = `${group.color}50`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = `${group.color}25`)
                  }
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${group.color}18` }}
                    >
                      <group.icon size={24} style={{ color: group.color }} />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-bold text-lg mb-0.5"
                        style={{
                          fontFamily: "var(--font-playfair)",
                          color: DARK,
                        }}
                      >
                        {group.label}
                      </h3>
                      <p className="text-sm font-medium" style={{ color: group.color }}>
                        {group.ages}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Calendar size={13} style={{ color: `${DARK}45` }} />
                        <p className="text-sm" style={{ color: `${DARK}60` }}>
                          Sundays at {group.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ABOUT / DESCRIPTION + SAFETY
         ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: "white" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <FadeIn>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.3em] mb-3"
                  style={{ color: CORAL }}
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
                  Building{" "}
                  <span style={{ color: ORANGE }}>Foundations</span>
                </h2>
              </FadeIn>
              {data.description.map((p, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <p className="leading-relaxed mb-5 text-lg" style={{ color: `${DARK}75` }}>
                    {p}
                  </p>
                </FadeIn>
              ))}
            </div>

            <div>
              <FadeIn delay={0.1}>
                <div
                  className="p-6 rounded-2xl border mb-6"
                  style={{
                    backgroundColor: WARM,
                    borderColor: `${ORANGE}15`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={18} style={{ color: ORANGE }} />
                    <h3 className="font-bold uppercase tracking-wide" style={{ color: DARK }}>
                      Your Child&apos;s Safety
                    </h3>
                  </div>
                  <p className="leading-relaxed text-sm" style={{ color: `${DARK}65` }}>
                    {data.safety}
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          RESOURCES
         ═══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: WARM }}>
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] text-center mb-3"
              style={{ color: CORAL }}
            >
              For Parents and Leaders
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-center mb-10"
              style={{
                fontFamily: "var(--font-playfair)",
                color: DARK,
              }}
            >
              Resources and{" "}
              <span style={{ color: ORANGE }}>Links</span>
            </h2>
          </FadeIn>

          <div className="space-y-3">
            {data.resources.map((link, i) => (
              <FadeIn key={link.href} delay={i * 0.06}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-xl bg-white border transition-all duration-200 hover:shadow-md"
                  style={{ borderColor: `${ORANGE}12` }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
                    style={{ backgroundColor: `${ORANGE}10` }}
                  >
                    <link.icon size={18} style={{ color: ORANGE }} className="group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold transition-colors duration-200 group-hover:text-amber-600"
                      style={{ color: DARK }}
                    >
                      {link.label}
                    </p>
                    {link.desc && (
                      <p className="text-sm mt-0.5" style={{ color: `${DARK}55` }}>
                        {link.desc}
                      </p>
                    )}
                  </div>
                  <ExternalLink
                    size={16}
                    className="shrink-0 transition-colors duration-200"
                    style={{ color: `${DARK}25` }}
                  />
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CONTACT CTA
         ═══════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-24"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${ORANGE}15 0%, transparent 55%), linear-gradient(to bottom, ${DARK_MID}, ${DARK})`,
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${ORANGE}20` }}
            >
              <Mail size={24} style={{ color: ORANGE_LIGHT }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Have{" "}
              <span style={{ color: ORANGE_LIGHT }}>Questions?</span>
            </h2>
            <p className="text-white/50 mb-8 text-lg max-w-lg mx-auto">
              We would love to help your family get connected. Reach out to {data.contactName} and
              we will get back to you soon.
            </p>
            <a
              href={`mailto:${data.contactEmail}`}
              className="inline-flex items-center gap-2 px-10 py-4 text-white font-bold rounded-full transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${CORAL})`,
                boxShadow: `0 8px 32px ${ORANGE}40`,
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
