import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { getFooterProps } from "@/lib/wordpress-fallbacks";
import { Play } from "lucide-react";
import type { SermonSeriesData } from "@/lib/subpage-types";

interface SermonSeriesTemplateProps {
  data: SermonSeriesData;
}

export function SermonSeriesTemplate({ data }: SermonSeriesTemplateProps) {
  const footerProps = getFooterProps();

  return (
    <>
      <Navbar />
      <PageHero
        title={data.title}
        subtitle={data.subtitle}
        breadcrumbs={[
          { label: "Sermons", href: "/sermons" },
          { label: data.title, href: "#" },
        ]}
      />

      {/* Description */}
      {data.description.length > 0 && (
        <section className="bg-soft-white py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-6">
            {data.description.map((p, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <p className="text-charcoal/70 leading-relaxed mb-4 text-lg">{p}</p>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Sermons Grid */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <h2
              className="text-3xl font-bold text-charcoal mb-10"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Messages in This <span className="text-amber">Series</span>
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.sermons.map((sermon, i) => (
              <FadeIn key={sermon.youtubeId} delay={i * 0.05}>
                <a
                  href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl overflow-hidden border border-charcoal/8 hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video bg-charcoal/5">
                    <Image
                      src={`https://i.ytimg.com/vi/${sermon.youtubeId}/hqdefault.jpg`}
                      alt={sermon.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-amber flex items-center justify-center">
                        <Play className="text-charcoal ml-1" size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-charcoal group-hover:text-amber transition-colors">
                      {sermon.title}
                    </h3>
                    <p className="text-charcoal/50 text-sm mt-1">
                      {sermon.date}
                      {sermon.speaker && ` \u00B7 ${sermon.speaker}`}
                    </p>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Related Series */}
      {data.relatedSeries && data.relatedSeries.length > 0 && (
        <section className="bg-soft-white py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn>
              <h2
                className="text-3xl font-bold text-charcoal mb-10"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                More <span className="text-amber">Series</span>
              </h2>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.relatedSeries.map((series, i) => (
                <FadeIn key={series.slug} delay={i * 0.05}>
                  <a
                    href={`/sermons/${series.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-charcoal/8 bg-white hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-video bg-charcoal/5">
                      <Image
                        src={series.image}
                        alt={series.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-charcoal group-hover:text-amber transition-colors">
                        {series.title}
                      </h3>
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer {...footerProps} />
    </>
  );
}
