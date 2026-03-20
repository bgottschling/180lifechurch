"use client";

import { motion } from "framer-motion";
import { checklistSections } from "@/lib/checklist-data";

interface ProgressBarProps {
  progress: {
    total: number;
    completed: number;
    bySection: Record<string, { total: number; completed: number }>;
  };
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const pct =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  return (
    <div className="bg-white border-b border-charcoal/5 py-3 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Top line: text + percentage */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-charcoal/50">
            {progress.completed} of {progress.total} items completed
          </span>
          <span className="text-sm font-semibold text-amber">{pct}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-charcoal/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Section dots */}
        <div className="flex items-center gap-2 mt-2">
          {checklistSections.map((section) => {
            const sp = progress.bySection[section.id];
            const sectionPct =
              sp && sp.total > 0
                ? Math.round((sp.completed / sp.total) * 100)
                : 0;

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-1.5 group"
              >
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    sectionPct === 100
                      ? "bg-amber"
                      : sectionPct > 0
                        ? "bg-amber/40"
                        : "bg-charcoal/10"
                  }`}
                />
                <span className="text-xs text-charcoal/30 group-hover:text-charcoal/60 transition-colors hidden sm:inline">
                  {section.title}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
