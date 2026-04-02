import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps } from "@/lib/data";
import {
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

      {/* Why We Tithe + Give Now */}
      <section
        className="relative -mt-1 pt-10 pb-16 sm:pt-14 sm:pb-24 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 30% 60%, rgba(212, 160, 84, 0.12) 0%, transparent 55%), linear-gradient(to bottom, #1A1A1A 0%, #201C16 40%, #1A1A1A 100%)",
        }}
      >
        {/* Bottom horizon glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-amber/20"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-24 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 100%, rgba(212, 160, 84, 0.18) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Give Now CTA */}
            <FadeIn>
              <div className="text-center lg:text-left">
                <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                  Generosity
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-5"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Why We <span className="text-amber">Tithe</span>
                </h2>
                <p className="text-white/50 leading-relaxed mb-4">
                  A tithe literally means a &quot;tenth&quot; and refers to giving
                  10% of your income to God through the local church. When we
                  tithe, we are acknowledging that everything we have belongs to
                  God and trusting Him to provide.
                </p>
                <p className="text-white/50 leading-relaxed mb-8">
                  Your generous giving supports our ministries, serves our
                  community, covers operational costs, and advances the Gospel
                  locally and around the world.
                </p>
                <div className="relative inline-block group/btn">
                  {/* Glow halo */}
                  <div className="absolute -inset-3 rounded-full bg-amber/20 blur-xl group-hover/btn:bg-amber/30 group-hover/btn:-inset-4 group-hover/btn:blur-2xl transition-all duration-500" />
                  <a
                    href="https://180life.churchcenter.com/giving"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-3 px-10 py-4 bg-amber text-charcoal font-bold rounded-full hover:bg-amber-light transition-all text-lg hover:scale-105 shadow-lg shadow-amber/25"
                  >
                    Give Now
                    <Gift size={20} />
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Right: Scripture pull-quote */}
            <FadeIn delay={0.15}>
              <div className="relative">
                {/* Decorative oversized quote mark */}
                <span
                  className="absolute -top-8 -left-2 text-amber/15 text-[120px] leading-none select-none pointer-events-none"
                  style={{ fontFamily: "Georgia, serif" }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <blockquote className="relative border-l-4 border-amber/40 pl-6 sm:pl-8">
                  <p
                    className="text-white/80 text-xl sm:text-2xl leading-relaxed italic"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Bring the whole tithe into the storehouse, that there may
                    be food in my house. Test me in this, says the Lord
                    Almighty, and see if I will not throw open the floodgates
                    of heaven and pour out so much blessing that there will not be
                    room enough to store it.
                  </p>
                  <footer className="mt-4 text-amber/70 text-sm font-medium tracking-wide uppercase">
                    Malachi 3:10
                  </footer>
                </blockquote>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Other Ways to Give */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <h2
              className="text-3xl font-bold text-charcoal mb-8 text-center"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Other Ways to <span className="text-amber">Give</span>
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {[
              {
                Icon: Smartphone,
                title: "Text to Give",
                desc: "Text any dollar amount to 84321 to give quickly from your phone. First-time givers will receive a registration link.",
              },
              {
                Icon: HandCoins,
                title: "In Person",
                desc: "Drop your gift in an offering envelope during any Sunday service. Envelopes are available at the back of the auditorium.",
              },
              {
                Icon: DollarSign,
                title: "Non-Cash Giving",
                desc: "We accept non-cash gifts such as stock, real estate, and other assets. Contact us for more information.",
              },
              {
                Icon: CreditCard,
                title: "Bank Transfer",
                desc: "Set up one-time or recurring gifts with a debit card, credit card, or bank transfer through Church Center.",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.05}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.Icon className="text-amber" size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-1">{item.title}</h3>
                    <p className="text-charcoal/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Peace University & Transparency */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn>
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-charcoal to-charcoal/95 p-8 h-full">
                {/* Subtle amber glow */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: "radial-gradient(ellipse at 20% 20%, rgba(212, 160, 84, 0.2) 0%, transparent 60%)",
                  }}
                />
                {/* Watermark */}
                <div className="absolute bottom-4 right-4 opacity-[0.06]">
                  <BookOpen size={120} className="text-white" strokeWidth={1} />
                </div>
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center mb-5">
                    <BookOpen className="text-amber" size={20} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">
                    Financial Peace University
                  </h3>
                  <p className="text-white/50 leading-relaxed text-sm mb-3">
                    Want to take control of your finances? Financial Peace
                    University (FPU) is a proven plan that teaches you how to
                    make the right decisions with your money. Through video
                    lessons and group discussions, you will learn how to budget,
                    pay off debt, save for emergencies, and invest for your
                    future.
                  </p>
                  <p className="text-white/50 leading-relaxed text-sm">
                    Contact us to find out when the next FPU class begins at 180
                    Life Church.
                  </p>
                  <a
                    href="https://www.ramseysolutions.com/ramseyplus/financial-peace"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber font-semibold text-sm mt-4 hover:gap-3 transition-all"
                  >
                    Learn More About FPU
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-charcoal to-charcoal/95 p-8 h-full">
                {/* Subtle green glow */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: "radial-gradient(ellipse at 80% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 60%)",
                  }}
                />
                {/* Watermark */}
                <div className="absolute bottom-4 right-4 opacity-[0.06]">
                  <Shield size={120} className="text-white" strokeWidth={1} />
                </div>
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center mb-5">
                    <Shield className="text-green-400" size={20} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">
                    Financial Transparency
                  </h3>
                  <p className="text-white/50 leading-relaxed text-sm">
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
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer {...footerProps} />
    </>
  );
}
