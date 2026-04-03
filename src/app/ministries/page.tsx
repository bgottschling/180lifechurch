import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps, fetchAllMinistryPages } from "@/lib/data";
import {
  Users,
  BookOpen,
  Baby,
  HandHeart,
  Sparkles,
  Heart,
  Ear,
  Globe,
  Shield,
  HeartHandshake,
  ArrowRight,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import type { MinistryPageData } from "@/lib/subpage-types";

export const metadata: Metadata = {
  title: "Ministries | 180 Life Church",
  description:
    "Explore our ministries. Life Groups, Students, Kids, Young Adults, Worship, and more. There is a place for everyone at 180 Life Church.",
};

/* ------------------------------------------------------------------ */
/* Icon mapping for each ministry slug                                 */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, LucideIcon> = {
  "life-groups": Users,
  students: BookOpen,
  "young-adults": Sparkles,
  kids: Baby,
  mens: Shield,
  womens: Heart,
  missions: Globe,
  "deaf-ministry": Ear,
  care: HandHeart,
  prayer: HandHeart,
  serving: HandHeart,
  "marriage-prep": HeartHandshake,
};

/* ------------------------------------------------------------------ */
/* Grouped ministry sections                                           */
/* ------------------------------------------------------------------ */

const MINISTRY_GROUPS = [
  {
    label: "Age and Stage",
    heading: "Connect by",
    headingAccent: "Age and Stage",
    description: "Find community with people in your season of life.",
    featured: "kids",
    ministries: [
      "kids",
      "students",
      "young-adults",
      "mens",
      "womens",
    ],
  },
  {
    label: "Spiritual Growth",
    heading: "Grow",
    headingAccent: "Together",
    description: "Deepen your faith alongside others.",
    featured: "life-groups",
    ministries: ["life-groups", "prayer", "deaf-ministry", "marriage-prep"],
  },
  {
    label: "Outreach",
    heading: "Serve and",
    headingAccent: "Care",
    description: "Use your gifts to love your neighbors and your church.",
    featured: "serving",
    ministries: ["serving", "care", "missions"],
  },
];

/* Hero card images (only for featured ministries) */
const heroImages: Record<string, string> = {
  kids: "/images/ministries/kids.jpg",
  "life-groups": "/images/ministries/life-groups.jpg",
  serving: "/images/ministries/serving.jpg",
};

/* ------------------------------------------------------------------ */
/* Hero Card (photo background)                                        */
/* ------------------------------------------------------------------ */

function HeroCard({
  slug,
  pages,
  dark = false,
}: {
  slug: string;
  pages: Record<string, MinistryPageData>;
  dark?: boolean;
}) {
  const data = pages[slug];
  if (!data) return null;
  const Icon = iconMap[slug] ?? HandHeart;
  const image = heroImages[slug];

  return (
    <a
      href={`/ministries/${slug}`}
      className="group relative block rounded-2xl overflow-hidden h-full min-h-[340px] sm:min-h-[400px] hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20"
    >
      {/* Photo background */}
      {image && (
        <Image
          src={image}
          alt={data.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />

      {/* Watermark icon */}
      <div className="absolute top-4 right-4 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500">
        <Icon size={140} className="text-white" strokeWidth={1} />
      </div>

      {/* Content */}
      <div className="relative p-7 sm:p-8 flex flex-col h-full min-h-[340px] sm:min-h-[400px] z-10">
        {/* Top: tag badge */}
        <div className="flex items-start mb-auto">
          <span className={`text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full backdrop-blur-md border ${dark ? "text-white/70 bg-white/10 border-white/10" : "text-white/70 bg-white/10 border-white/10"}`}>
            Featured
          </span>
        </div>

        {/* Bottom content */}
        <div className="mt-auto">
          <h3 className="text-white text-2xl sm:text-3xl font-bold mb-2">
            {data.title}
          </h3>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-1 max-w-lg group-hover:text-white/80 transition-colors duration-300">
            {data.subtitle}
          </p>
          {data.schedule?.[0] && (
            <span className="text-white/50 text-xs flex items-center gap-1.5 mt-2">
              <Calendar size={12} className="shrink-0" />
              {data.schedule[0].day} &middot; {data.schedule[0].time}
            </span>
          )}

          {/* Action row */}
          <div className="flex items-center gap-2 pt-4 mt-3 border-t border-white/10 group-hover:border-white/20 transition-colors">
            <span className="text-white/70 text-sm font-medium group-hover:text-amber transition-colors duration-300">
              Learn More
            </span>
            <ArrowRight
              size={16}
              className="text-white/40 group-hover:text-amber group-hover:translate-x-1.5 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Ministry Row (compact list item)                                    */
/* ------------------------------------------------------------------ */

function MinistryRow({
  slug,
  pages,
  delay = 0,
  dark = false,
}: {
  slug: string;
  pages: Record<string, MinistryPageData>;
  delay?: number;
  dark?: boolean;
}) {
  const data = pages[slug];
  if (!data) return null;
  const Icon = iconMap[slug] ?? HandHeart;
  const sched = data.schedule?.[0];

  return (
    <FadeIn delay={delay}>
      <a
        href={`/ministries/${slug}`}
        className={`group flex items-center gap-4 sm:gap-5 py-5 border-b transition-colors ${
          dark
            ? "border-white/8 hover:bg-white/[0.04]"
            : "border-charcoal/8 hover:bg-charcoal/[0.02]"
        } rounded-lg px-3 -mx-3`}
      >
        {/* Icon */}
        <div
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
            dark
              ? "bg-white/[0.08] border border-white/10"
              : "bg-amber/10 border border-amber/15"
          }`}
        >
          <Icon
            size={20}
            className={dark ? "text-amber" : "text-amber"}
          />
        </div>

        {/* Title + subtitle */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-base ${
              dark ? "text-white" : "text-charcoal"
            } group-hover:text-amber transition-colors duration-300`}
          >
            {data.title}
          </h3>
          <p
            className={`text-sm leading-relaxed line-clamp-1 mt-0.5 ${
              dark ? "text-white/45" : "text-charcoal/50"
            }`}
          >
            {data.subtitle}
          </p>
        </div>

        {/* Schedule (hidden on mobile to save space) */}
        {sched && (
          <div
            className={`hidden sm:flex items-center gap-1.5 text-xs shrink-0 ${
              dark ? "text-white/35" : "text-charcoal/40"
            }`}
          >
            <Calendar size={12} className="shrink-0" />
            {sched.day} &middot; {sched.time}
          </div>
        )}

        {/* Arrow */}
        <ArrowRight
          size={16}
          className={`shrink-0 group-hover:translate-x-1 transition-all duration-300 ${
            dark
              ? "text-white/25 group-hover:text-amber"
              : "text-charcoal/25 group-hover:text-amber"
          }`}
        />
      </a>
    </FadeIn>
  );
}

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

export default async function MinistriesPage() {
  const [footerProps, pages] = await Promise.all([
    fetchFooterProps(),
    fetchAllMinistryPages(),
  ]);

  return (
    <>
      <Navbar />
      <PageHero
        title="Our Ministries"
        subtitle="There is a place for everyone at 180 Life Church. Explore our ministries and find where you belong."
      />

      {MINISTRY_GROUPS.map((group, gi) => {
        const nonFeatured = group.ministries.filter(
          (s) => s !== group.featured
        );
        const isDark = gi === 2; // Third section is dark
        const heroOnRight = gi === 1; // Alternate hero position

        return (
          <section
            key={group.label}
            className={`py-16 sm:py-24 ${
              isDark
                ? ""
                : gi % 2 === 0
                ? "bg-soft-white"
                : "bg-white"
            }`}
            style={
              isDark
                ? {
                    background:
                      "radial-gradient(ellipse at 50% 30%, rgba(212, 160, 84, 0.1) 0%, transparent 60%), linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)",
                  }
                : undefined
            }
          >
            <div className="max-w-6xl mx-auto px-6">
              {/* Section header */}
              <FadeIn>
                <div className={`mb-12 ${isDark ? "" : ""}`}>
                  <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                    {group.label}
                  </span>
                  <h2
                    className={`text-3xl sm:text-4xl font-bold mt-3 mb-3 ${
                      isDark ? "text-white" : "text-charcoal"
                    }`}
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {group.heading}{" "}
                    <span className="text-amber">{group.headingAccent}</span>
                  </h2>
                  <p
                    className={`text-lg max-w-xl ${
                      isDark ? "text-white/45" : "text-charcoal/60"
                    }`}
                  >
                    {group.description}
                  </p>
                </div>
              </FadeIn>

              {/* Hero + List layout */}
              <div
                className={`grid lg:grid-cols-2 gap-8 lg:gap-10 items-start ${
                  heroOnRight ? "lg:direction-rtl" : ""
                }`}
              >
                {/* Hero card */}
                <FadeIn className={heroOnRight ? "lg:order-2" : "lg:order-1"}>
                  <HeroCard slug={group.featured} pages={pages} dark={isDark} />
                </FadeIn>

                {/* Ministry list rows */}
                <div className={`flex flex-col justify-center ${heroOnRight ? "lg:order-1" : "lg:order-2"}`}>
                  {nonFeatured.map((slug, i) => (
                    <MinistryRow
                      key={slug}
                      slug={slug}
                      pages={pages}
                      delay={0.05 * (i + 1)}
                      dark={isDark}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <Footer {...footerProps} />
    </>
  );
}
