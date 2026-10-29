#!/usr/bin/env node
/**
 * scripts/new-talk.js
 *
 * Scaffolds a new Slidev deck under `talks/<category>/<slug>/` from
 * `talks/slides.example.md`:
 *   - slides.md  (copy of the example, with title, date and relative paths filled in)
 *   - meta.yaml  (Pandoc metadata for `npm run export:docs`)
 *   - public/    (put images/videos here, reference them as `/my-image.jpg`)
 *
 * The folder may already exist (e.g. holding an `outline.md`); only an existing
 * `slides.md` is refused.
 *
 * Usage:
 *   npm run new -- pro/my-talk-slug "My Talk Title"
 *   npm run new -- misc/my-talk-slug "My Talk Title"
 */
import { mkdir, readFile, writeFile, access } from 'fs/promises';
import { constants } from 'fs';
import { join } from 'path';
import { TALKS, discoverBoards } from './boards.js';

const EXAMPLE = join(TALKS, 'slides.example.md');
const CATEGORIES = ['pro', 'misc'];

const [slug, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(' ') || slug?.split('/').pop() || 'My New Talk';
const parts = slug?.split('/') ?? [];

if (parts.length < 2 || !CATEGORIES.includes(parts[0]) || parts.includes('..') || parts.includes('')) {
  console.error('Usage: npm run new -- <pro|misc>/<slug> ["Talk Title"]');
  console.error('  e.g. npm run new -- pro/my-talk "My Talk Title"');
  process.exit(1);
}

const dir = join(TALKS, slug);

try {
  await access(join(dir, 'slides.md'), constants.F_OK);
  console.error(`❌  "talks/${slug}/slides.md" already exists.`);
  process.exit(1);
} catch { /* doesn't exist — proceed */ }

// The example's relative paths assume talks/<category>/<slug>/; rebase them on the real depth.
const up = '../'.repeat(parts.length + 1); // talks/pro/my-talk → ../../../ (repo root)
const today = new Date().toISOString().slice(0, 10);
// JSON strings are valid YAML double-quoted scalars, so titles with ":" or quotes stay safe.
const yamlTitle = JSON.stringify(title);

// ── slides.md (Slidev deck) ──────────────────────────────────────────────
const md = (await readFile(EXAMPLE, 'utf8'))
  .replace(/^# =+\n# SLIDES EXAMPLE[\s\S]*?^# =+\n\n/m, '') // drop the "how to use me" banner
  .replace(/^(\s*\w+): My Talk Title$/gm, `$1: ${yamlTitle}`)
  .replace(/^date: .*$/m, `date: ${today}`)
  .replace('theme: "../../../src/theme"', `theme: "${up}src/theme"`)
  .replaceAll('src: ../../../src/common/', `src: ${up}src/common/`);

// ── meta.yaml (Pandoc export metadata) ───────────────────────────────────
const meta = `title: ${yamlTitle}
author: "François Eoche"
lang: fr
`;

await mkdir(join(dir, 'public'), { recursive: true });
await writeFile(join(dir, 'slides.md'), md, 'utf8');
await writeFile(join(dir, 'meta.yaml'), meta, 'utf8');

console.log(`\n✅  Created Slidev deck: talks/${slug}/`);
console.log(`   • talks/${slug}/slides.md   ← Slidev content (from slides.example.md)`);
console.log(`   • talks/${slug}/meta.yaml   ← Pandoc export metadata`);
console.log(`   • talks/${slug}/public/     ← images & videos`);
// Suggest the short folder name only when it's unique among all boards.
const short = parts.at(-1);
const unique = discoverBoards().filter((b) => b.slug.split('/').pop() === short).length === 1;
console.log(`\n   Preview:  pnpm dev ${unique ? short : slug}`);
console.log(`   Export docs:  npm run export:docs -- --deck ${slug}\n`);
