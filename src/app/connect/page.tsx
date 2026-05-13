import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps, fetchContentPage } from "@/lib/data";
import { BROKEN_IMAGE_PLACEHOLDER, isPlanningCenterImage } from "@/lib/image-utils";
import {
  Heart,
  BookOpen,
  Sparkles,
  HandHeart,
  Users,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import type { ContentPageData } from "@/lib/subpage-types";

// SEO - establish this hub as the canonical destination for
// next-step / connect content, distinct from the /about page's
// "story of the church" purpose.
export const metadata: Metadata = {
  title: "Next Steps & Connect at 180 Life Church | West Hartford, CT",
  description:
    "Take your next step at 180 Life Church in West Hartford, CT - partnership, baptism, new to faith, life groups, serving, and stories of life change.",
  alternates: { canonical: "/connect" },
};

/**
 * One entry per "next step" surfaced on this hub. The `wpSlug` lets
 * us pull editor-managed card data (tag, title, description) from
 * the matching content_page entry in wp-admin so changes there flow
 * through without code edits. `fallback` covers values when WP
 * doesn't have the entry yet - used for items like Life Groups and
 * Serving that don't live in the content_page CPT.
 */
type NextStepConfig = {
  icon: LucideIcon;
  href: string;
  external?: boolean;
  /** Slug of the matching content_page entry, if any. */
  wpSlug?: string;
  /** Fallback card data. Used when wpSlug is missing or unavailable. */
  fallback: {
    tag: string;
    title: string;
    description: string;
    image?: string;
  };
};

const NEXT_STEPS: NextStepConfig[] = [
  {
    icon: Sparkles,
    href: "/new-to-faith",
    wpSlug: "new-to-faith",
    fallback: {
      tag: "Just Starting",
      title: "New to Faith",
      description:
        "Just gave your life to Christ - or just curious? Start with a Bible, prayer, and a real person to walk alongside you.",
    },
  },
  {
    icon: Heart,
    href: "/partnership",
    wpSlug: "partnership",
    fallback: {
      tag: "Membership",
      title: "Partnership",
      description:
        "Learn how to become a partner and discover your place in the church body.",
    },
  },
  {
    icon: BookOpen,
    href: "/baptism",
    wpSlug: "baptism",
    fallback: {
      tag: "Next Step",
      title: "Baptism & Dedication",
      description:
        "Ready to take your next step of faith? Learn about baptism and child dedication.",
    },
  },
  {
    icon: Users,
    href: "https://180life.churchcenter.com/groups/180-life-groups",
    external: true,
    fallback: {
      tag: "Community",
      title: "Life Groups",
      description:
        "Find a small group where you can grow in faith, build real friendships, and study the Word together.",
    },
  },
  {
    icon: HandHeart,
    href: "/ministries/serving",
    fallback: {
      tag: "Serve",
      title: "Serving Teams",
      description:
        "Use your gifts to make a difference. There's a team for every gifting on Sunday and beyond.",
    },
  },
  {
    icon: ArrowRight,
    href: "/stories",
    wpSlug: "stories",
    fallback: {
      tag: "Testimonies",
      title: "Stories",
      description: "See how God is transforming lives at 180 Life Church.",
    },
  },
];

export default async function ConnectPage() {
  // Parallel-fetch the matching content_page entries. Each fetch can
  // fail silently (page not yet seeded, WP unreachable, etc.) - the
  // hub falls back to bundled card data in those cases.
  const slugsToFetch = NEXT_STEPS.map((s) => s.wpSlug).filter(
    (s): s is string => Boolean(s)
  );

  const [footerProps, ...pages] = await Promise.all([
    fetchFooterProps(),
    ...slugsToFetch.map((slug) =>
      fetchContentPage(slug).catch(() => null as ContentPageData | null)
    ),
  ]);

  // Build a slug → page lookup so each card can grab its editor-
  // managed data without searching.
  const pagesBySlug = new Map<string, ContentPageData>();
  slugsToFetch.forEach((slug, idx) => {
    const page = pages[idx];
    if (page) pagesBySlug.set(slug, page);
  });

  return (
    <>
      <Navbar />
      <PageHero
        title="Take Your Next Step"
        subtitle="Wherever you are with God right now, there's a next step. Pick what feels right - we're here to walk it with you."
        breadcrumbs={[{ label: "Connect", href: "/connect" }]}
      />

      <section className="bg-soft-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {NEXT_STEPS.map((step, i) => {
              const wp = step.wpSlug
                ? pagesBySlug.get(step.wpSlug)
                : null;
              // WP card data wins where present; fall back to bundled
              // values for everything else (and for non-CPT items like
              // Life Groups and Serving).
              const tag = wp?.card?.tag || step.fallback.tag;
              const title = wp?.card?.title || step.fallback.title;
              const description =
                wp?.card?.description || step.fallback.description;
              const image =
                wp?.card?.image || step.fallback.image || BROKEN_IMAGE_PLACEHOLDER;
              const Icon = step.icon;

              const cardContent = (
                <div className="group relative block rounded-2xl overflow-hidden cursor-pointer h-full min-h-[320px] hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20">
                  {/* Background photo */}
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={isPlanningCenterImage(image)}
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />

                  {/* Watermark icon */}
                  <div className="absolute top-4 right-4 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500">
                    <Icon size={100} className="text-white" strokeWidth={1} />
                  </div>

                  {/* Content */}
                  <div className="relative p-7 flex flex-col h-full z-10">
                    <div className="flex items-start mb-auto">
                      <span className="text-white/70 text-xs font-semibold tracking-[0.15em] uppercase bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                        {tag}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                        {title}
                      </h3>
                      <p className="text-white/65 text-sm leading-relaxed mb-4 line-clamp-3 group-hover:text-white/85 transition-colors duration-300">
                        {description}
                      </p>
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10 group-hover:border-white/20 transition-colors">
                        <span className="text-white/70 text-sm font-medium group-hover:text-amber transition-colors duration-300">
                          {step.external ? "Open" : "Explore"}
                        </span>
                        <ArrowRight
                          size={16}
                          className="text-white/40 group-hover:text-amber group-hover:translate-x-1.5 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );

              return (
                <FadeIn key={step.href} delay={i * 0.05}>
                  {step.external ? (
                    <a
                      href={step.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {cardContent}
                    </a>
                  ) : (
                    <Link href={step.href} className="block h-full">
                      {cardContent}
                    </Link>
                  )}
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA - dark band, matches other content-page closers */}
      <section
        className="relative py-20 sm:py-28 text-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(212, 160, 84, 0.15) 0%, transparent 60%), linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)",
        }}
      >
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-amber/40"
        />
        <div className="relative max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Still figuring out where to start?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Reach out - we&apos;ll listen first, then help you find the next
              step that fits where you are.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/25"
            >
              Get in Touch
              <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>

      <Footer {...footerProps} />
    </>
  );
}
