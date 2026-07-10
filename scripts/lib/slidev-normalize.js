// scripts/lib/slidev-normalize.js
import { parse } from '@slidev/parser';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * Resolve Vue/Slidev mustache bindings against the deck config.
 * `$frontmatter.key` and `$slidev.configs.key` resolve against `config`
 * (the deck headmatter frontmatter). Unresolved bindings are dropped so no
 * literal `{{ … }}` survives into the document.
 */
export function resolveBindings(md, config = {}) {
  return md.replace(/\{\{\s*(.*?)\s*\}\}/g, (_m, expr) => {
    const match = expr.match(/^\$(?:frontmatter|slidev\.configs)\.([\w.]+)$/);
    if (match && config) {
      const val = match[1]
        .split('.')
        .reduce((o, k) => (o == null ? undefined : o[k]), config);
      if (val != null) return String(val);
    }
    return '';
  });
}

/** Flatten a single parsed Slidev slide to a Pandoc-clean Markdown fragment. */
export function normalizeSlide(slide, config = {}) {
  let md = slide.content ?? '';

  // Remove <style>…</style> blocks (deck-local CSS has no place in a document).
  md = md.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  // Remove HTML comments (speaker notes are excluded from exports).
  md = md.replace(/<!--[\s\S]*?-->/g, '');
  // Remove slot markers (::left::, ::right::, ::default::) on their own line.
  md = md.replace(/^::[\w-]+::\s*$/gm, '');
  // Strip v-* directive attributes from tags (v-click, v-clicks, v-motion, v-after…).
  md = md.replace(/\s+v-[\w-]+(="[^"]*")?/g, '');
  // Unwrap <Window …> / </Window> and <template …> / </template> wrappers,
  // preserving their inner content.
  md = md.replace(/<\/?(?:Window|template)\b[^>]*>/gi, '');
  // Strip any remaining PascalCase Vue components (e.g. <QRCode … />), including
  // multi-line self-closing tags. Lowercase HTML tags (<a>, <div>) are preserved.
  md = md.replace(/<\/?[A-Z][\w]*\b[^>]*>/g, '');
  // Resolve mustache bindings.
  md = resolveBindings(md, config);

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

/**
 * Flatten the slides of an already-parsed deck. `config` supplies binding
 * values; `baseDir` is the directory used to resolve `src:` includes.
 * Recurses into included decks (guarding against include cycles).
 */
async function flattenSlides(slides, config, baseDir, seen) {
  const fragments = [];
  for (const slide of slides) {
    const src = slide.frontmatter?.src;
    if (typeof src === 'string' && src) {
      const incPath = resolve(baseDir, src);
      if (seen.has(incPath)) continue; // include cycle guard
      seen.add(incPath);
      const inc = await parse(readFileSync(incPath, 'utf8'), incPath);
      fragments.push(
        ...(await flattenSlides(inc.slides, config, dirname(incPath), seen)),
      );
      continue;
    }
    const frag = normalizeSlide(slide, config);
    if (frag.length > 0) fragments.push(frag);
  }
  return fragments;
}

/** Parse a Slidev deck's raw Markdown and flatten it to Pandoc-clean Markdown. */
export async function normalizeDeck(raw, filepath) {
  const parsed = await parse(raw, filepath);
  const config = parsed.slides[0]?.frontmatter ?? {};
  const seen = new Set([resolve(filepath)]);
  const fragments = await flattenSlides(
    parsed.slides,
    config,
    dirname(filepath),
    seen,
  );
  return fragments.join('\n\n') + '\n';
}
