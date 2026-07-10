#!/usr/bin/env node
/**
 * scripts/new-talk.js
 *
 * Scaffolds a new talk folder with:
 *   - slides.md  (reveal.js markdown — use --- for horizontal, -- for vertical separators)
 *   - meta.yaml  (Pandoc metadata for static builds)
 *   - index.html (reveal.js shell — loads slides.md at runtime via RevealMarkdown)
 *   - assets/    (put images here)
 *
 * Usage:
 *   npm run new -- pro/my-talk-slug "My Talk Title"
 *   npm run new -- misc/my-talk-slug "My Talk Title"
 */
import { mkdir, writeFile, access } from 'fs/promises';
import { constants } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const [slug, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(' ') || slug || 'My New Talk';

if (!slug) {
  console.error('Usage: npm run new -- <category/slug> ["Talk Title"]');
  console.error('  e.g. npm run new -- pro/my-talk "My Talk Title"');
  process.exit(1);
}

const dir = join(ROOT, 'decks', slug);

try {
  await access(dir, constants.F_OK);
  console.error(`❌  Folder "${slug}" already exists.`);
  process.exit(1);
} catch { /* doesn't exist — proceed */ }

await mkdir(dir, { recursive: true });
await mkdir(join(dir, 'assets'), { recursive: true });

// Relative path from deck to src/theme (decks/<a>/<b> → ../../../src/theme).
const depth = slug.split('/').length; // e.g. pro/my-talk → 2
const themePath = '../'.repeat(depth + 1) + 'src/theme';

// ── slides.md (Slidev deck) ──────────────────────────────────────────────
const md = `---
theme: ${themePath}
colorSchema: auto
title: "${title.replace(/"/g, '\\"')}"
author: "François Eoche"
htmlAttrs:
  lang: fr
layout: cover
---

# ${title}

## Introduction

---
layout: section
---

# First Section

---

## A content slide

- Point one
- Point two

---
layout: center
---

## Thank you

*Questions?*
`;

// ── meta.yaml (Pandoc export metadata) ───────────────────────────────────
const meta = `title: "${title.replace(/"/g, '\\"')}"
author: "François Eoche"
lang: fr
`;

await writeFile(join(dir, 'slides.md'), md, 'utf8');
await writeFile(join(dir, 'meta.yaml'), meta, 'utf8');

console.log(`\n✅  Created Slidev deck: decks/${slug}/`);
console.log(`   • decks/${slug}/slides.md   ← Slidev content`);
console.log(`   • decks/${slug}/meta.yaml   ← Pandoc export metadata`);
console.log(`   • decks/${slug}/assets/     ← images`);
console.log(`\n   Preview:  npm run dev`);
console.log(`   Export docs:  npm run export:docs -- --deck ${slug}\n`);
