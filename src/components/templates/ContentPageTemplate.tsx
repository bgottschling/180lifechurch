import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps } from "@/lib/data";
import type { ContentPageData } from "@/lib/subpage-types";

interface ContentPageTemplateProps {
  data: ContentPageData;
}

export async function ContentPageTemplate({ data }: ContentPageTemplateProps) {
  const footerProps = await fetchFooterProps();

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

      {data.cta && (
        <section
          className="relative py-20 sm:py-28 text-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(212, 160, 84, 0.15) 0%, transparent 60%), linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)",
          }}
        >
          {/* Decorative top border — subtle amber line so the CTA
              band reads as deliberate transition rather than abrupt
              color flip. */}
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
                {data.cta.heading}
              </h2>
              {data.cta.description && (
                <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                  {data.cta.description}
                </p>
              )}
              <a
                href={data.cta.link}
                {...(data.cta.link.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
