import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps, fetchContentPage } from "@/lib/data";
import { isPlanningCenterImage } from "@/lib/image-utils";
import { Users, Heart, BookOpen, HandHeart, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import type { ContentPageData } from "@/lib/subpage-types";

// SEO metadata mirrors the existing /about page on 180lifechurch.org
// (WordPress + AIOSEO) so rankings transfer to the headless site.
// See docs/seo-audit-current-site.md.
export const metadata: Metadata = {
  title: "Contemporary Church in West Hartford, CT | 180 Life Church",
  description:
    "Looking for a church near you in the West Hartford, CT area? Info about our story, worship, mission and beliefs. Learn what our Sunday church services are like.",
  alternates: { canonical: "/about" },
};

// Bundled fallbacks for each Next Steps card. The actual title / tag /
// description / image now flow from the corresponding WordPress
// content_page entry (or the Leadership card, which lives in code
// since /leadership isn't a content_page CPT — different data model).
// Editors who want to swap an image or copy edit the description
// upload/edit it under 180 Life → Content Pages → <page>.
const NEXT_STEP_FALLBACKS = [
  {
    slug: "leadership",
    icon: Users,
    title: "Meet Our Team",
    tag: "Leadership",
    description:
      "Get to know the pastors, staff, and elders who shepherd our church family.",
    href: "/leadership",
    image: "/images/community.jpg",
  },
  {
    slug: "partnership",
    icon: Heart,
    title: "Partnership",
    tag: "Membership",
    description:
      "Learn how to become a partner and discover your place in the church body.",
    href: "/partnership",
    image: "/images/ministries/life-groups.jpg",
  },
  {
    slug: "baptism",
    icon: BookOpen,
    title: "Baptism & Dedication",
    tag: "Next Step",
    description:
      "Ready to take your next step of faith? Learn about baptism and child dedication.",
    href: "/baptism",
    image: "/images/ministries/worship.jpg",
  },
  {
    slug: "stories",
    icon: HandHeart,
    title: "Stories",
    tag: "Testimonies",
    description:
      "See how God is transforming lives at 180 Life Church.",
    href: "/stories",
    image: "/images/ministries/serving.jpg",
  },
];

export default async function AboutPage() {
  // Fetch the About page content plus each linked content_page so we
  // can pull editor-managed card thumbnails. The three content-page
  // fetches happen in parallel and fall back to bundled data if a
  // page is missing — so the Next Steps grid keeps rendering even
  // when only About has been authored in WP.
  const [footerProps, data, partnership, baptism, stories] = await Promise.all([
    fetchFooterProps(),
    fetchContentPage("about"),
    fetchContentPage("partnership"),
    fetchContentPage("baptism"),
    fetchContentPage("stories"),
  ]);

  if (!data) return null;

  // Build the Next Steps cards by merging hardcoded fallbacks (icons,
  // hrefs, baseline copy) with the editor-managed card data from each
  // content page (preferred when set in wp-admin). Leadership stays
  // fully hardcoded since it's a different data shape.
  const cardDataBySlug: Record<string, ContentPageData["card"] | undefined> = {
    partnership: partnership?.card,
    baptism: baptism?.card,
    stories: stories?.card,
  };
  const nextSteps = NEXT_STEP_FALLBACKS.map((step) => {
    const wp = cardDataBySlug[step.slug];
    return {
      ...step,
      title: wp?.title || step.title,
      tag: wp?.tag || step.tag,
      description: wp?.description || step.description,
      image: wp?.image || step.image,
    };
  });

  return (
    <>
      <Navbar />
      <PageHero
        title={data.title}
        subtitle={data.subtitle}
        breadcrumbs={data.breadcrumbs}
        image={data.heroImage}
      />

      {data.sections.map((section, i) => (
        <ContentSection
          key={i}
          label={section.label}
          heading={section.heading}
          headingAccent={section.headingAccent}
          body={section.body}
          image={section.image}
          background={i % 2 === 0 ? "soft-white" : "white"}
        />
      ))}

      {/* Next Steps */}
      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                Go Deeper
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-charcoal mt-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Next <span className="text-amber">Steps</span>
              </h2>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nextSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <FadeIn key={step.title} delay={i * 0.05}>
                  <Link
                    href={step.href}
                    className="group relative block rounded-2xl overflow-hidden cursor-pointer h-full min-h-[320px] hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20"
                  >
                    {/* Background photo — sourced from the matching
                        content_page entry in WordPress when the editor
                        has uploaded one. unoptimized for PC-hosted URLs
                        since Vercel's image transformer can't handle
                        their signed query params. */}
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      unoptimized={isPlanningCenterImage(step.image)}
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />

                    {/* Watermark icon */}
                    <div className="absolute top-4 right-4 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500">
                      <Icon size={100} className="text-white" strokeWidth={1} />
                    </div>

                    {/* Content */}
                    <div className="relative p-7 flex flex-col flex-1 h-full z-10">
                      {/* Top: tag */}
                      <div className="flex items-start mb-auto">
                        <span className="text-white/70 text-xs font-semibold tracking-[0.15em] uppercase bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                          {step.tag}
                        </span>
                      </div>

                      {/* Bottom content */}
                      <div className="mt-auto">
                        <h3 className="text-white text-xl font-bold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-white/80 transition-colors duration-300">
                          {step.description}
                        </p>
                        <div className="flex items-center gap-2 pt-3 border-t border-white/10 group-hover:border-white/20 transition-colors">
                          <span className="text-white/70 text-sm font-medium group-hover:text-amber transition-colors duration-300">
                            Explore
                          </span>
                          <ArrowRight size={16} className="text-white/40 group-hover:text-amber group-hover:translate-x-1.5 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      {data.cta && (
        <section
          className="py-16 sm:py-20 text-center"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(212, 160, 84, 0.15) 0%, transparent 60%), linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)",
          }}
        >
          <div className="max-w-3xl mx-auto px-6">
            <FadeIn>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {data.cta.heading}
              </h2>
              {data.cta.description && (
                <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
                  {data.cta.description}
                </p>
              )}
              <a
                href={data.cta.link}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/25"
              >
                {data.cta.text}
              </a>
            </FadeIn>
          </div>
        </section>
      )}

      <Footer {...footerProps} />
    </>
  );
}
