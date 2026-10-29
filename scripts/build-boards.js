#!/usr/bin/env node
/**
 * scripts/build-boards.js
 *
 * Build every Slidev "board" (deck under `talks/`, plus `src/common/` previews) into a single static site:
 *
 *   dist/
 *     index.html            ← generated landing page linking to each board
 *     pro/bookmarklets/     ← talks/pro/bookmarklets/slides.md
 *     misc/speedrun/        ← talks/misc/speedrun/slides.md
 *     …
 *
 * Each board is built with `--base /<slug>/` so its assets resolve when
 * hosted at that sub-path (Netlify/Vercel friendly).
 *
 * Usage:
 *   node scripts/build-boards.js                    # build every board + index
 *   node scripts/build-boards.js pro/bookmarklets   # build one board only
 */
import { execFileSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ROOT, discoverBoards, resolveBoard } from './boards.js';

const args = process.argv.slice(2);
const all = discoverBoards();

if (all.length === 0) {
  console.log('\n  ⚠️  No boards found (looked for talks/**/slides.md).\n');
  process.exit(0);
}

const selector = args.find((a) => !a.startsWith('--'));
const boards = selector ? [resolveBoard(all, selector)] : all;

const DIST = join(ROOT, 'dist');
const SLIDEV = process.platform === 'win32' ? 'slidev.cmd' : 'slidev';

console.log(`\n  🔨  Building ${boards.length} board(s)…\n`);

let built = 0;
let failed = 0;

for (const board of boards) {
  const outDir = join(DIST, board.slug);
  process.stdout.write(`  📦  ${board.name} → dist/${board.slug}/ … `);
  try {
    execFileSync(
      SLIDEV,
      ['build', board.file, '--base', `/${board.slug}/`, '--out', outDir],
      { cwd: ROOT, stdio: 'pipe', shell: process.platform === 'win32' },
    );
    console.log('✅');
    built++;
  } catch (err) {
    console.log('❌');
    const msg = err.stderr?.toString().trim() || err.message;
    console.error(`      ${msg}`);
    failed++;
  }
}

// Generate the landing page only for a full build.
if (!selector && built > 0) {
  mkdirSync(DIST, { recursive: true });
  writeFileSync(join(DIST, 'index.html'), renderIndex(all));
  console.log('\n  📄  dist/index.html generated.');
}

console.log(`\n  ✨  Built: ${built}  Failed: ${failed}\n`);
if (failed > 0) process.exit(1);

function renderIndex(boards) {
  const items = boards
    .map(
      (b) =>
        `      <li><a href="./${b.slug}/">${b.slug}</a> <code>${b.name}</code></li>`,
    )
    .join('\n');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Slides — Boards</title>
  <style>
    :root { color-scheme: light dark; }
    body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1.5rem; line-height: 1.6; }
    h1 { color: #00574a; }
    ul { list-style: none; padding: 0; }
    li { padding: .5rem 0; border-bottom: 1px solid #8883; }
    a { font-size: 1.15rem; font-weight: 600; text-decoration: none; color: #00574a; }
    a:hover { text-decoration: underline; }
    code { color: #888; font-size: .85rem; margin-left: .5rem; }
  </style>
</head>
<body>
  <h1>Boards</h1>
  <ul>
${items}
  </ul>
</body>
</html>
`;
}
