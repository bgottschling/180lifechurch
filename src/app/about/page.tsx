import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps, fetchContentPage } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

// SEO metadata mirrors the existing /about page on 180lifechurch.org
// (WordPress + AIOSEO) so rankings transfer to the headless site.
// See docs/seo-audit-current-site.md.
export const metadata: Metadata = {
  title: "Contemporary Church in West Hartford, CT | 180 Life Church",
  description:
    "Looking for a church near you in the West Hartford, CT area? Info about our story, worship, mission and beliefs. Learn what our Sunday church services are like.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  // /about is now scoped to "the story of the church" — mission,
  // history, what Sundays are like. The full next-step journey
  // (partnership, baptism, life groups, new to faith, etc.) lives
  // at /connect and is reachable from the top-nav dropdown. About
  // keeps a small "What's Next" pointer to Connect at the bottom
  // for visitors who finish reading and want a next click.
  const [footerProps, data] = await Promise.all([
    fetchFooterProps(),
    fetchContentPage("about"),
  ]);

  if (!data) return null;

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

      {/* Want to dig deeper? — compact pointer to the /connect hub
          and key destinations. Used to be a full 4-card "Next Steps"
          grid; trimmed in favor of letting /about stay focused on
          the church's story while the Connect hub owns the next-step
          journey. The full grid still lives at /connect for visitors
          who want it. */}
      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-8">
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                What&apos;s Next
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-charcoal mt-3 mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Want to <span className="text-amber">dig deeper?</span>
              </h2>
              <p className="text-charcoal/60 leading-relaxed max-w-xl mx-auto">
                Wherever you are with God right now, there&apos;s a next step.
                Browse partnership, baptism, life groups, serving, and more on
                the Connect hub.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/connect"
                className="inline-flex items-center gap-2 px-7 py-3 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/25 group"
              >
                Explore Connect
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/leadership"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white border border-charcoal/15 text-charcoal font-semibold rounded-full hover:border-amber/40 hover:bg-cream transition-all"
              >
                Meet Our Team
              </Link>
              <Link
                href="/ministries"
                className="inline-flex items-center gap-2 px-7 py-3 bg-white border border-charcoal/15 text-charcoal font-semibold rounded-full hover:border-amber/40 hover:bg-cream transition-all"
              >
                Our Ministries
              </Link>
            </div>
          </FadeIn>
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
