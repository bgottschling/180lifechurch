import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | 180 Life Church",
  description:
    "Terms of use for the 180 Life Church website.",
};

export default async function TermsPage() {
  const footerProps = await fetchFooterProps();

  return (
    <>
      <Navbar />
      <PageHero
        title="Terms of Use"
        subtitle="Please review the terms governing use of this website."
        breadcrumbs={[{ label: "Terms", href: "/terms" }]}
      />

      <section className="bg-soft-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="prose prose-charcoal max-w-none space-y-6">
              <p className="text-charcoal/60 text-sm">
                Last updated: March 2026
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Acceptance of Terms
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                By accessing and using the 180 Life Church website, you agree to
                comply with and be bound by these terms of use. If you do not
                agree, please do not use this website.
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Use of Content
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                All content on this website, including text, images, graphics,
                and videos, is the property of 180 Life Church or its content
                providers. You may view and download content for personal,
                non-commercial use only. Reproduction, distribution, or
                modification of content without prior written permission is
                prohibited.
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                External Links
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                This website may contain links to third-party websites. These
                links are provided for convenience and do not imply endorsement.
                180 Life Church is not responsible for the content or privacy
                practices of external sites.
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Disclaimer
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                This website is provided &quot;as is&quot; without warranties of
                any kind, either express or implied. 180 Life Church does not
                guarantee that the website will be available at all times or that
                the content is free of errors.
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Changes to Terms
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                180 Life Church reserves the right to modify these terms at any
                time. Continued use of the website following any changes
                constitutes acceptance of the updated terms.
              </p>

              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Contact
              </h2>
              <p className="text-charcoal/70 leading-relaxed">
                Questions about these terms can be directed to{" "}
                <a
                  href="mailto:info@180lifechurch.org"
                  className="text-amber hover:underline"
                >
                  info@180lifechurch.org
                </a>
                .
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer {...footerProps} />
    </>
  );
}
