import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps } from "@/lib/data";
import { isPlanningCenterImage } from "@/lib/image-utils";
import { Play, ArrowRight, Calendar, User } from "lucide-react";
import type { SermonSeriesData } from "@/lib/subpage-types";

interface SermonSeriesTemplateProps {
  data: SermonSeriesData;
}

export async function SermonSeriesTemplate({ data }: SermonSeriesTemplateProps) {
  const footerProps = await fetchFooterProps();

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

      {/* Sermons Grid or Church Center CTA */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6">
          {data.sermons.length > 0 ? (
            <FadeIn>
              <h2
                className="text-3xl font-bold text-charcoal mb-10"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Messages in This <span className="text-amber">Series</span>
              </h2>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="max-w-2xl mx-auto text-center py-8">
                <div className="w-20 h-20 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-6">
                  <Play className="text-amber ml-1" size={36} />
                </div>
                <h2
                  className="text-3xl font-bold text-charcoal mb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Watch on <span className="text-amber">Church Center</span>
                </h2>
                <p className="text-charcoal/60 text-lg mb-8">
                  All messages from this series are available on our Church Center page.
                </p>
                {data.churchCenterUrl && (
                  <a
                    href={data.churchCenterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-amber text-charcoal font-semibold rounded-full hover:bg-amber/90 hover:shadow-lg hover:shadow-amber/20 transition-all group"
                  >
                    <Play size={18} className="ml-0.5" />
                    Watch This Series
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </FadeIn>
          )}
          {data.sermons.filter((s) => s.youtubeId).length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.sermons
              // Hide sermons without a YouTube video — most often
              // older Church Center episodes that were never uploaded
              // to YouTube. Without filtering these we'd render
              // broken thumbnails and dead-link cards.
              .filter((sermon) => sermon.youtubeId)
              .map((sermon, i) => (
              <FadeIn key={sermon.youtubeId} delay={i * 0.05}>
                <a
                  href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl overflow-hidden h-full min-h-[320px] relative hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20"
                >
                  {/* Background thumbnail (YouTube max-res for sharpness) */}
                  <div className="absolute inset-0">
                    <Image
                      src={`https://i.ytimg.com/vi/${sermon.youtubeId}/hqdefault.jpg`}
                      alt={sermon.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 group-hover:via-black/50 transition-all duration-500" />

                  {/* Play button center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-amber/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 shadow-2xl shadow-amber/30">
                      <Play className="text-charcoal ml-1" size={28} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col p-6 z-10">
                    {/* Top: date badge */}
                    <div className="flex items-start mb-auto">
                      <span className="text-white/70 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 inline-flex items-center gap-1.5">
                        <Calendar size={11} />
                        {sermon.date}
                      </span>
                    </div>

                    {/* Bottom: title + speaker */}
                    <div className="mt-auto">
                      <h3 className="text-white text-xl font-bold mb-2 group-hover:text-amber transition-colors duration-300">
                        {sermon.title}
                      </h3>
                      {sermon.speaker && (
                        <p className="text-white/50 text-sm flex items-center gap-1.5 mb-3">
                          <User size={12} />
                          {sermon.speaker}
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10 group-hover:border-white/20 transition-colors">
                        <span className="text-white/70 text-sm font-medium group-hover:text-amber transition-colors duration-300">
                          Watch Message
                        </span>
                        <ArrowRight
                          size={16}
                          className="text-white/40 group-hover:text-amber group-hover:translate-x-1.5 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Related Series */}
      {data.relatedSeries && data.relatedSeries.length > 0 && (
        <section className="bg-charcoal py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn>
              <h2
                className="text-3xl font-bold text-white mb-10"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                More <span className="text-amber">Series</span>
              </h2>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.relatedSeries.map((series, i) => (
                <FadeIn key={series.slug} delay={i * 0.05}>
                  <Link
                    href={`/sermons/${series.slug}`}
                    className="group block rounded-2xl overflow-hidden h-full min-h-[280px] relative hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/30"
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={series.image}
                        alt={series.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized={isPlanningCenterImage(series.image)}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />
                    <div className="relative h-full flex flex-col justify-end p-7 z-10">
                      <h3 className="text-white text-2xl font-bold mb-2 group-hover:text-amber transition-colors duration-300">
                        {series.title}
                      </h3>
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10 group-hover:border-white/20 transition-colors">
                        <span className="text-white/70 text-sm font-medium group-hover:text-amber transition-colors duration-300">
                          View Series
                        </span>
                        <ArrowRight
                          size={16}
                          className="text-white/40 group-hover:text-amber group-hover:translate-x-1.5 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </Link>
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
