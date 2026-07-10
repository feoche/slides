// scripts/lib/slidev-normalize.js
import { parse } from '@slidev/parser';

/** Flatten a single parsed Slidev slide to a Pandoc-clean Markdown fragment. */
export function normalizeSlide(slide) {
  let md = slide.content ?? '';

  // Remove <style>…</style> blocks (deck-local CSS has no place in a document).
  md = md.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  // Remove slot markers (::left::, ::right::, ::default::) on their own line.
  md = md.replace(/^::[\w-]+::\s*$/gm, '');
  // Strip v-* directive attributes from tags (v-click, v-clicks, v-motion, v-after…).
  md = md.replace(/\s+v-[\w-]+(="[^"]*")?/g, '');
  // Unwrap <Window …> / </Window> and <template …> / </template> wrappers.
  md = md.replace(/<\/?(?:Window|template)\b[^>]*>/gi, '');

  const fm = slide.frontmatter ?? {};
  const layout = fm.layout ?? '';

  // Section-like slides become top-level document headings.
  if (/^(section|cover|intro)$/.test(layout)) {
    md = md.replace(/^#{1,6}\s+/m, '# ');
  }

  // media-* layouts carry their image in frontmatter; promote it into the body.
  if (layout.startsWith('media') && typeof fm.media === 'string' && fm.media) {
    const rel = fm.media.replace(/^\//, '');
    md = `![](${rel})\n\n${md}`;
  }

  // Collapse 3+ blank lines left behind into a single blank line.
  md = md.replace(/\n{3,}/g, '\n\n');
  return md.trim();
}

/** Parse a Slidev deck's raw Markdown and flatten it to Pandoc-clean Markdown. */
export async function normalizeDeck(raw, filepath) {
  const parsed = await parse(raw, filepath);
  const fragments = parsed.slides
    .map((s) => normalizeSlide(s))
    .filter((f) => f.length > 0);
  return fragments.join('\n\n') + '\n';
}
