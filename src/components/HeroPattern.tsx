/**
 * Hero decoration patterns — inline SVG components that layer over
 * the dark gradient hero on subpages.
 *
 * Mirrors what the bespoke Men's ministry page does with its
 * mountains-dark.svg background, but as themable inline SVGs that
 * pick up each ministry's accent color rather than hard-coded
 * asset files. Editors choose which pattern via a dropdown in
 * wp-admin (ministry_hero_pattern ACF field), each ministry can
 * have a different one, and the rendered SVG tints to the page's
 * accent color automatically.
 *
 * All patterns:
 *   - render at very low opacity (0.08-0.12) so the title stays
 *     legible without needing per-pattern positioning tweaks
 *   - are pointer-events:none so they never block click handlers
 *   - accept a `color` prop and use currentColor for stroke/fill
 *     so accent color flows through cleanly
 *
 * Add a new pattern by:
 *   1. Adding a renderer function below
 *   2. Adding its key to HERO_PATTERNS (the registry)
 *   3. Adding the choice to the ACF select in
 *      wordpress/acf-field-groups.json under ministry_hero_pattern
 *   4. Keep the option keys in sync — the dropdown values must match
 *      the keys in HERO_PATTERNS or the component falls back to null.
 */

import { type ReactNode } from "react";

type PatternProps = { color: string };

/** Soft horizontal flowing waves — peaceful, contemplative. */
function WavesPattern({ color }: PatternProps) {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      style={{ color }}
      aria-hidden
    >
      <path
        d="M0 350 Q 200 300 400 350 T 800 350 T 1200 350 V 600 H 0 Z"
        fill="currentColor"
        opacity="0.06"
      />
      <path
        d="M0 420 Q 200 380 400 420 T 800 420 T 1200 420 V 600 H 0 Z"
        fill="currentColor"
        opacity="0.05"
      />
      <path
        d="M0 490 Q 200 460 400 490 T 800 490 T 1200 490 V 600 H 0 Z"
        fill="currentColor"
        opacity="0.04"
      />
    </svg>
  );
}

/** Silhouette mountain ridges — journey, persistence. */
function MountainsPattern({ color }: PatternProps) {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMax slice"
      style={{ color }}
      aria-hidden
    >
      <path
        d="M0 600 L 0 420 L 140 290 L 260 380 L 380 240 L 520 360 L 640 300 L 800 200 L 940 330 L 1080 280 L 1200 360 L 1200 600 Z"
        fill="currentColor"
        opacity="0.07"
      />
      <path
        d="M0 600 L 0 500 L 100 410 L 230 460 L 360 380 L 500 470 L 640 420 L 780 380 L 920 460 L 1080 410 L 1200 480 L 1200 600 Z"
        fill="currentColor"
        opacity="0.05"
      />
    </svg>
  );
}

