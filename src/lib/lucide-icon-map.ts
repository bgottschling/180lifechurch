/**
 * Lucide icon name → component map.
 *
 * Lets editors pick an icon by string name in wp-admin (e.g. "Sun",
 * "Shield") and have the corresponding component render in the
 * headless site. The list mirrors the choices defined on the
 * `ministry_hero_icon` and feature-card icon dropdowns in
 * wordpress/acf-field-groups.json — keep them in sync when adding
 * new options.
 *
 * Anything not in this map falls back to `HandHeart` (a safe, warm,
 * gospel-themed icon) so a typo or removed icon never throws at
 * render time.
 */

import {
  Baby,
  BookOpen,
  Calendar,
  Coffee,
  Compass,
  Cross,
  Ear,
  Flame,
  Globe,
  GraduationCap,
  HandHeart,
  Heart,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Mountain,
  Music,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Swords,
  Users,
  type LucideIcon,
} from "lucide-react";

export const LUCIDE_ICON_MAP: Record<string, LucideIcon> = {
  Sun,
  Shield,
  Heart,
  Sparkles,
  HandHeart,
  Users,
  BookOpen,
  Globe,
  Ear,
  HeartHandshake,
  Flame,
  Mountain,
  Baby,
  GraduationCap,
  Cross,
  Music,
  ShieldCheck,
  Compass,
  Calendar,
  MapPin,
  MessageCircle,
  Coffee,
  Swords,
};

/**
 * Look up a Lucide icon component by string name. Falls back to
 * HandHeart if the name isn't in the map — defensive so an editor
 * typo or a removed icon doesn't crash the page.
 */
export function getLucideIcon(name?: string): LucideIcon {
  if (!name) return HandHeart;
  return LUCIDE_ICON_MAP[name] || HandHeart;
}
