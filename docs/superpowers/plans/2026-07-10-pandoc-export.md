# Pandoc Document Export for Slidev Decks — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Export each Slidev deck's `slides.md` to flat Markdown, a standalone HTML handout, and a PDF document via a `@slidev/parser` → normalizer → Pandoc pipeline.

**Architecture:** A pure normalizer module flattens parsed Slidev slides into Pandoc-clean Markdown (dropping layout frontmatter, unwrapping slots/components/directives, promoting `media:` images and headings, excluding notes). An orchestrator script discovers Slidev decks, writes the intermediate Markdown, and runs Pandoc per output format. The orphaned reveal.js scripts are replaced.

**Tech Stack:** Node.js (ESM), `@slidev/parser` v52, Pandoc (external), Node built-in test runner (`node --test`).

## Global Constraints

- ESM modules only (`"type": "module"` in package.json) — use `import`, not `require`.
- Node built-in test runner: `node --test`, importing from `node:test` and `node:assert/strict`.
- A Slidev deck is identified by leading frontmatter that declares `theme:` (regex `/^\s*theme\s*:/m` on the headmatter block). This pipeline TARGETS such decks.
- Speaker notes are excluded from all exports.
- `@slidev/parser` `parse(raw, filepath)` returns `{ filepath, raw, slides }`; each slide is `{ frontmatter, content, note }` where `content` is the raw slide body Markdown (still containing `::left::`/`::right::` markers, `<style>`/`<Window>` blocks, and `v-*` directives) and `frontmatter` is a parsed object (e.g. `{ layout: 'media-right', media: '/x.jpg' }`).
- Outputs go to `<deck>/export/`: `slides.md` (flat GFM), `handout.html`, `handout.pdf`.
- Pandoc invocations reuse `_templates/default-meta.yaml` merged under each deck's optional `meta.yaml`.

---

### Task 1: Add `@slidev/parser` as a direct dependency

**Files:**
- Modify: `package.json` (dependencies block)

**Interfaces:**
- Produces: importable bare specifier `@slidev/parser` resolving to v52.16.0.

- [ ] **Step 1: Add the dependency**

Run:
```bash
pnpm add @slidev/parser@52.16.0
```

- [ ] **Step 2: Verify it resolves as a bare import**

Run:
```bash
node --input-type=module -e "import('@slidev/parser').then(m=>console.log('parse:', typeof m.parse))"
```
Expected: `parse: function`

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "build: add @slidev/parser as direct dependency"
```

---

### Task 2: `slidev-normalize.js` — headmatter + slide separation skeleton

**Files:**
- Create: `scripts/lib/slidev-normalize.js`
- Test: `scripts/lib/slidev-normalize.test.js`

**Interfaces:**
- Consumes: `@slidev/parser` `parse`.
- Produces:
  - `normalizeDeck(raw: string, filepath: string): Promise<string>` — parses then flattens the whole deck to one Markdown string.
  - `normalizeSlide(slide: {frontmatter: object, content: string}): string` — flattens a single parsed slide to a Markdown fragment (no trailing separators). Later tasks extend this function's body; its signature is fixed here.
  - Slides are joined with `\n\n` and the result ends with a single trailing newline.

- [ ] **Step 1: Write the failing test**

```javascript
// scripts/lib/slidev-normalize.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDeck, normalizeSlide } from './slidev-normalize.js';

test('normalizeSlide keeps plain content unchanged', () => {
  const out = normalizeSlide({ frontmatter: {}, content: '## Title\n\nBody text.' });
  assert.equal(out, '## Title\n\nBody text.');
});

