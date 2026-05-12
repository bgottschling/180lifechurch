import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { StaffCard } from "@/components/StaffCard";
import { fetchFooterProps } from "@/lib/data";
import { getLucideIcon } from "@/lib/lucide-icon-map";
import { richTextOnLight } from "@/lib/rich-text-classes";
import { Calendar, MapPin, Mail, ExternalLink } from "lucide-react";
import type { MinistryPageData } from "@/lib/subpage-types";

interface MinistryPageTemplateProps {
  data: MinistryPageData;
}

export async function MinistryPageTemplate({ data }: MinistryPageTemplateProps) {
  const footerProps = await fetchFooterProps();

  // Resolve the editor-picked accent color (or default amber). All
  // downstream sections inherit this color — verse citation, hero
  // icon ring, feature card icons, leader-section accents, etc.
  // Falls back to the brand amber when no accent is set.
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
        breadcrumbs={[
          { label: "Ministries", href: "/ministries" },
          { label: data.title, href: "#" },
        ]}
        image={data.heroImage}
        verse={data.verse}
        accentColor={accent}
        heroIcon={HeroIconComponent}
        heroPattern={data.heroPattern}
      />

      {/* Description — WYSIWYG-authored HTML rendered safely.
          WordPress sanitizes the input via wp_kses_post() before
          it reaches us; the fallback strings are author-trusted.
          Tailwind child selectors style the editor's <p>, <strong>,
          <em>, <a>, <ul>, <ol>, <blockquote> output to match the
          rest of the page without needing the typography plugin. */}
      {data.description && (
        <section className="bg-soft-white py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-6">
            <FadeIn>
              <div
                className={`text-lg ${richTextOnLight}`}
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </FadeIn>
          </div>
        </section>
      )}

      {/* Feature Cards — "pillars" / "values" / "what we stand for".
          Rendered between description and schedule when the editor
          has populated the repeater. Dark background so the cards
          pop, accent-colored icons. */}
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

      {/* Process Steps — horizontal timeline of icon + label + 1-line
          description, with arrow separators on wider screens. Used for
          service flows ("Check-in → Worship → Lesson → Pick-up") or
          onboarding journeys. Light background so the visual rhythm
          alternates with the dark feature-cards section above. */}
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
                      {/* Connector arrow (desktop only) — hides on the
                          final step and on mobile where steps stack. */}
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
                        {/* Tiny step number badge */}
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

      {/* Tier Cards — colored cards for age groups / program tiers
          / tracks. Each card carries its own tint color so the
          groups read at a glance. Falls back to the page accent
          when an editor leaves a card's color blank. */}
      {data.tierCards && data.tierCards.cards.length > 0 && (
        <section className="bg-white py-20 sm:py-24">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-12">
                {data.tierCards.label && (
                  <span
                    className="text-sm font-medium tracking-[0.2em] uppercase"
                    style={{ color: accent }}
                  >
                    {data.tierCards.label}
                  </span>
                )}
                {data.tierCards.heading && (
                  <h2
                    className="text-3xl sm:text-4xl font-bold text-charcoal mt-3"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {data.tierCards.heading}
                  </h2>
                )}
              </div>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.tierCards.cards.map((card, i) => {
                const Icon = getLucideIcon(card.icon);
                const tint = card.color || accent;
                return (
                  <FadeIn key={i} delay={0.05 * i}>
                    <div
                      className="h-full p-6 rounded-2xl border transition-transform duration-300 hover:-translate-y-1"
                      style={{
                        background: `${tint}10`,
                        borderColor: `${tint}33`,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{
                          background: `${tint}25`,
                          border: `1px solid ${tint}55`,
                        }}
                      >
                        <Icon size={20} style={{ color: tint }} />
                      </div>
                      <h3 className="font-bold text-charcoal mb-1">{card.label}</h3>
                      {card.subtitle && (
                        <p className="text-charcoal/65 text-sm mb-2">
                          {card.subtitle}
                        </p>
                      )}
                      {card.time && (
                        <p
                          className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: tint }}
                        >
                          {card.time}
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

      {/* Callout — long-form emphasized text band. Safety policies,
          FAQ, important notices. Light bg with accent-tinted left
          border + optional icon medallion. */}
      {data.callout && (
        <section className="bg-soft-white py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-6">
            <FadeIn>
              <div
                className="rounded-2xl bg-white border-l-4 border border-charcoal/8 p-8 sm:p-10 shadow-sm"
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
                {/* Callout body — WYSIWYG HTML rendered safely with
                    the same rich-text styling as the description. */}
                <div
                  className={richTextOnLight}
                  dangerouslySetInnerHTML={{ __html: data.callout.body }}
                />
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Schedule */}
      {data.schedule && data.schedule.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-6">
            <FadeIn>
              <h2
                className="text-3xl font-bold text-charcoal mb-8"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                When We <span className="text-amber">Meet</span>
              </h2>
            </FadeIn>
            <div className="space-y-4">
              {data.schedule.map((s, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-soft-white border border-charcoal/5">
                    <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0">
                      <Calendar className="text-amber" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal">
                        {s.day} at {s.time}
                      </p>
                      {s.location && (
                        <p className="text-charcoal/50 text-sm flex items-center gap-1.5 mt-1">
                          <MapPin size={14} /> {s.location}
                        </p>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* External Links / Resources */}
      {data.externalLinks && data.externalLinks.length > 0 && (
        <section className="bg-soft-white py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-6">
            <FadeIn>
              <h2
                className="text-3xl font-bold text-charcoal mb-8"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Get <span className="text-amber">Connected</span>
              </h2>
            </FadeIn>
            <div className="space-y-4">
              {data.externalLinks.map((link, i) => (
                <FadeIn key={link.href} delay={i * 0.05}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-5 rounded-xl bg-white border border-charcoal/5 hover:border-amber/30 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 group-hover:bg-amber/20 transition-colors">
                      <ExternalLink className="text-amber" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-charcoal group-hover:text-amber transition-colors">
                        {link.label}
                      </p>
                      {link.description && (
                        <p className="text-charcoal/50 text-sm mt-0.5">
                          {link.description}
                        </p>
                      )}
                    </div>
                    <ExternalLink
                      size={16}
                      className="text-charcoal/30 group-hover:text-amber shrink-0 transition-colors"
                    />
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Leaders */}
      {data.leaders && data.leaders.length > 0 && (
        <section className="bg-soft-white py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <h2
                className="text-3xl font-bold text-charcoal mb-8 text-center"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Meet Our <span className="text-amber">Leaders</span>
              </h2>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.leaders.map((leader, i) => (
                <StaffCard
                  key={leader.name}
                  name={leader.name}
                  role={leader.role}
                  image={leader.image}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      {data.contactEmail && (
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <FadeIn>
              <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="text-amber" size={24} />
              </div>
              <h2
                className="text-3xl font-bold text-charcoal mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Have <span className="text-amber">Questions?</span>
              </h2>
              <p className="text-charcoal/60 mb-6">
                We&apos;d love to hear from you. Reach out and we&apos;ll get back to you soon.
              </p>
              <a
                href={`mailto:${data.contactEmail}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber-light transition-all hover:shadow-lg hover:shadow-amber/25"
              >
                Email Us
                <Mail size={16} />
              </a>
            </FadeIn>
          </div>
        </section>
      )}

      <Footer {...footerProps} />
    </>
  );
}
