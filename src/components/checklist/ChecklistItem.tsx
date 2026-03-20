"use client";

import { useState } from "react";
import { Check, HelpCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { GuidePanel } from "./GuidePanel";
import type { ChecklistItem as ChecklistItemType } from "@/lib/checklist-data";

interface ChecklistItemProps {
  item: ChecklistItemType;
  value: string | boolean | string[] | undefined;
  onChange: (value: string | boolean | string[]) => void;
}

export function ChecklistItem({ item, value, onChange }: ChecklistItemProps) {
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className="py-4">
      {/* Label row */}
      <div className="flex items-start gap-2 mb-2">
        <label
          htmlFor={item.id}
          className="text-charcoal font-medium text-[15px] leading-snug flex-1"
        >
          {item.label}
        </label>
        {item.guide && (
          <button
            onClick={() => setGuideOpen(!guideOpen)}
            className={cn(
              "shrink-0 p-1 rounded-lg transition-colors",
              guideOpen
                ? "text-amber bg-amber/10"
                : "text-charcoal/30 hover:text-amber hover:bg-amber/5"
            )}
            aria-label={`Help: ${item.label}`}
          >
            <HelpCircle size={18} />
          </button>
        )}
      </div>

      {/* Input */}
      {item.type === "checkbox" && (
        <button
          id={item.id}
          role="checkbox"
          aria-checked={value === true}
          onClick={() => onChange(!value)}
          className="flex items-center gap-3 group"
        >
          <div
            className={cn(
              "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
              value === true
                ? "bg-amber border-amber"
                : "border-charcoal/20 group-hover:border-amber/50"
            )}
          >
            {value === true && <Check size={14} className="text-white" />}
          </div>
          <span className="text-charcoal/60 text-sm">Yes</span>
        </button>
      )}

      {item.type === "text" && (
        <input
          id={item.id}
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={item.placeholder}
          className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-amber/50 transition-colors text-sm"
        />
      )}

      {item.type === "textarea" && (
        <textarea
          id={item.id}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={item.placeholder}
          rows={3}
          className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-amber/50 transition-colors text-sm resize-y"
        />
      )}

      {item.type === "select" && item.options && (
        <div className="relative">
          <select
            id={item.id}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-charcoal focus:outline-none focus:border-amber/50 transition-colors text-sm appearance-none cursor-pointer"
          >
            <option value="">Select an option...</option>
            {item.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/30 pointer-events-none"
          />
        </div>
      )}

      {/* Guide panel */}
      {item.guide && (
        <GuidePanel
          guide={item.guide}
          isOpen={guideOpen}
          onClose={() => setGuideOpen(false)}
        />
      )}
    </div>
  );
}
