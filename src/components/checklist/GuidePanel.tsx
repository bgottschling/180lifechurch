"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { GuideContent } from "@/lib/checklist-data";

interface GuidePanelProps {
  guide: GuideContent;
  isOpen: boolean;
  onClose: () => void;
}

export function GuidePanel({ guide, isOpen, onClose }: GuidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="mt-3 bg-amber/5 border border-amber/20 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-charcoal font-semibold text-sm">
                {guide.title}
              </h4>
              <button
                onClick={onClose}
                className="text-charcoal/40 hover:text-charcoal transition-colors p-0.5"
                aria-label="Close guide"
              >
                <X size={16} />
              </button>
            </div>
            <ol className="space-y-2">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-charcoal/70 leading-relaxed">
                  <span className="text-amber font-semibold shrink-0">
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
