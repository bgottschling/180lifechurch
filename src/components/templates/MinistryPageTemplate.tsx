import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { StaffCard } from "@/components/StaffCard";
import { fetchFooterProps } from "@/lib/data";
import { getLucideIcon } from "@/lib/lucide-icon-map";
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

      {/* Description */}
      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6">
          {data.description.map((p, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <p className="text-charcoal/70 leading-relaxed mb-4 text-lg">{p}</p>
            </FadeIn>
          ))}
        </div>
      </section>

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
