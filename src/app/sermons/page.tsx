import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { getFooterProps } from "@/lib/wordpress-fallbacks";
import { SERMON_SERIES } from "@/lib/subpage-fallbacks";
import { Play, Youtube } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sermons | 180 Life Church",
  description:
    "Watch and listen to sermons from 180 Life Church. Browse our sermon series and catch up on messages you missed.",
};

export default function SermonsPage() {
  const footerProps = getFooterProps();
  const allSeries = Object.values(SERMON_SERIES);

  return (
    <>
      <Navbar />
      <PageHero
        title="Sermons"
        subtitle="Missed a Sunday? Catch up on our latest messages and browse our sermon series."
        breadcrumbs={[{ label: "Sermons", href: "/sermons" }]}
      />

      {/* Browse by YouTube */}
      <section className="bg-soft-white py-10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <a
              href="https://www.youtube.com/@180lifechurch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-charcoal/10 rounded-full text-charcoal font-medium hover:border-amber/30 hover:shadow-md transition-all"
            >
              <Youtube className="text-red-600" size={20} />
              Watch on YouTube
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Series Grid */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2
              className="text-3xl font-bold text-charcoal mb-10"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Sermon <span className="text-amber">Series</span>
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSeries.map((series, i) => (
              <FadeIn key={series.slug} delay={i * 0.05}>
                <a
                  href={`/sermons/${series.slug}`}
                  className="group block rounded-2xl overflow-hidden border border-charcoal/8 bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video bg-charcoal/5">
                    {series.sermons[0] && (
                      <Image
                        src={`https://i.ytimg.com/vi/${series.sermons[0].youtubeId}/hqdefault.jpg`}
                        alt={series.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-amber flex items-center justify-center">
                        <Play className="text-charcoal ml-1" size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-charcoal group-hover:text-amber transition-colors text-lg">
                      {series.title}
                    </h3>
                    <p className="text-charcoal/50 text-sm mt-1">
                      {series.subtitle}
                    </p>
                    <p className="text-amber text-xs font-medium mt-3">
                      {series.sermons.length} message{series.sermons.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Footer hideChecklistBanner {...footerProps} />
    </>
  );
}
