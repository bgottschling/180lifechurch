import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { FadeIn } from "@/components/FadeIn";
import { fetchFooterProps, fetchAllSermonSeries } from "@/lib/data";
import { Play, Youtube, ArrowRight, Clock, BookOpen } from "lucide-react";
import type { Metadata } from "next";

// Sermons hub. /messages 301s here for SEO continuity.
export const metadata: Metadata = {
  title: "Sermons | 180 Life Church",
  description:
    "Watch and listen to sermons from 180 Life Church in West Hartford, CT. Browse our current and past sermon series.",
  alternates: { canonical: "/sermons" },
};

export default async function SermonsPage() {
  const [footerProps, sermonData] = await Promise.all([
    fetchFooterProps(),
    fetchAllSermonSeries(),
  ]);
  const allSeries = Object.values(sermonData);
  const [currentSeries, ...pastSeries] = allSeries;

  return (
    <>
      <Navbar />
      <PageHero
        title="Sermons"
        subtitle="Missed a Sunday? Catch up on our latest messages and browse our sermon series."
        breadcrumbs={[{ label: "Sermons", href: "/sermons" }]}
      />

      {/* Current Series -- Featured Hero Card */}
      {currentSeries && (
        <section className="bg-charcoal py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn>
              <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
                Current Series
              </span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <Link
                href={`/sermons/${currentSeries.slug}`}
                className="group block mt-8 rounded-2xl overflow-hidden relative min-h-[400px] sm:min-h-[480px]"
              >
                {/* Background thumbnail */}
                {currentSeries.sermons[0] && (
                  <Image
                    src={`https://i.ytimg.com/vi/${currentSeries.sermons[0].youtubeId}/maxresdefault.jpg`}
                    alt={currentSeries.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 1152px"
                    priority
                  />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

                {/* Play button center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-amber/90 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 shadow-2xl shadow-amber/30">
                    <Play className="text-charcoal ml-1" size={36} />
                  </div>
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-amber/80 text-xs font-semibold tracking-[0.15em] uppercase bg-amber/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-amber/20">
                      <BookOpen size={12} className="inline -mt-0.5 mr-1.5" />
                      {currentSeries.sermons.length} message{currentSeries.sermons.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-white/50 text-xs font-medium bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                      <Clock size={12} className="inline -mt-0.5 mr-1.5" />
                      {currentSeries.sermons[0]?.date}
                    </span>
                  </div>
                  <h2
                    className="text-white text-3xl sm:text-5xl font-bold mb-3"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {currentSeries.title}
                  </h2>
                  <p className="text-white/60 text-lg max-w-2xl mb-6">
                    {currentSeries.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-2 text-amber font-semibold group-hover:gap-3 transition-all duration-300">
                    Watch Series
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Browse Links */}
      <section className="bg-soft-white py-10">
        <div className="max-w-3xl mx-auto px-6 text-center flex flex-wrap items-center justify-center gap-4">
          <FadeIn>
            <a
              href="https://www.youtube.com/@180lifechurch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-charcoal/10 rounded-full text-charcoal font-medium hover:border-red-500/30 hover:shadow-md transition-all group"
            >
              <Youtube className="text-red-600 group-hover:scale-110 transition-transform" size={20} />
              Watch on YouTube
            </a>
          </FadeIn>
          <FadeIn delay={0.1}>
            <a
              href="https://180life.churchcenter.com/channels/12038/series"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-charcoal/10 rounded-full text-charcoal font-medium hover:border-amber/30 hover:shadow-md transition-all group"
            >
              <Play className="text-amber group-hover:scale-110 transition-transform" size={20} />
              Full Message Archive
            </a>
          </FadeIn>
        </div>
      </section>

      {/* Past Series Grid */}
      {pastSeries.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn>
              <h2
                className="text-3xl font-bold text-charcoal mb-10"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Past <span className="text-amber">Series</span>
              </h2>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastSeries.map((series, i) => {
                const hasVideos = series.sermons.length > 0;
                const href = hasVideos
                  ? `/sermons/${series.slug}`
                  : series.churchCenterUrl || `/sermons/${series.slug}`;
                const isExternal = !hasVideos && !!series.churchCenterUrl;
                const thumbnail = series.sermons[0]
                  ? `https://i.ytimg.com/vi/${series.sermons[0].youtubeId}/hqdefault.jpg`
                  : null;

                const CardWrapper = isExternal ? "a" : Link;
                const cardProps = isExternal
                  ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
                  : { href };

                return (
                  <FadeIn key={series.slug} delay={Math.min(i, 8) * 0.05}>
                    <CardWrapper
                      {...cardProps}
                      className="group block rounded-2xl overflow-hidden h-full min-h-[360px] relative hover:-translate-y-1.5 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20"
                    >
                      {/* Background */}
                      <div className="absolute inset-0">
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt={series.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-charcoal via-charcoal/90 to-amber/20" />
                        )}
                      </div>

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-500" />

                      {/* Play icon watermark */}
                      <div className="absolute top-4 right-4 opacity-[0.07] group-hover:opacity-[0.15] transition-opacity duration-500">
                        <Play size={100} className="text-white" strokeWidth={1} />
                      </div>

                      {/* Content */}
                      <div className="relative h-full flex flex-col p-7 z-10">
                        {/* Top: badges */}
                        <div className="flex items-start gap-2 mb-auto flex-wrap">
                          {hasVideos ? (
                            <span className="text-white/70 text-xs font-semibold tracking-[0.15em] uppercase bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                              {series.sermons.length} message{series.sermons.length !== 1 ? "s" : ""}
                            </span>
                          ) : (
                            <span className="text-amber/80 text-xs font-semibold tracking-[0.15em] uppercase bg-amber/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-amber/20">
                              Church Center
                            </span>
                          )}
                          {series.dateRange && (
                            <span className="text-white/50 text-xs bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
                              {series.dateRange}
                            </span>
                          )}
                        </div>

                        {/* Bottom: title + action */}
                        <div className="mt-auto">
                          <h3 className="text-white text-2xl font-bold mb-2">
                            {series.title}
                          </h3>
                          <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-white/80 transition-colors duration-300">
                            {series.subtitle}
                          </p>
                          <div className="flex items-center gap-2 pt-3 border-t border-white/10 group-hover:border-white/20 transition-colors">
                            <span className="text-white/70 text-sm font-medium group-hover:text-amber transition-colors duration-300">
                              {hasVideos ? "Watch Series" : "View on Church Center"}
                            </span>
                            <ArrowRight
                              size={16}
                              className="text-white/40 group-hover:text-amber group-hover:translate-x-1.5 transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    </CardWrapper>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer {...footerProps} />
    </>
  );
}
