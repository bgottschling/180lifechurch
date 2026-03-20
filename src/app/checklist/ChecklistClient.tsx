"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { ProgressBar } from "@/components/checklist/ProgressBar";
import { ChecklistSection } from "@/components/checklist/ChecklistSection";
import { ChecklistSummary } from "@/components/checklist/ChecklistSummary";
import { checklistSections } from "@/lib/checklist-data";
import { useChecklistState } from "@/lib/useChecklistState";
import { ClipboardCheck } from "lucide-react";

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

      {/* Progress bar */}
      {mounted && <ProgressBar progress={progress} />}

      {/* Checklist body */}
      <main className="bg-soft-white min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {!mounted ? (
            /* Loading skeleton */
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
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

      <Footer />
    </>
  );
}
