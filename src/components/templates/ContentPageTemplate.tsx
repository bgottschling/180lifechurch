import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps } from "@/lib/data";
import { getLucideIcon } from "@/lib/lucide-icon-map";
import { richTextOnLight } from "@/lib/rich-text-classes";
import type { ContentPageData } from "@/lib/subpage-types";

interface ContentPageTemplateProps {
  data: ContentPageData;
}

export async function ContentPageTemplate({ data }: ContentPageTemplateProps) {
  const footerProps = await fetchFooterProps();

  // Resolve the editor-picked accent color (or default amber). All
  // downstream sections inherit this color: hero icon ring, verse
  // citation, feature card icons, process step badges, callout
  // border, CTA band top line.
  const accent = data.accentColor || "#D4A054";
  const HeroIconComponent = data.heroIcon
    ? getLucideIcon(data.heroIcon)
    : null;

  return (
    <>
      <Navbar />
      <PageHero
        title={data.title}
        subtitle={data.subtitle}
        breadcrumbs={data.breadcrumbs}
        image={data.heroImage}
        verse={data.verse}
        accentColor={accent}
        heroIcon={HeroIconComponent}
        heroPattern={data.heroPattern}
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

      {/* Feature Cards - "pillars" / "what we believe" / "what to
          expect". Rendered after the body sections on a dark band
          so the cards pop visually. Accent-colored icons. */}
      {data.featureCards && data.featureCards.cards.length > 0 && (
        <section
          className="py-20 sm:py-24"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${accent}1f 0%, transparent 55%), linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)`,
          }}
        >
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-12">
                {data.featureCards.label && (
                  <span
                    className="text-sm font-medium tracking-[0.2em] uppercase"
                    style={{ color: accent }}
                  >
                    {data.featureCards.label}
                  </span>
                )}
                {data.featureCards.heading && (
                  <h2
                    className="text-3xl sm:text-4xl font-bold text-white mt-3"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {data.featureCards.heading}
                  </h2>
                )}
              </div>
            </FadeIn>
            <div
              className={`grid gap-5 ${
                data.featureCards.cards.length <= 2
                  ? "sm:grid-cols-2"
                  : data.featureCards.cards.length === 3
                    ? "sm:grid-cols-3"
                    : "sm:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {data.featureCards.cards.map((card, i) => {
                const Icon = getLucideIcon(card.icon);
                return (
                  <FadeIn key={i} delay={0.05 * i}>
                    <div
                      className="h-full p-6 rounded-2xl border bg-white/[0.04] hover:bg-white/[0.08] transition-colors duration-300"
                      style={{ borderColor: `${accent}40` }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{
                          background: `linear-gradient(135deg, ${accent}30, ${accent}15)`,
                          border: `1px solid ${accent}50`,
                        }}
                      >
                        <Icon size={20} style={{ color: accent }} />
                      </div>
                      <h3 className="font-bold text-white mb-2">{card.label}</h3>
                      <p className="text-white/55 text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Process Steps - horizontal timeline used for journeys like
          Partnership (Reach out -> Try -> Join) or Baptism flow. */}
      {data.processSteps && data.processSteps.steps.length > 0 && (
        <section className="bg-soft-white py-20 sm:py-24">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-12">
                {data.processSteps.label && (
                  <span
                    className="text-sm font-medium tracking-[0.2em] uppercase"
                    style={{ color: accent }}
                  >
                    {data.processSteps.label}
                  </span>
                )}
                {data.processSteps.heading && (
                  <h2
                    className="text-3xl sm:text-4xl font-bold text-charcoal mt-3"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {data.processSteps.heading}
                  </h2>
                )}
              </div>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.processSteps.steps.map((step, i) => {
                const Icon = getLucideIcon(step.icon);
                const isLast = i === data.processSteps!.steps.length - 1;
                return (
                  <FadeIn key={i} delay={0.05 * i}>
                    <div className="relative text-center">
                      {!isLast && (
                        <div
                          aria-hidden
                          className="hidden lg:block absolute top-7 left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] h-px"
                          style={{ background: `${accent}40` }}
                        />
                      )}
                      <div
                        className="relative inline-flex w-14 h-14 rounded-full items-center justify-center mb-4 bg-white shadow-sm"
                        style={{ border: `1.5px solid ${accent}50` }}
                      >
                        <Icon size={22} style={{ color: accent }} />
                        <span
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center"
                          style={{ background: accent }}
                        >
                          {i + 1}
                        </span>
                      </div>
                      <h3 className="font-bold text-charcoal mb-1">{step.label}</h3>
                      {step.description && (
                        <p className="text-charcoal/55 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Callout - long-form emphasized band for FAQ, safety, or
          important next-step prompts. */}
      {data.callout && (
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-6">
            <FadeIn>
              <div
                className="rounded-2xl bg-soft-white border-l-4 border border-charcoal/8 p-8 sm:p-10 shadow-sm"
                style={{ borderLeftColor: accent }}
              >
                <div className="flex items-start gap-4 mb-4">
                  {data.callout.icon &&
                    (() => {
                      const Icon = getLucideIcon(data.callout.icon);
                      return (
                        <div
                          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: `${accent}1f`,
                            border: `1px solid ${accent}40`,
                          }}
                        >
                          <Icon size={20} style={{ color: accent }} />
                        </div>
                      );
                    })()}
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-charcoal pt-1"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {data.callout.heading}
                  </h2>
                </div>
                <div
                  className={richTextOnLight}
                  dangerouslySetInnerHTML={{ __html: data.callout.body }}
                />
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {data.cta && (
        <section
          className="relative py-20 sm:py-28 text-center overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${accent}26 0%, transparent 60%), linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)`,
          }}
        >
          {/* Decorative top border - subtle accent-colored line so
              the CTA band reads as deliberate transition rather than
              an abrupt color flip. */}
          <div
            aria-hidden
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px]"
            style={{ background: `${accent}66` }}
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
