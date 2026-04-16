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

const dir = join(ROOT, slug);

try {
  await access(dir, constants.F_OK);
  console.error(`❌  Folder "${slug}" already exists.`);
  process.exit(1);
} catch { /* doesn't exist — proceed */ }

await mkdir(dir, { recursive: true });
await mkdir(join(dir, 'assets'), { recursive: true });

// Determine relative path to root assets
const depth = slug.split('/').length;
const rootRel = '../'.repeat(depth + 1).slice(0, -1); // e.g. '../..' for pro/slug

const cdn = 'https://cdn.jsdelivr.net/npm/reveal.js@5';

// ── slides.md (content-only, reveal.js markdown separators) ─────────────
const md = `# ${title}

**François Eoche**

---

## Agenda

- Topic A <!-- .element: class="fragment" -->
- Topic B <!-- .element: class="fragment" -->
- Topic C <!-- .element: class="fragment" -->

Notes:
Speaker notes for this slide. Press S in the browser to open the notes view.

---

# Topic A

--

## Subtopic

Content here.

--

## Code example

\`\`\`javascript
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

---

## Two columns

<div class="columns">
<div class="column">

**Left side**

- Item 1
- Item 2

</div>
<div class="column">

**Right side**

- Item A
- Item B

</div>
</div>

---

## Thank you

*Questions?*

**François Eoche** · [slides.com/feoche](https://slides.com/feoche)
`;

// ── meta.yaml (Pandoc metadata) ──────────────────────────────────────────
const meta = `title: "${title.replace(/"/g, '\\"')}"
author: "François Eoche"
lang: fr
theme: black
transition: slide
# highlightjs: monokai
`;

// ── index.html (reveal.js shell) ─────────────────────────────────────────
const html = [
  '<!DOCTYPE html>',
  '<html lang="fr">',
  '<head>',
  '  <meta charset="utf-8">',
  '  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">',
  '  <title>' + title + '</title>',
  '',
  '  <link rel="stylesheet" href="' + cdn + '/dist/reset.css">',
  '  <link rel="stylesheet" href="' + cdn + '/dist/reveal.css">',
  '  <link rel="stylesheet" href="' + cdn + '/dist/theme/black.css" id="theme">',
  '  <link rel="stylesheet" href="' + cdn + '/plugin/highlight/monokai.css">',
  '  <link rel="stylesheet" href="' + rootRel + '/_templates/custom.css">',
  '</head>',
  '<body>',
  '  <div class="reveal">',
  '    <div class="slides">',
  '      <section',
  '        data-markdown="slides.md"',
  '        data-separator="^\\n---\\n"',
  '        data-separator-vertical="^\\n--\\n"',
  '        data-separator-notes="^Notes:"',
  '        data-charset="utf-8">',
  '      </section>',
  '    </div>',
  '  </div>',
  '',
  '  <script src="' + cdn + '/dist/reveal.js"></script>',
  '  <script src="' + cdn + '/plugin/markdown/markdown.js"></script>',
  '  <script src="' + cdn + '/plugin/highlight/highlight.js"></script>',
  '  <script src="' + cdn + '/plugin/notes/notes.js"></script>',
  '  <script src="' + cdn + '/plugin/search/search.js"></script>',
  '  <script src="' + cdn + '/plugin/zoom/zoom.js"></script>',
  '',
  '  <script>',
  '    Reveal.initialize({',
  '      hash: true,',
  '      controls: true,',
  '      progress: true,',
  '      center: true,',
  '      transition: "slide",',
  '      backgroundTransition: "fade",',
  '      plugins: [',
  '        RevealMarkdown,',
  '        RevealHighlight,',
  '        RevealNotes,',
  '        RevealSearch,',
  '        RevealZoom',
  '      ]',
  '    });',
  '  </script>',
  '</body>',
  '</html>',
].join('\n');

await writeFile(join(dir, 'slides.md'), md, 'utf8');
await writeFile(join(dir, 'meta.yaml'), meta, 'utf8');
await writeFile(join(dir, 'index.html'), html, 'utf8');

console.log(`\n✅  Created new talk: ${slug}/`);
console.log(`   • ${slug}/slides.md   ← write your content here (reveal.js markdown)`);
console.log(`   • ${slug}/meta.yaml   ← Pandoc metadata (title, author, theme…)`);
console.log(`   • ${slug}/index.html  ← reveal.js shell (loads slides.md at runtime)`);
console.log(`   • ${slug}/assets/     ← images go here`);
console.log(`\n   To preview (requires a web server):`);
console.log(`   npm run serve`);
console.log(`\n   To generate a static build:`);
console.log(`   npm run build -- --deck ${slug}\n`);
