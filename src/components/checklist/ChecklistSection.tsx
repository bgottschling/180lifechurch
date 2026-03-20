"use client";

import { FadeIn } from "../FadeIn";
import { ChecklistItem } from "./ChecklistItem";
import type { ChecklistSection as SectionType } from "@/lib/checklist-data";

interface ChecklistSectionProps {
  section: SectionType;
  values: Record<string, string | boolean | string[]>;
  onChange: (id: string, value: string | boolean | string[]) => void;
  sectionProgress: { total: number; completed: number };
}

export function ChecklistSection({
  section,
  values,
  onChange,
  sectionProgress,
}: ChecklistSectionProps) {
  const Icon = section.icon;
  const pct =
    sectionProgress.total > 0
      ? Math.round(
          (sectionProgress.completed / sectionProgress.total) * 100
        )
      : 0;

  return (
    <FadeIn>
      <div className="mb-12">
        {/* Section header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center shrink-0">
            <Icon className="text-amber" size={22} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2
                className="text-2xl font-bold text-charcoal"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {section.title}
              </h2>
              <span className="text-xs font-medium text-charcoal/40 bg-charcoal/5 px-2.5 py-1 rounded-full">
                {sectionProgress.completed}/{sectionProgress.total}
              </span>
            </div>
            <p className="text-charcoal/50 text-sm">{section.description}</p>
          </div>
        </div>

        {/* Progress bar for section */}
        <div className="h-1 bg-charcoal/5 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-amber rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Items */}
        <div className="divide-y divide-charcoal/5">
          {section.items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              value={values[item.id]}
              onChange={(val) => onChange(item.id, val)}
            />
          ))}
        </div>
      </div>
    </FadeIn>
  );
}
