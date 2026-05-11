import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import {
  fetchFooterProps,
  fetchAllMinistryPages,
  fetchMinistries,
  fetchSiteSettings,
} from "@/lib/data";
import { FALLBACK_SETTINGS } from "@/lib/wordpress-fallbacks";
import { isPlanningCenterImage } from "@/lib/image-utils";
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

// SEO metadata mirrors the existing ministries hub on 180lifechurch.org
// (was at /west-hartford-church-ministries/, now 301s to /ministries).
// See docs/seo-audit-current-site.md.
export const metadata: Metadata = {
  title: "Church ministries in West Hartford, CT | 180 Life Church",
  description:
    "\"Gather, Grow and Go.\" Our West Hartford, CT church has ministries for kids, women and men. Join a 180 Life Group or volunteer on various church teams.",
  alternates: { canonical: "/ministries" },
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

/**
 * MINISTRY_GROUPS as a TYPE — values are sourced from Site Settings
 * (editor-managed in wp-admin under Site Settings → Ministries Hub).
 * Falls back to FALLBACK_SETTINGS.ministriesHubGroups when WordPress
 * is unreachable or the editor hasn't populated the repeater yet.
 *
 * Shape mirrors WPMinistriesHubGroup with `featured` / `ministries`
 * renames preserved for the existing render code.
 */
interface MinistryGroup {
  label: string;
  heading: string;
  headingAccent: string;
  description: string;
  featured: string;
  ministries: string[];
}

/* Hardcoded hero images used only as a final fallback when neither
   WordPress (homepage ministry CPT) nor the static asset folder
   has an image for this slug. Editors who want to change a featured
   image should upload it to the matching entry under "180 Life →
   Ministries" in wp-admin. */
const heroImageFallbacks: Record<string, string> = {
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
  ministryImages,
  dark = false,
}: {
  slug: string;
  pages: Record<string, MinistryPageData>;
  /**
   * Slug → image URL map sourced from the WordPress homepage "Ministry"
   * CPT. Featured cards use whatever image the editor uploaded for the
   * matching slug on the homepage, falling back to the bundled image
   * if none exists. One source of truth: editor uploads once, image
   * shows up on both the homepage card and the ministries page hero.
   */
  ministryImages: Record<string, string>;
  dark?: boolean;
}) {
  const data = pages[slug];
  if (!data) return null;
  const Icon = iconMap[slug] ?? HandHeart;
  const image = ministryImages[slug] || heroImageFallbacks[slug];

  return (
    <a
      href={`/ministries/${slug}`}
      className="group relative block rounded-2xl overflow-hidden h-full min-h-[340px] sm:min-h-[400px] hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20"
    >
      {/* Photo background — sourced from WP first, bundled image as
          fallback. unoptimized for PC-hosted URLs since Vercel's
          image transformer can't handle their signed URLs. */}
      {image && (
        <Image
          src={image}
          alt={data.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized={isPlanningCenterImage(image)}
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

          {/* Action button — gradient-filled pill so it reads clearly as a button */}
          <div className="mt-5">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-charcoal bg-gradient-to-b from-amber-light to-amber shadow-[0_4px_14px_rgba(212,160,84,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-amber-light/50 group-hover:shadow-[0_6px_20px_rgba(212,160,84,0.5),inset_0_1px_0_rgba(255,255,255,0.5)] group-hover:-translate-y-0.5 transition-all duration-300">
              Learn More
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
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
        className={`group relative flex items-center gap-4 sm:gap-5 py-5 border-b transition-colors ${
          dark
            ? "border-white/8 hover:bg-white/[0.04]"
            : "border-charcoal/8 hover:bg-charcoal/[0.02]"
        } rounded-lg pl-6 pr-3 -mx-3`}
      >
        {/* (A) Animated amber accent bar — left edge */}
        <span
          aria-hidden
          className="absolute left-1 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-amber rounded-full group-hover:h-10 transition-all duration-200 ease-out shadow-[0_0_12px_rgba(212,160,84,0.5)]"
        />

        {/* Icon */}
        <div
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
            dark
              ? "bg-white/[0.08] border border-white/10 group-hover:bg-amber/15 group-hover:border-amber/30"
              : "bg-amber/10 border border-amber/15 group-hover:bg-amber/20 group-hover:border-amber/40"
          }`}
        >
          <Icon size={20} className="text-amber" />
        </div>

        {/* Title + (E) hover-reveal description */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-base ${
              dark ? "text-white" : "text-charcoal"
            } group-hover:text-amber transition-colors duration-200`}
          >
            {data.title}
          </h3>

          {/* Subtitle: visible on mobile, opacity-reveal on sm+ (no height shift) */}
          <p
            className={`text-sm leading-relaxed line-clamp-1 mt-0.5 transition-opacity duration-200 ease-out ${
              dark ? "text-white/45" : "text-charcoal/50"
            } sm:opacity-0 sm:group-hover:opacity-100`}
          >
            {data.subtitle}
          </p>
        </div>

        {/* (D) Schedule pill — styled badge with calendar icon */}
        {sched && (
          <div
            className={`hidden sm:flex items-center gap-1.5 text-xs font-medium shrink-0 px-3 py-1.5 rounded-full border transition-all duration-200 ${
              dark
                ? "bg-white/[0.05] border-white/10 text-white/60 group-hover:bg-amber/15 group-hover:border-amber/40 group-hover:text-amber"
                : "bg-charcoal/[0.04] border-charcoal/10 text-charcoal/60 group-hover:bg-amber/15 group-hover:border-amber/40 group-hover:text-amber"
            }`}
          >
            <Calendar size={12} className="shrink-0" />
            <span>
              {sched.day} &middot; {sched.time}
            </span>
          </div>
        )}

        {/* Explore button */}
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 group-hover:-translate-y-0.5 ${
            dark
              ? "text-white/50 bg-gradient-to-b from-white/10 to-white/[0.03] border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:from-amber/30 group-hover:to-amber/15 group-hover:border-amber/40 group-hover:text-amber group-hover:shadow-[0_4px_12px_rgba(212,160,84,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]"
              : "text-charcoal/40 bg-gradient-to-b from-charcoal/[0.06] to-charcoal/[0.02] border-charcoal/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] group-hover:from-amber/25 group-hover:to-amber/10 group-hover:border-amber/40 group-hover:text-amber group-hover:shadow-[0_4px_12px_rgba(212,160,84,0.2),inset_0_1px_0_rgba(255,255,255,0.5)]"
          }`}
        >
          Explore
          <ArrowRight
            size={12}
            className="group-hover:translate-x-0.5 transition-transform duration-200"
          />
        </span>
      </a>
    </FadeIn>
  );
}

/* ------------------------------------------------------------------ */
/* Page Component                                                      */
/* ------------------------------------------------------------------ */

export default async function MinistriesPage() {
  const [footerProps, pages, ministries, settings] = await Promise.all([
    fetchFooterProps(),
    fetchAllMinistryPages(),
    // Pull the homepage Ministry CPT so we can reuse the editor-uploaded
    // card image on the /ministries featured tile too — same image,
    // two places, one upload.
    fetchMinistries(),
    // Site Settings holds the editor-managed group structure for this
    // page (Site Settings → Ministries Hub).
    fetchSiteSettings(),
  ]);

  // Build a slug → image map. Priority: editor-managed card image on
  // the matching ministry_page entry (preferred — page-level control),
  // then the homepage Ministry CPT image, then bundled heroImageFallbacks.
  const ministryImages: Record<string, string> = {};
  for (const m of ministries) {
    if (m.slug && m.image) ministryImages[m.slug] = m.image;
  }
  for (const [slug, page] of Object.entries(pages)) {
    if (page.card?.image) ministryImages[slug] = page.card.image;
  }

  // Group structure: editor-managed via Site Settings → Ministries Hub.
  // Falls back to FALLBACK_SETTINGS.ministriesHubGroups when the editor
  // hasn't populated the repeater yet — so the page renders identically
  // to the previous hardcoded version out of the box and editors can
  // override piece by piece.
  const groupsSource =
    settings.ministriesHubGroups.length > 0
      ? settings.ministriesHubGroups
      : FALLBACK_SETTINGS.ministriesHubGroups;
  const groups: MinistryGroup[] = groupsSource.map((g) => ({
    label: g.label,
    heading: g.heading,
    headingAccent: g.headingAccent,
    description: g.description,
    featured: g.featuredSlug,
    ministries: g.ministrySlugs,
  }));

  return (
    <>
      <Navbar />
      <PageHero
        title="Our Ministries"
        subtitle="There is a place for everyone at 180 Life Church. Explore our ministries and find where you belong."
      />

      {groups.map((group, gi) => {
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
                  <HeroCard
                    slug={group.featured}
                    pages={pages}
                    ministryImages={ministryImages}
                    dark={isDark}
                  />
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