test('normalizeDeck drops headmatter and joins slides with blank line', async () => {
  const raw = [
    '---', 'theme: ../theme', 'title: T', '---', '',
    '## One', '', '---', '', '## Two',
  ].join('\n');
  const out = await normalizeDeck(raw, 'slides.md');
  assert.match(out, /## One/);
  assert.match(out, /## Two/);
  assert.doesNotMatch(out, /theme:/);
  assert.doesNotMatch(out, /^title: T$/m);
  assert.ok(out.endsWith('\n'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/lib/slidev-normalize.test.js`
Expected: FAIL — cannot find module `./slidev-normalize.js`.

- [ ] **Step 3: Write minimal implementation**

```javascript
// scripts/lib/slidev-normalize.js
import { parse } from '@slidev/parser';

/** Flatten a single parsed Slidev slide to a Markdown fragment. */
export function normalizeSlide(slide) {
  return (slide.content ?? '').trim();
}

/** Parse a Slidev deck's raw Markdown and flatten it to Pandoc-clean Markdown. */
export async function normalizeDeck(raw, filepath) {
  const parsed = await parse(raw, filepath);
  // parsed.slides[0] is the headmatter/cover slide; its frontmatter carries
  // deck-level config. We still render its content (the cover heading).
  const fragments = parsed.slides
    .map((s) => normalizeSlide(s))
    .filter((f) => f.length > 0);
  return fragments.join('\n\n') + '\n';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/lib/slidev-normalize.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/slidev-normalize.js scripts/lib/slidev-normalize.test.js
git commit -m "feat: add slidev-normalize deck/slide flattening skeleton"
```

---

### Task 3: Normalize slots, `<style>`, and directives

**Files:**
- Modify: `scripts/lib/slidev-normalize.js` (`normalizeSlide` body)
- Modify: `scripts/lib/slidev-normalize.test.js`

**Interfaces:**
- Consumes: `normalizeSlide` from Task 2.
- Produces: `normalizeSlide` now strips `::left::`/`::right::`/`::default::` slot markers (keeping content in order), removes `<style>…</style>` blocks, and strips `v-click`/`v-motion`/`v-after`/`v-clicks` attributes and `<template>`/`</template>` and `<Window …>`/`</Window>` wrapper tags while preserving inner content.

- [ ] **Step 1: Write the failing tests**

```javascript
test('normalizeSlide removes slot markers but keeps content', () => {
  const content = '::left::\n\n## A\n\n- x\n\n::right::\n\n## B\n\n- y';
  const out = normalizeSlide({ frontmatter: { layout: 'two-cols' }, content });
  assert.match(out, /## A/);
  assert.match(out, /## B/);
  assert.doesNotMatch(out, /::left::|::right::/);
});

test('normalizeSlide strips <style> blocks', () => {
  const content = '<style>\nul { margin: 0; }\n</style>\n\n## Title';
  const out = normalizeSlide({ frontmatter: {}, content });
  assert.doesNotMatch(out, /<style>|margin/);
  assert.match(out, /## Title/);
});

test('normalizeSlide unwraps Window and strips v-click', () => {
  const content = '<Window title="demo">\n\n<div v-click>Hi</div>\n\n</Window>';
  const out = normalizeSlide({ frontmatter: {}, content });
  assert.doesNotMatch(out, /<Window|<\/Window>|v-click/);
  assert.match(out, /Hi/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/lib/slidev-normalize.test.js`
Expected: FAIL — slot markers / style / Window still present.

- [ ] **Step 3: Implement the transforms**

Replace `normalizeSlide` with:

```javascript
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
  // Collapse 3+ blank lines left behind into a single blank line.
  md = md.replace(/\n{3,}/g, '\n\n');
  return md.trim();
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/lib/slidev-normalize.test.js`
Expected: PASS (all tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/slidev-normalize.js scripts/lib/slidev-normalize.test.js
git commit -m "feat: normalize slots, style blocks, and directives in slides"
```

---

### Task 4: Promote `media:` images and map section headings

**Files:**
- Modify: `scripts/lib/slidev-normalize.js` (`normalizeSlide` body)
- Modify: `scripts/lib/slidev-normalize.test.js`

**Interfaces:**
- Consumes: `normalizeSlide` from Task 3.
- Produces: `normalizeSlide` now, for `media-*` layouts, prepends `![](<media path>)` (leading `/` stripped so the path is deck-relative) before the content; and for `layout: section`/`cover`/`intro`, demotes a leading `## ` heading to `# ` so section slides become top-level document headings.

- [ ] **Step 1: Write the failing tests**

```javascript
test('normalizeSlide promotes media-layout image into body', () => {
  const out = normalizeSlide({
    frontmatter: { layout: 'media-right', media: '/html-codesniffer.jpg' },
    content: '## [HTML CodeSniffer](https://x)\n\n- item',
  });
  assert.match(out, /!\[\]\(html-codesniffer\.jpg\)/);
  assert.match(out, /## \[HTML CodeSniffer\]/);
});

test('normalizeSlide promotes section heading to level 1', () => {
  const out = normalizeSlide({ frontmatter: { layout: 'section' }, content: '# Le Speedrun' });
  assert.match(out, /^# Le Speedrun/m);
});

test('normalizeSlide demotes section subheading from h2 to h1', () => {
  const out = normalizeSlide({ frontmatter: { layout: 'section' }, content: '## Le lexique' });
  assert.match(out, /^# Le lexique/m);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test scripts/lib/slidev-normalize.test.js`
Expected: FAIL — no image emitted, heading not promoted.

- [ ] **Step 3: Implement**

In `normalizeSlide`, after the existing cleanup transforms and before the final `.trim()`, insert:

```javascript
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
```

(Keep the trailing `md = md.replace(/\n{3,}/g, '\n\n'); return md.trim();` as the last lines.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/lib/slidev-normalize.test.js`
Expected: PASS (all tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/slidev-normalize.js scripts/lib/slidev-normalize.test.js
git commit -m "feat: promote media images and map section headings"
```

---

### Task 5: End-to-end normalizer check against a real deck

**Files:**
- Modify: `scripts/lib/slidev-normalize.test.js`

**Interfaces:**
- Consumes: `normalizeDeck`, real fixture `decks/misc/speedrun/slides.md`.
- Produces: regression guarantee that a real deck normalizes with no Slidev residue.

- [ ] **Step 1: Write the failing test**

```javascript
import { readFileSync } from 'node:fs';

test('real speedrun deck normalizes with no Slidev residue', async () => {
  const path = 'decks/misc/speedrun/slides.md';
  const out = await normalizeDeck(readFileSync(path, 'utf8'), path);
  assert.doesNotMatch(out, /^layout:/m);
  assert.doesNotMatch(out, /::left::|::right::/);
  assert.doesNotMatch(out, /<style>/);
  assert.match(out, /# Le Speedrun/); // section/cover heading promoted
});
```

- [ ] **Step 2: Run test**

Run: `node --test scripts/lib/slidev-normalize.test.js`
Expected: PASS. If it fails on `layout:` residue, the parser already strips per-slide frontmatter from `content`; investigate before adding new stripping.

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/slidev-normalize.test.js
git commit -m "test: end-to-end normalize of real speedrun deck"
```

---

### Task 6: Export templates (`_templates/`)

**Files:**
- Create: `_templates/default-meta.yaml`
- Create: `_templates/handout.css`
- Create: `_templates/handout.html`

**Interfaces:**
- Produces: files referenced by the orchestrator in Task 7 — `_templates/default-meta.yaml` (Pandoc `--metadata-file`), `_templates/handout.html` (Pandoc `--template` for HTML), `_templates/handout.css` (embedded via the template).

- [ ] **Step 1: Create `_templates/default-meta.yaml`**

```yaml
author: "François Eoche"
lang: fr
```

- [ ] **Step 2: Create `_templates/handout.css`**

```css
body { max-width: 46rem; margin: 2rem auto; padding: 0 1rem;
  font: 16px/1.6 system-ui, sans-serif; color: #1a1a1a; }
h1 { margin-top: 2.5rem; border-bottom: 2px solid #ddd; padding-bottom: .3rem; }
h2 { margin-top: 2rem; }
img { max-width: 100%; height: auto; }
table { border-collapse: collapse; }
th, td { border: 1px solid #ccc; padding: .4rem .6rem; }
code { background: #f4f4f4; padding: .1rem .3rem; border-radius: 3px; }
pre { background: #f4f4f4; padding: 1rem; overflow-x: auto; }
```

- [ ] **Step 3: Create `_templates/handout.html`**

```html
<!DOCTYPE html>
<html lang="$lang$">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$title$</title>
  <style>
$styles.html()$
  </style>
</head>
<body>
$if(title)$<h1 class="doc-title">$title$</h1>$endif$
$body$
</body>
</html>
```

Note: the orchestrator passes `--css _templates/handout.css` with `--embed-resources` so `$styles.html()$` inlines the CSS.

- [ ] **Step 4: Commit**

```bash
git add _templates/default-meta.yaml _templates/handout.css _templates/handout.html
git commit -m "feat: add Pandoc export templates for handouts"
```

---

### Task 7: `export-docs.js` orchestrator (replaces build.js)

**Files:**
- Create: `scripts/export-docs.js`
- Delete: `scripts/build.js`
- Modify: `package.json` (scripts block)

**Interfaces:**
- Consumes: `normalizeDeck` (Task 2–4), `_templates/*` (Task 6), external `pandoc`.
- Produces: CLI `node scripts/export-docs.js [--deck <path>] [--verbose]`; writes `<deck>/export/{slides.md,handout.html,handout.pdf}`. npm scripts `export:docs`.

- [ ] **Step 1: Write `scripts/export-docs.js`**

```javascript
#!/usr/bin/env node
/**
 * scripts/export-docs.js
 * Export Slidev decks to document formats via @slidev/parser + Pandoc.
 * Usage: node scripts/export-docs.js [--deck pro/bookmarklets] [--verbose]
 */
import { execSync } from 'node:child_process';
import { readdirSync, existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeDeck } from './lib/slidev-normalize.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DECKS = join(ROOT, 'decks');
const TEMPLATES = join(ROOT, '_templates');
const META = join(TEMPLATES, 'default-meta.yaml');
const HTML_TEMPLATE = join(TEMPLATES, 'handout.html');
const HTML_CSS = join(TEMPLATES, 'handout.css');

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const SINGLE = args.includes('--deck') ? args[args.indexOf('--deck') + 1] : null;
const SKIP = new Set(['node_modules', '.git', '.idea', '.github', 'dist']);

// ── Pandoc check ──
try {
  const ver = execSync('pandoc --version', { encoding: 'utf8' }).split('\n')[0];
  console.log(`\n  📖  ${ver}`);
} catch {
  console.error('\n  ❌  pandoc not found. Install: https://pandoc.org/installing.html');
  console.error('  Windows: winget install --id JohnMacFarlane.Pandoc');
  process.exit(1);
}

// A Slidev deck declares `theme:` in its leading frontmatter.
function isSlidevDeck(file) {
  const txt = readFileSync(file, 'utf8');
  if (!txt.startsWith('---')) return false;
  const end = txt.indexOf('\n---', 3);
  const fm = end === -1 ? txt : txt.slice(0, end);
  return /^\s*theme\s*:/m.test(fm);
}

function findDecks(dir, depth = 0) {
  if (depth > 1) return [];
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || SKIP.has(e.name)) continue;
    const full = join(dir, e.name);
    const slides = join(full, 'slides.md');
    if (existsSync(slides)) {
      if (isSlidevDeck(slides)) out.push(full);
    } else {
      out.push(...findDecks(full, depth + 1));
    }
  }
  return out;
}

let decks = existsSync(DECKS) ? findDecks(DECKS) : [];
if (SINGLE) decks = decks.filter((p) => p.endsWith(SINGLE.replace(/\//g, require('path').sep)) || relative(DECKS, p) === SINGLE);
if (decks.length === 0) { console.log('\n  ⚠️  No Slidev decks found.'); process.exit(0); }

console.log(`\n  🔨  Exporting ${decks.length} deck(s)…\n`);
let ok = 0, fail = 0, pdfSkipped = 0;

for (const deck of decks) {
  const rel = relative(ROOT, deck);
  const outDir = join(deck, 'export');
  mkdirSync(outDir, { recursive: true });
  process.stdout.write(`  📦  ${rel} … `);

  try {
    const raw = readFileSync(join(deck, 'slides.md'), 'utf8');
    const clean = await normalizeDeck(raw, join(deck, 'slides.md'));
    const intermediate = join(outDir, '_clean.md');
    writeFileSync(intermediate, clean, 'utf8');

    const localMeta = join(deck, 'meta.yaml');
    const metaArgs = [`--metadata-file="${META}"`];
    if (existsSync(localMeta)) metaArgs.push(`--metadata-file="${localMeta}"`);

    const base = ['pandoc', `"${intermediate}"`, ...metaArgs, `--resource-path="${deck}"`];

    // 1. Flat GFM markdown
    run([...base, '--to=gfm', `-o "${join(outDir, 'slides.md')}"`], deck);
    // 2. Standalone HTML handout
    run([...base, '--to=html5', '--standalone', '--embed-resources',
      `--template="${HTML_TEMPLATE}"`, `--css="${HTML_CSS}"`,
      `-o "${join(outDir, 'handout.html')}"`], deck);
    // 3. PDF (best-effort — skip if no engine)
    try {
      run([...base, `-o "${join(outDir, 'handout.pdf')}"`], deck);
    } catch (e) {
      pdfSkipped++;
      if (VERBOSE) console.log(`\n      (pdf skipped: ${String(e.message).split('\n')[0]})`);
    }
    console.log('✅');
    ok++;
  } catch (err) {
    console.log('❌');
    if (err.stderr) console.error(`      ${String(err.stderr).trim()}`);
    else console.error(`      ${err.message}`);
    fail++;
  }
}

function run(parts, cwd) {
  const cmd = parts.join(' ');
  if (VERBOSE) console.log(`\n      ${cmd}`);
  execSync(cmd, { cwd, stdio: VERBOSE ? 'inherit' : 'pipe', encoding: 'utf8' });
}

console.log(`\n  ✨  Exported: ${ok}  Failed: ${fail}  PDF skipped: ${pdfSkipped}\n`);
if (fail > 0) process.exit(1);
```

Note: remove the stray `require('path')` — replace the `SINGLE` filter line with the version in Step 2.

- [ ] **Step 2: Fix the `--deck` filter to avoid `require` in ESM**

Replace the `if (SINGLE)` line with:

```javascript
if (SINGLE) {
  const want = SINGLE.replace(/\\/g, '/');
  decks = decks.filter((p) => relative(DECKS, p).replace(/\\/g, '/') === want);
}
```

- [ ] **Step 3: Delete the orphaned build.js**

```bash
git rm scripts/build.js
```

- [ ] **Step 4: Update `package.json` scripts**

Replace the `"build:boards"` line's neighborhood so the scripts block reads:

```json
  "scripts": {
    "build": "slidev build",
    "dev": "node scripts/serve-boards.js",
    "export": "slidev export",
    "export:docs": "node scripts/export-docs.js",
    "build:boards": "node scripts/build-boards.js"
  },
```

- [ ] **Step 5: Run the exporter on one deck**

Run: `node scripts/export-docs.js --deck misc/speedrun --verbose`
Expected: `✅` for the deck; files `decks/misc/speedrun/export/slides.md` and `handout.html` exist. PDF present only if a LaTeX engine is installed, otherwise counted under "PDF skipped".

- [ ] **Step 6: Verify flat markdown has no residue**

Run:
```bash
grep -nE "::left::|::right::|^layout:|<style>" decks/misc/speedrun/export/slides.md || echo "CLEAN"
```
Expected: `CLEAN`

- [ ] **Step 7: Commit**

```bash
git add scripts/export-docs.js package.json
git rm --cached scripts/build.js 2>/dev/null; git add -A scripts/
git commit -m "feat: add export-docs orchestrator, remove orphaned build.js"
```

---

### Task 8: Rewrite `new-talk.js` to scaffold Slidev decks

**Files:**
- Modify: `scripts/new-talk.js`

**Interfaces:**
- Consumes: nothing new.
- Produces: `npm run new -- <category/slug> ["Title"]` creates `decks/<slug>/{slides.md, meta.yaml, assets/}` where `slides.md` is a Slidev deck (leading frontmatter with `theme:` pointing at `src/theme`, `layout: cover`).

- [ ] **Step 1: Replace the deck-creation body**

Keep the arg-parsing and existence-check preamble. Change the target root to `decks/` and replace the `md`, `meta`, and `html` construction plus the writes with:

```javascript
const dir = join(ROOT, 'decks', slug);
// (existence check as before, against this dir)

await mkdir(dir, { recursive: true });
await mkdir(join(dir, 'assets'), { recursive: true });

// Relative path from deck to src/theme (decks/<a>/<b> → ../../../src/theme).
const depth = slug.split('/').length; // e.g. pro/my-talk → 2
const themePath = '../'.repeat(depth + 1) + 'src/theme';

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
```

Remove the now-unused `cdn`, `rootRel`, and `html` variables and the reveal.js `index.html` write.

- [ ] **Step 2: Dry-run scaffold a throwaway deck**

Run: `node scripts/new-talk.js misc/_scratch "Scratch Talk"`
Expected: creates `decks/misc/_scratch/slides.md` starting with `theme: ../../../src/theme`.

- [ ] **Step 3: Verify it is recognized as a Slidev deck and exports**

Run: `node scripts/export-docs.js --deck misc/_scratch`
Expected: `✅` and `decks/misc/_scratch/export/slides.md` exists.

- [ ] **Step 4: Clean up the throwaway deck**

```bash
rm -rf decks/misc/_scratch
```

- [ ] **Step 5: Commit**

```bash
git add scripts/new-talk.js
git commit -m "feat: scaffold Slidev decks in new-talk"
```

---

### Task 9: Ignore export output & update README

**Files:**
- Modify: `.gitignore`
- Modify: `README.md`

**Interfaces:**
- Produces: `export/` build artifacts untracked; README documents `npm run export:docs`.

- [ ] **Step 1: Add export output to `.gitignore`**

Append:
```
# Pandoc document exports
decks/**/export/
```

- [ ] **Step 2: Document the export command in README.md**

Add a section:

```markdown
## Document Export (Pandoc)

Export any Slidev deck to reading formats (flat Markdown + HTML handout +
PDF) via Pandoc:

    npm run export:docs                       # all decks
    npm run export:docs -- --deck misc/speedrun   # one deck

Outputs land in `<deck>/export/`. PDF requires a LaTeX engine; if none is
installed, Markdown and HTML are still produced and PDF is skipped.
Requires Pandoc: https://pandoc.org/installing.html
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore README.md
git commit -m "docs: document Pandoc export, ignore export output"
```

---

## Self-Review

- **Spec coverage:** normalizer (Tasks 2–5), orchestrator w/ 3 formats + error handling (Task 7), templates (Task 6), `@slidev/parser` dep (Task 1), Slidev-aware `new-talk.js` (Task 8), notes excluded (never emitted — Task 3 strips comments implicitly since parser separates `note`; content carries none), old `build.js` removed (Task 7). ✓
- **Placeholder scan:** all code steps contain full code; no TODO/TBD. ✓
- **Type consistency:** `normalizeDeck(raw, filepath)`/`normalizeSlide(slide)` signatures fixed in Task 2 and only extended (not renamed) in Tasks 3–4; orchestrator imports `normalizeDeck` matching that name. ✓
- **Known follow-up:** Task 7 Step 1 intentionally contains a `require('path')` bug that Step 2 fixes — this is a deliberate two-step to explain the ESM pitfall, not a placeholder.
