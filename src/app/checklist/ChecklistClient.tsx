"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { ProgressBar } from "@/components/checklist/ProgressBar";
import { ChecklistSection } from "@/components/checklist/ChecklistSection";
import { ChecklistSummary } from "@/components/checklist/ChecklistSummary";
import { checklistSections } from "@/lib/checklist-data";
import { useChecklistState } from "@/lib/useChecklistState";
import { FALLBACK_SETTINGS } from "@/lib/wordpress-fallbacks";
import { ClipboardCheck, Heart, DollarSign, Sparkles, Camera } from "lucide-react";

export default function ChecklistClient() {
  const { values, setValue, progress, resetAll, mounted } =
    useChecklistState();

  return (
    <>
      <Navbar />

      {/* Hero header */}
      <section
        className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(212, 160, 84, 0.15) 0%, transparent 60%), linear-gradient(to bottom, #1A1A1A, #201C16, #1A1A1A)",
        }}
      >
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center mx-auto mb-6">
              <ClipboardCheck className="text-amber" size={28} />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <span className="text-amber text-sm font-medium tracking-[0.2em] uppercase">
              Getting Started
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Discovery Checklist
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
              Help us set up your new website by answering a few questions about
              your church. Fill in what you know now. You can always come back
              and your progress will be saved.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Cost & Credits info panel */}
      <section className="bg-soft-white border-b border-charcoal/5">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <FadeIn>
            <div className="bg-white rounded-2xl border border-charcoal/8 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <Heart className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-charcoal text-lg">
                      This Project is 100% Free
                    </h2>
                    <p className="text-charcoal/50 text-sm">
                      A gift to 180 Life Church from Brandon Gottschling
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="text-amber" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">
                      Pro Bono Ministry Work
                    </p>
                    <p className="text-charcoal/50 text-sm leading-relaxed">
                      Brandon is volunteering all design, development, and
                      deployment work as a form of his ministry. There is no
                      charge to 180 Life Church for this website redesign, and
                      there never will be.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                    <DollarSign className="text-amber" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">
                      Your Only Costs: What You Already Pay
                    </p>
                    <p className="text-charcoal/50 text-sm leading-relaxed">
                      The only expenses are your existing infrastructure: your
                      domain name (typically $10-15/year) and web hosting.
                      We&apos;ll actively look for ways to minimize even those
                      costs. Any optional tools will be discussed together
                      before adding them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* AI photos disclaimer */}
          <FadeIn delay={0.1}>
            <div className="mt-6 flex items-start gap-3 bg-amber/5 border border-amber/15 rounded-xl px-5 py-4">
              <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                <Camera className="text-amber" size={16} />
              </div>
              <div>
                <p className="font-semibold text-charcoal text-sm">
                  About the Photos on the Preview
                </p>
                <p className="text-charcoal/50 text-sm leading-relaxed">
                  The photos currently on the website are AI-generated
                  placeholders. They&apos;ll be replaced with real photography of
                  your congregation and ministries. See the &ldquo;Church Info&rdquo;
                  section below for what photos we&apos;ll need.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Progress bar */}
      {mounted && <ProgressBar progress={progress} />}

      {/* Checklist body */}
      <main className="bg-soft-white min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {!mounted ? (
            /* Loading skeleton */
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-charcoal/5 rounded-lg w-48 mb-4" />
                  <div className="space-y-3">
                    <div className="h-12 bg-charcoal/5 rounded-xl" />
                    <div className="h-12 bg-charcoal/5 rounded-xl" />
                    <div className="h-12 bg-charcoal/5 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {checklistSections.map((section) => (
                <div key={section.id} id={section.id}>
                  <ChecklistSection
                    section={section}
                    values={values}
                    onChange={setValue}
                    sectionProgress={
                      progress.bySection[section.id] ?? {
                        total: 0,
                        completed: 0,
                      }
                    }
                  />
                </div>
              ))}

              <ChecklistSummary
                values={values}
                progress={progress}
                onReset={resetAll}
              />
            </>
          )}
        </div>
      </main>

      <Footer
        contact={FALLBACK_SETTINGS.contact}
        missionStatement={FALLBACK_SETTINGS.missionStatement}
        churchTagline={FALLBACK_SETTINGS.churchTagline}
      />
    </>
  );
}
