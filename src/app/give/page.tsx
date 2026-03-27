import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps } from "@/lib/data";
import {
  Heart,
  Shield,
  DollarSign,
  Gift,
  Smartphone,
  BookOpen,
  HandCoins,
  CreditCard,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Give | 180 Life Church",
  description:
    "Support the mission of 180 Life Church through your generous giving. Give online, by text, in person, or by mail.",
};

export default async function GivePage() {
  const footerProps = await fetchFooterProps();

  return (
    <>
      <Navbar />
      <PageHero
        title="Give"
        subtitle="Your generosity fuels our mission to make and send disciples who love and live like Jesus."
        breadcrumbs={[{ label: "Give", href: "/give" }]}
      />

      {/* Why We Tithe */}
      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                Generosity
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-charcoal mt-3"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Why We <span className="text-amber">Tithe</span>
              </h2>
            </div>
            <div className="space-y-4 text-charcoal/60 leading-relaxed">
              <p>
                A tithe literally means a &quot;tenth&quot; and refers to giving
                10% of your income to God through the local church. When we
                tithe, we are acknowledging that everything we have belongs to
                God and trusting Him to provide.
              </p>
              <p>
                &quot;Bring the whole tithe into the storehouse, that there may
                be food in my house. Test me in this,&quot; says the Lord
                Almighty, &quot;and see if I will not throw open the floodgates
                of heaven and pour out so much blessing that there will not be
                room enough to store it.&quot; (Malachi 3:10)
              </p>
              <p>
                Your generous giving supports our ministries, serves our
                community, covers operational costs, and advances the Gospel
                locally and around the world.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Give Online CTA */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="text-amber" size={28} />
            </div>
            <h2
              className="text-3xl font-bold text-charcoal mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Give <span className="text-amber">Online</span>
            </h2>
            <p className="text-charcoal/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Give securely online through our giving platform. You can make a
              one-time gift or set up recurring giving.
            </p>
            <a
              href="https://180life.churchcenter.com/giving"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-amber text-charcoal font-bold rounded-full hover:bg-amber-light transition-all hover:shadow-2xl hover:shadow-amber/30 text-lg hover:scale-105"
            >
              Give Now
              <Gift size={20} />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Ways to Give */}
      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2
              className="text-3xl font-bold text-charcoal mb-10 text-center"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Ways to <span className="text-amber">Give</span>
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                Icon: CreditCard,
                title: "Online",
                desc: "Give securely through Church Center. Set up one-time or recurring gifts with a debit card, credit card, or bank transfer.",
                color: "from-teal/80 to-charcoal/90",
              },
              {
                Icon: Smartphone,
                title: "Text to Give",
                desc: "Text any dollar amount to 84321 to give quickly from your phone. First-time givers will receive a registration link.",
                color: "from-amber/70 to-charcoal/90",
              },
              {
                Icon: HandCoins,
                title: "In Person",
                desc: "Drop your gift in an offering envelope during any Sunday service. Envelopes are available at the back of the auditorium.",
                color: "from-indigo-500/70 to-charcoal/90",
              },
              {
                Icon: DollarSign,
                title: "Non-Cash Giving",
                desc: "We accept non-cash gifts such as stock, real estate, and other assets. Contact us for more information.",
                color: "from-emerald-600/70 to-charcoal/90",
              },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.05}>
                <div className="group relative rounded-2xl overflow-hidden h-full min-h-[240px] flex flex-col hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color}`} />

                  {/* Watermark */}
                  <div className="absolute top-3 right-3 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500">
                    <card.Icon size={100} className="text-white" strokeWidth={1} />
                  </div>

                  {/* Content */}
                  <div className="relative p-6 flex flex-col flex-1 z-10 text-center">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mx-auto mb-4">
                      <card.Icon className="text-white" size={20} />
                    </span>
                    <h3 className="text-white text-lg font-bold mb-2">{card.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Peace University */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="bg-soft-white rounded-2xl border border-charcoal/8 p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="text-amber" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal text-lg mb-2">
                    Financial Peace University
                  </h3>
                  <p className="text-charcoal/60 leading-relaxed mb-3">
                    Want to take control of your finances? Financial Peace
                    University (FPU) is a proven plan that teaches you how to
                    make the right decisions with your money. Through video
                    lessons and group discussions, you will learn how to budget,
                    pay off debt, save for emergencies, and invest for your
                    future.
                  </p>
                  <p className="text-charcoal/60 leading-relaxed">
                    Contact us to find out when the next FPU class begins at 180
                    Life Church.
                  </p>
                  <a
                    href="https://www.ramseysolutions.com/ramseyplus/financial-peace"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber font-semibold text-sm mt-3 hover:underline"
                  >
                    Learn More About FPU
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Financial Transparency */}
      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="bg-white rounded-2xl border border-charcoal/8 p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal text-lg mb-2">
                    Financial Transparency
                  </h3>
                  <p className="text-charcoal/60 leading-relaxed">
                    We take stewardship seriously. 180 Life Church is committed
                    to financial integrity and transparency. Our Elders provide
                    accountability and counsel regarding major financial and
                    strategic decisions. Your gifts are used to support our
                    ministries, serve our community, and advance the Gospel. If
                    you have questions about how funds are used, please reach out
                    to our Elders at{" "}
                    <a
                      href="mailto:elders@180lifechurch.org"
                      className="text-amber hover:underline"
                    >
                      elders@180lifechurch.org
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer hideChecklistBanner {...footerProps} />
    </>
  );
}
