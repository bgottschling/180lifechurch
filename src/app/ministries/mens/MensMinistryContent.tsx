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
        {/* SVG Mountain landscape — hand-drawn rugged style */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            viewBox="0 0 1440 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMax slice"
            className="absolute bottom-0 left-0 w-full h-full"
          >
            <defs>
              <linearGradient id="peakShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a2a2a" />
                <stop offset="100%" stopColor="#141414" />
              </linearGradient>
            </defs>

            {/* ── Back range (faint, atmospheric) ── */}
            <path
              d="M0 560 L60 530 L110 550 L170 490 L210 510 L260 460 L290 440 L330 470 L380 420
                 L420 380 L440 350 L460 310 L475 280 L490 310 L510 350 L540 390
                 L580 420 L620 450 L660 430 L700 390 L720 350 L735 310 L745 270 L755 310
                 L770 350 L790 390 L830 420 L870 400 L910 370 L935 340 L950 310 L960 340
                 L980 370 L1010 400 L1050 430 L1100 460 L1150 440 L1200 470
                 L1260 450 L1320 480 L1380 470 L1440 490 L1440 900 L0 900Z"
              fill="#1a1a1a"
              opacity="0.45"
            />
            <path
              d="M0 560 L60 530 L110 550 L170 490 L210 510 L260 460 L290 440 L330 470 L380 420
                 L420 380 L440 350 L460 310 L475 280 L490 310 L510 350 L540 390
                 L580 420 L620 450 L660 430 L700 390 L720 350 L735 310 L745 270 L755 310
                 L770 350 L790 390 L830 420 L870 400 L910 370 L935 340 L950 310 L960 340
                 L980 370 L1010 400 L1050 430 L1100 460 L1150 440 L1200 470
                 L1260 450 L1320 480 L1380 470 L1440 490"
              stroke={RED}
              strokeWidth="0.8"
              opacity="0.06"
              fill="none"
            />

            {/* ── Mid range — jagged ridgeline with character ── */}
            <path
              d="M0 620 L50 590 L90 610 L140 570 L180 540 L220 560 L270 510 L310 480
                 L350 500 L390 460 L420 430 L450 390 L470 360 L490 330 L505 300
                 L515 270 L525 240 L535 270 L550 300 L570 340 L600 380
                 L640 410 L680 440 L710 410 L730 370 L745 330 L755 290 L762 260
                 L768 230 L775 200 L782 230 L790 260 L800 300 L815 340
                 L835 380 L860 410 L900 440 L940 470 L980 450 L1020 420
                 L1050 390 L1070 360 L1085 340 L1095 360 L1110 390
                 L1140 430 L1180 460 L1220 490 L1270 470 L1320 500
                 L1370 480 L1420 500 L1440 510 L1440 900 L0 900Z"
              fill="#171717"
              opacity="0.6"
            />
            <path
              d="M0 620 L50 590 L90 610 L140 570 L180 540 L220 560 L270 510 L310 480
                 L350 500 L390 460 L420 430 L450 390 L470 360 L490 330 L505 300
                 L515 270 L525 240 L535 270 L550 300 L570 340 L600 380
                 L640 410 L680 440 L710 410 L730 370 L745 330 L755 290 L762 260
                 L768 230 L775 200 L782 230 L790 260 L800 300 L815 340
                 L835 380 L860 410 L900 440 L940 470 L980 450 L1020 420
                 L1050 390 L1070 360 L1085 340 L1095 360 L1110 390
                 L1140 430 L1180 460 L1220 490 L1270 470 L1320 500
                 L1370 480 L1420 500 L1440 510"
              stroke={RED}
              strokeWidth="1"
              opacity="0.10"
              fill="none"
            />

            {/* ── Primary range — dramatic central peak with rugged detail ── */}
            <path
              d="M0 700 L40 680 L80 690 L130 660 L180 640 L230 660 L280 620 L320 590
                 L360 610 L400 570 L430 540 L460 510 L490 470 L510 440
                 L530 400 L548 370 L560 340 L575 310 L588 280
                 L600 250 L612 220 L624 190 L636 165 L648 145
                 L660 130 L670 120 L678 115 L684 112 L690 115
                 L698 120 L708 130 L720 145 L732 165 L744 190
                 L756 220 L768 250 L780 280 L792 310
                 L808 345 L820 370 L835 400 L850 430
                 L870 460 L895 490 L920 520 L950 550
                 L985 570 L1020 590 L1060 610 L1100 590 L1140 570
                 L1170 550 L1195 530 L1215 510 L1230 530 L1250 555
                 L1280 580 L1320 600 L1370 620 L1420 640 L1440 650
                 L1440 900 L0 900Z"
              fill="url(#peakShade)"
              opacity="0.85"
            />
            {/* Red ridgeline — primary */}
            <path
              d="M0 700 L40 680 L80 690 L130 660 L180 640 L230 660 L280 620 L320 590
                 L360 610 L400 570 L430 540 L460 510 L490 470 L510 440
                 L530 400 L548 370 L560 340 L575 310 L588 280
                 L600 250 L612 220 L624 190 L636 165 L648 145
                 L660 130 L670 120 L678 115 L684 112 L690 115
                 L698 120 L708 130 L720 145 L732 165 L744 190
                 L756 220 L768 250 L780 280 L792 310
                 L808 345 L820 370 L835 400 L850 430
                 L870 460 L895 490 L920 520 L950 550
                 L985 570 L1020 590 L1060 610 L1100 590 L1140 570
                 L1170 550 L1195 530 L1215 510 L1230 530 L1250 555
                 L1280 580 L1320 600 L1370 620 L1420 640 L1440 650"
              stroke={RED}
              strokeWidth="1.5"
              opacity="0.18"
              fill="none"
            />
            {/* Snow/light detail lines on central peak faces */}
            <path
              d="M660 130 L648 180 L640 220 M660 130 L675 175 L685 210
                 M684 112 L692 155 L700 195 M678 115 L665 165"
              stroke="white"
              strokeWidth="0.6"
              opacity="0.05"
              fill="none"
            />

            {/* ── Pine tree silhouettes (foreground) ── */}
            {/* Left cluster */}
            <path d="M60 780 L68 740 L72 760 L78 720 L82 745 L86 710 L90 730 L94 700 L98 740 L102 760 L106 780Z" fill="#0E0E0E" />
            <path d="M110 780 L116 750 L120 765 L124 730 L128 750 L132 715 L136 740 L140 720 L144 745 L148 770 L152 780Z" fill="#0C0C0C" />
            <path d="M30 780 L36 755 L40 770 L44 745 L48 760 L50 740 L54 758 L58 775 L62 780Z" fill="#0E0E0E" />

            {/* Center-left pines */}
            <path d="M340 780 L346 745 L350 760 L354 725 L358 745 L362 705 L366 730 L370 710 L374 740 L378 760 L382 780Z" fill="#0D0D0D" />
            <path d="M390 780 L395 755 L398 768 L402 738 L406 755 L408 728 L412 748 L416 765 L420 780Z" fill="#0E0E0E" />

            {/* Center-right pines */}
            <path d="M1020 780 L1026 745 L1030 760 L1034 720 L1038 742 L1042 700 L1046 728 L1050 710 L1054 738 L1058 760 L1062 780Z" fill="#0D0D0D" />
            <path d="M1070 780 L1074 758 L1078 770 L1082 742 L1086 758 L1088 732 L1092 752 L1096 768 L1100 780Z" fill="#0E0E0E" />

            {/* Right cluster */}
            <path d="M1300 780 L1306 748 L1310 762 L1314 730 L1318 750 L1322 712 L1326 736 L1330 718 L1334 742 L1338 765 L1342 780Z" fill="#0D0D0D" />
            <path d="M1350 780 L1355 758 L1358 770 L1362 738 L1366 755 L1370 728 L1374 748 L1378 768 L1382 780Z" fill="#0C0C0C" />
            <path d="M1390 780 L1394 760 L1398 772 L1400 750 L1404 766 L1408 778 L1412 780Z" fill="#0E0E0E" />

            {/* Tall standalone pines */}
            <path d="M170 780 L176 720 L180 745 L184 695 L188 725 L192 680 L196 710 L200 690 L204 720 L208 750 L212 780Z" fill="#0C0C0C" />
            <path d="M1220 780 L1225 725 L1228 748 L1232 700 L1236 730 L1240 685 L1244 715 L1248 695 L1252 725 L1256 755 L1260 780Z" fill="#0C0C0C" />

            {/* ── Foreground ridge ── */}
            <path
              d="M0 790 L60 770 L120 780 L200 760 L280 775 L360 755 L440 770
                 L520 752 L600 765 L680 748 L720 740 L760 748 L840 762
                 L920 750 L1000 765 L1080 755 L1160 768 L1240 758
                 L1320 772 L1400 762 L1440 770 L1440 900 L0 900Z"
              fill="#0C0C0C"
            />

            {/* ── Base ground ── */}
            <path
              d="M0 820 L200 810 L400 818 L600 805 L720 800 L840 808
                 L1040 812 L1240 806 L1440 815 L1440 900 L0 900Z"
              fill="#0A0A0A"
            />

            {/* ── Birds (small V shapes near peaks) ── */}
            <g stroke="white" strokeWidth="0.8" opacity="0.08" fill="none" strokeLinecap="round">
              <path d="M580 160 L586 155 L592 160" />
              <path d="M610 140 L615 136 L620 140" />
              <path d="M560 180 L565 176 L570 180" />
              <path d="M790 150 L795 146 L800 150" />
              <path d="M820 170 L824 167 L828 170" />
              <path d="M750 130 L754 127 L758 130" />
              <path d="M640 175 L644 172 L648 175" />
              <path d="M720 160 L724 157 L728 160" />
            </g>
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
                src="/images/ministries/mens/logo-color-hd.png"
                alt="180 Men Logo"
                width={800}
                height={1000}
                className="w-40 sm:w-56 lg:w-64 drop-shadow-[0_0_50px_rgba(196,30,42,0.4)]"
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
