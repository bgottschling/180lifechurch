"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { checklistSections } from "./checklist-data";

const STORAGE_KEY = "180lc-checklist";

type ChecklistValues = Record<string, string | boolean | string[]>;

interface SectionProgress {
  total: number;
  completed: number;
}

interface ChecklistProgress {
  total: number;
  completed: number;
  bySection: Record<string, SectionProgress>;
}

function isCompleted(value: string | boolean | string[] | undefined): boolean {
  if (value === undefined) return false;
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.length > 0;
  return value.trim().length > 0;
}

function calculateProgress(values: ChecklistValues): ChecklistProgress {
  let total = 0;
  let completed = 0;
  const bySection: Record<string, SectionProgress> = {};

  for (const section of checklistSections) {
    let sectionTotal = 0;
    let sectionCompleted = 0;

    for (const item of section.items) {
      sectionTotal++;
      total++;
      if (isCompleted(values[item.id])) {
        sectionCompleted++;
        completed++;
      }
    }

    bySection[section.id] = { total: sectionTotal, completed: sectionCompleted };
  }

  return { total, completed, bySection };
}

export function useChecklistState() {
  const [values, setValues] = useState<ChecklistValues>({});
  const [mounted, setMounted] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setValues(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
    setMounted(true);
  }, []);

  // Debounced save to localStorage
  const saveToStorage = useCallback((newValues: ChecklistValues) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newValues));
      } catch {
        // Ignore storage errors
      }
    }, 300);
  }, []);

  const setValue = useCallback(
    (id: string, value: string | boolean | string[]) => {
      setValues((prev) => {
        const next = { ...prev, [id]: value };
        saveToStorage(next);
        return next;
      });
    },
    [saveToStorage]
  );

  const resetAll = useCallback(() => {
    setValues({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const progress = calculateProgress(values);

  return { values, setValue, progress, resetAll, mounted };
}