/** Scattered stars / sparkles — playful, fresh. */
function DotsPattern({ color }: PatternProps) {
  // Hand-placed star + circle scatter so it doesn't look algorithmic.
  // Star path is the standard 5-pointed star at unit scale; we offset
  // and scale at each occurrence.
  const star = "M0 -10 L 3 -3 L 10 -3 L 5 1 L 7 8 L 0 4 L -7 8 L -5 1 L -10 -3 L -3 -3 Z";
  const stars = [
    { x: 120, y: 80, s: 1.4 },
    { x: 680, y: 120, s: 1.0 },
    { x: 400, y: 50, s: 0.8 },
    { x: 1000, y: 200, s: 1.2 },
    { x: 220, y: 250, s: 0.9 },
    { x: 850, y: 350, s: 1.1 },
    { x: 540, y: 420, s: 0.7 },
    { x: 1100, y: 460, s: 0.9 },
    { x: 60, y: 480, s: 1.0 },
  ];
  const circles = [
    { cx: 320, cy: 200, r: 40 },
    { cx: 760, cy: 250, r: 28 },
    { cx: 980, cy: 80, r: 18 },
    { cx: 180, cy: 380, r: 22 },
  ];
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      style={{ color }}
      aria-hidden
    >
      {stars.map((s, i) => (
        <path
          key={`s${i}`}
          d={star}
          transform={`translate(${s.x} ${s.y}) scale(${s.s})`}
          fill="currentColor"
          opacity="0.12"
        />
      ))}
      {circles.map((c, i) => (
        <circle
          key={`c${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.10"
        />
      ))}
    </svg>
  );
}

/** Radiating rays from upper center — hope, light, sending out. */
function RaysPattern({ color }: PatternProps) {
  const rays = [];
  const centerX = 600;
  const centerY = -200; // off-screen above so rays fan downward
  for (let i = 0; i < 14; i++) {
    const angle = (Math.PI / 13) * i - Math.PI / 2 + Math.PI; // 180° fan downward
    const length = 1100;
    const x2 = centerX + Math.cos(angle) * length;
    const y2 = centerY + Math.sin(angle) * length;
    rays.push({ x1: centerX, y1: centerY, x2, y2, key: i });
  }
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      style={{ color }}
      aria-hidden
    >
      {rays.map((r) => (
        <line
          key={r.key}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.05"
        />
      ))}
      <circle
        cx={centerX}
        cy={centerY + 240}
        r="180"
        fill="currentColor"
        opacity="0.04"
      />
    </svg>
  );
}

/** Connected nodes / network — community, relationships, groups. */
function NetworkPattern({ color }: PatternProps) {
  // Hand-placed nodes connected by lines.
  const nodes = [
    { id: 0, x: 180, y: 180, r: 6 },
    { id: 1, x: 380, y: 100, r: 5 },
    { id: 2, x: 540, y: 240, r: 7 },
    { id: 3, x: 760, y: 160, r: 5 },
    { id: 4, x: 920, y: 280, r: 6 },
    { id: 5, x: 280, y: 360, r: 5 },
    { id: 6, x: 480, y: 440, r: 6 },
    { id: 7, x: 720, y: 400, r: 5 },
    { id: 8, x: 1000, y: 460, r: 6 },
    { id: 9, x: 1080, y: 100, r: 5 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 5],
    [2, 5],
    [5, 6],
    [6, 7],
    [3, 7],
    [7, 8],
    [4, 8],
    [1, 9],
    [3, 9],
  ];
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      style={{ color }}
      aria-hidden
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.08"
        />
      ))}
      {nodes.map((n) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill="currentColor"
          opacity="0.14"
        />
      ))}
    </svg>
  );
}

/** Repeating crosses on a soft grid — sacred, faith-rooted. */
function CrossesPattern({ color }: PatternProps) {
  // Small crosses on a sparse hex-ish grid
  const crosses = [];
  const cols = 7;
  const rows = 4;
  const gapX = 1200 / cols;
  const gapY = 600 / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = gapX * c + gapX / 2 + (r % 2 ? gapX / 2 : 0);
      const y = gapY * r + gapY / 2;
      crosses.push({ x, y, key: `${r}-${c}` });
    }
  }
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      style={{ color }}
      aria-hidden
    >
      {crosses.map((c) => (
        <g key={c.key} transform={`translate(${c.x} ${c.y})`} opacity="0.07">
          <rect x="-1" y="-10" width="2" height="20" fill="currentColor" />
          <rect x="-7" y="-2" width="14" height="2" fill="currentColor" rx="1" />
        </g>
      ))}
    </svg>
  );
}

const HERO_PATTERNS: Record<string, (props: PatternProps) => ReactNode> = {
  waves: WavesPattern,
  mountains: MountainsPattern,
  dots: DotsPattern,
  rays: RaysPattern,
  network: NetworkPattern,
  crosses: CrossesPattern,
};

interface HeroPatternProps {
  /** Pattern key from HERO_PATTERNS. Unknown / falsy renders nothing. */
  pattern?: string;
  /** Color for the pattern strokes/fills (typically the page accent). */
  color: string;
}

/**
 * Render the named hero pattern as a positioned overlay. Returns null
 * for unknown / blank pattern names so the parent can drop this in
 * unconditionally.
 */
export function HeroPattern({ pattern, color }: HeroPatternProps) {
  if (!pattern) return null;
  const Renderer = HERO_PATTERNS[pattern];
  if (!Renderer) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Renderer color={color} />
    </div>
  );
}

/**
 * Exported list of valid pattern keys — used by callers that want to
 * validate editor input or list options.
 */
export const HERO_PATTERN_KEYS = Object.keys(HERO_PATTERNS);
