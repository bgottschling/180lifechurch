/**
 * Shared Tailwind class string for rendering WordPress WYSIWYG /
 * rich-text output through `dangerouslySetInnerHTML`.
 *
 * Uses Tailwind's [&_*] child-selector syntax to style nested HTML
 * elements emitted by the editor (paragraphs, bold, italic, links,
 * lists, blockquotes) without needing the `@tailwindcss/typography`
 * plugin. The rules cover everything the ACF "basic" WYSIWYG toolbar
 * can produce.
 *
 * Two variants:
 *   - richTextOnLight  — body color charcoal/70, links amber-dark
 *   - richTextOnDark   — body color white/65, links amber
 *
 * Both add bottom margin to paragraphs and list items so spacing
 * reads naturally between mixed paragraph + list content.
 *
 * Safety: WordPress sanitizes WYSIWYG content server-side via
 * wp_kses_post() before it reaches the REST API. The fallback
 * content authored in TypeScript is also trusted. So using
 * dangerouslySetInnerHTML for either source is safe.
 */

export const richTextOnLight = [
  // Paragraphs
  "[&_p]:leading-relaxed",
  "[&_p]:text-charcoal/70",
  "[&_p]:mb-4",
  "[&_p:last-child]:mb-0",
  // Inline emphasis
  "[&_strong]:font-bold",
  "[&_strong]:text-charcoal",
  "[&_em]:italic",
  // Links
  "[&_a]:text-amber-dark",
  "[&_a]:underline",
  "[&_a]:underline-offset-2",
  "[&_a]:decoration-amber/40",
  "[&_a:hover]:text-amber",
  "[&_a:hover]:decoration-amber",
  // Lists
  "[&_ul]:list-disc",
  "[&_ul]:pl-6",
  "[&_ul]:mb-4",
  "[&_ol]:list-decimal",
  "[&_ol]:pl-6",
  "[&_ol]:mb-4",
  "[&_li]:mb-1.5",
  "[&_li]:text-charcoal/70",
  "[&_li]:leading-relaxed",
  // Blockquotes
  "[&_blockquote]:border-l-4",
  "[&_blockquote]:border-amber",
  "[&_blockquote]:pl-5",
  "[&_blockquote]:italic",
  "[&_blockquote]:text-charcoal/60",
  "[&_blockquote]:my-4",
].join(" ");

export const richTextOnDark = [
  "[&_p]:leading-relaxed",
  "[&_p]:text-white/65",
  "[&_p]:mb-4",
  "[&_p:last-child]:mb-0",
  "[&_strong]:font-bold",
  "[&_strong]:text-white",
  "[&_em]:italic",
  "[&_a]:text-amber",
  "[&_a]:underline",
  "[&_a]:underline-offset-2",
  "[&_a]:decoration-amber/40",
  "[&_a:hover]:text-amber-light",
  "[&_a:hover]:decoration-amber",
  "[&_ul]:list-disc",
  "[&_ul]:pl-6",
  "[&_ul]:mb-4",
  "[&_ol]:list-decimal",
  "[&_ol]:pl-6",
  "[&_ol]:mb-4",
  "[&_li]:mb-1.5",
  "[&_li]:text-white/65",
  "[&_li]:leading-relaxed",
  "[&_blockquote]:border-l-4",
  "[&_blockquote]:border-amber",
  "[&_blockquote]:pl-5",
  "[&_blockquote]:italic",
  "[&_blockquote]:text-white/55",
  "[&_blockquote]:my-4",
].join(" ");
