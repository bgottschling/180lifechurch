import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { getFooterProps } from "@/lib/wordpress-fallbacks";
import { MINISTRY_PAGES } from "@/lib/subpage-fallbacks";
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

export const metadata: Metadata = {
  title: "Ministries | 180 Life Church",
  description:
    "Explore our ministries. Life Groups, Students, Kids, Young Adults, Worship, and more. There is a place for everyone at 180 Life Church.",
};

/* ------------------------------------------------------------------ */
/* Icon + color mapping for each ministry slug                         */
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

const colorMap: Record<string, string> = {
  "life-groups": "from-teal/80 to-charcoal/90",
  students: "from-amber/70 to-charcoal/90",
  "young-adults": "from-indigo-500/70 to-charcoal/90",
  kids: "from-pink-500/70 to-charcoal/90",
  mens: "from-slate-600/80 to-charcoal/90",
  womens: "from-rose-400/70 to-charcoal/90",
  missions: "from-emerald-600/70 to-charcoal/90",
  "deaf-ministry": "from-sky-500/70 to-charcoal/90",
  care: "from-orange-500/70 to-charcoal/90",
  prayer: "from-violet-500/70 to-charcoal/90",
  serving: "from-lime-600/70 to-charcoal/90",
  "marriage-prep": "from-rose-600/70 to-charcoal/90",
};

/* ------------------------------------------------------------------ */
/* Grouped ministry sections                                           */
/* ------------------------------------------------------------------ */

const MINISTRY_GROUPS = [
  {
    label: "Age and Stage",
    heading: "Connect by",
    headingAccent: "Age and Stage",
    description:
      "Find community with people in your season of life.",
    featured: "kids",
    ministries: [
      "kids",
      "students",
      "young-adults",
      "mens",
      "womens",
      "marriage-prep",
    ],
  },
  {
    label: "Spiritual Growth",
    heading: "Grow",
    headingAccent: "Together",
    description: "Deepen your faith alongside others.",
    featured: "life-groups",
    ministries: ["life-groups", "prayer", "deaf-ministry"],
  },
  {
    label: "Outreach",
    heading: "Serve and",
    headingAccent: "Care",
    description:
      "Use your gifts to love your neighbors and your church.",
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
/* Schedule badge helper                                               */
/* ------------------------------------------------------------------ */

function ScheduleBadge({ slug }: { slug: string }) {
  const data = MINISTRY_PAGES[slug];
  const sched = data?.schedule?.[0];
  if (!sched) return null;

  return (
    <span className="text-white/50 text-xs flex items-center gap-1.5 mt-2">
      <Calendar size={12} className="shrink-0" />
      {sched.day} &middot; {sched.time}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Hero Card (photo background, col-span-2)                            */
/* ------------------------------------------------------------------ */

function HeroCard({ slug }: { slug: string }) {
  const data = MINISTRY_PAGES[slug];
  if (!data) return null;
  const Icon = iconMap[slug] ?? HandHeart;
  const image = heroImages[slug];

  return (
    <FadeIn className="sm:col-span-2">
      <a
        href={`/ministries/${slug}`}
        className="group relative block rounded-2xl overflow-hidden h-full min-h-[300px] hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20"
      >
        {/* Photo background */}
        {image && (
          <Image
            src={image}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, 66vw"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />

        {/* Watermark icon */}
        <div className="absolute top-4 right-4 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500">
          <Icon size={140} className="text-white" strokeWidth={1} />
        </div>

        {/* Content */}
        <div className="relative p-8 flex flex-col h-full min-h-[300px] z-10">
          {/* Top: tag badge */}
          <div className="flex items-start mb-auto">
            <span className="text-white/70 text-xs font-semibold tracking-[0.15em] uppercase bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
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
            <ScheduleBadge slug={slug} />

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
    </FadeIn>
  );
}

/* ------------------------------------------------------------------ */
/* Standard Card (gradient background, 1 column)                       */
/* ------------------------------------------------------------------ */

function StandardCard({
  slug,
  delay = 0,
}: {
  slug: string;
  delay?: number;
}) {
  const data = MINISTRY_PAGES[slug];
  if (!data) return null;
  const Icon = iconMap[slug] ?? HandHeart;
  const color = colorMap[slug] ?? "from-charcoal/80 to-charcoal/90";

  return (
    <FadeIn delay={delay}>
      <a
        href={`/ministries/${slug}`}
        className="group relative block rounded-2xl overflow-hidden h-full min-h-[240px] hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20"
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Watermark icon */}
        <div className="absolute top-3 right-3 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500">
          <Icon size={100} className="text-white" strokeWidth={1} />
        </div>

        {/* Content */}
        <div className="relative p-6 flex flex-col h-full min-h-[240px] z-10">
          {/* Icon badge */}
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-auto">
            <Icon className="text-white" size={18} />
          </span>

          {/* Bottom content */}
          <div className="mt-auto">
            <h3 className="text-white text-lg font-bold mb-1">
              {data.title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed line-clamp-2 group-hover:text-white/80 transition-colors duration-300">
              {data.subtitle}
            </p>
            <ScheduleBadge slug={slug} />

            {/* Action row */}
            <div className="flex items-center gap-2 pt-3 mt-2 border-t border-white/10 group-hover:border-white/20 transition-colors">
              <span className="text-white/70 text-sm font-medium group-hover:text-amber transition-colors duration-300">
                Learn More
              </span>
              <ArrowRight
                size={14}
                className="text-white/40 group-hover:text-amber group-hover:translate-x-1.5 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </a>
    </FadeIn>
  );
}

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function MinistriesPage() {
  const footerProps = getFooterProps();

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

        return (
          <section
            key={group.label}
            className={`py-16 sm:py-20 ${
              gi % 2 === 0 ? "bg-soft-white" : "bg-white"
            }`}
          >
            <div className="max-w-6xl mx-auto px-6">
              {/* Section header */}
              <FadeIn>
                <div className="mb-10">
                  <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                    {group.label}
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl font-bold text-charcoal mt-3 mb-3"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {group.heading}{" "}
                    <span className="text-amber">{group.headingAccent}</span>
                  </h2>
                  <p className="text-charcoal/60 text-lg max-w-xl">
                    {group.description}
                  </p>
                </div>
              </FadeIn>

              {/* Grid: hero card (2 cols) + standard cards (1 col each) */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Hero card first */}
                <HeroCard slug={group.featured} />

                {/* Remaining standard cards */}
                {nonFeatured.map((slug, i) => (
                  <StandardCard
                    key={slug}
                    slug={slug}
                    delay={0.05 * (i + 1)}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <Footer {...footerProps} />
    </>
  );
}
