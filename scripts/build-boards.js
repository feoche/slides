#!/usr/bin/env node
/**
 * scripts/build-boards.js
 *
 * Build every talk (deck under `talks/`) into a single static site:
 *
 *   dist/
 *     index.html            ← home page: cards to the talks of talks/home.yaml (scripts/lib/home-page.js)
 *     404.html              ← sends deep links to their deck on static hosts (scripts/lib/spa-fallback.js)
 *     site.css              ← style of both pages (scripts/lib/site.css)
 *     bookmarklets/         ← talks/pro/bookmarklets/slides.md
 *     speedrun/             ← talks/misc/speedrun/slides.md
 *     …
 *
 * A deck is served at its folder name, without `pro/` or `misc/` (folder names are unique), and built with
 * `--base <base><name>/` so its assets resolve at that sub-path.
 *
 * Usage:
 *   node scripts/build-boards.js                    # build every talk + home page
 *   node scripts/build-boards.js pro/bookmarklets   # build one board only (a talk or a theme preview)
 *
 * Options:
 *   --base <path>          site base path, e.g. `/slides/` for GitHub Pages (default `/`)
 *   --router-mode <mode>   passed to `slidev build` (`history` by default; deep links work without `hash`)
 */
import { execFileSync } from 'child_process';
import { copyFileSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { ROOT, TALKS, discoverBoards, resolveBoard } from './boards.js';
import { readDeckMeta, readHomeTalks, renderHome } from './lib/home-page.js';
import { injectRestoreScript, render404 } from './lib/spa-fallback.js';

const args = process.argv.slice(2);
const all = discoverBoards();

/** Value of a `--name value` option, removed from `args` so it isn't read as the selector. */
function takeOption(name) {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const [, value] = args.splice(i, 2);
  return value;
}

const base = (takeOption('--base') ?? '/').replace(/\/?$/, '/');
const routerMode = takeOption('--router-mode');

if (all.length === 0) {
  console.log('\n  ⚠️  No boards found (looked for talks/**/slides.md).\n');
  process.exit(0);
}

const selector = args.find((a) => !a.startsWith('--'));
/** Folder name of a board: its path on the site. */
const siteName = (board) => board.slug.split('/').pop();

const talks = all
  .filter((b) => b.file.startsWith(TALKS))
  .map((b) => ({ ...b, slug: siteName(b), meta: readDeckMeta(b.file) }));
const duplicates = talks.filter((t, i) => talks.findIndex((u) => u.slug === t.slug) !== i);
if (duplicates.length > 0) {
  console.error(`\n  ❌  Talks sharing a folder name (their URL): ${duplicates.map((t) => t.name).join(', ')}\n`);
  process.exit(1);
}
// read before building: an unknown talk in home.yaml fails the build right away
const homeTalks = readHomeTalks(join(TALKS, 'home.yaml'), talks);
const boards = selector ? [resolveBoard(all, selector)] : talks;

const DIST = join(ROOT, 'dist');
// a full build replaces the whole site: no deck left over from an earlier build
if (!selector) rmSync(DIST, { recursive: true, force: true });
const SLIDEV = process.platform === 'win32' ? 'slidev.cmd' : 'slidev';

console.log(`\n  🔨  Building ${boards.length} board(s)…\n`);

let built = 0;
let failed = 0;

for (const board of boards) {
  const name = siteName(board);
  const outDir = join(DIST, name);
  process.stdout.write(`  📦  ${board.name} → dist/${name}/ … `);
  try {
    execFileSync(
      SLIDEV,
      [
        'build', board.file, '--base', `${base}${name}/`, '--out', outDir,
        ...(routerMode ? ['--router-mode', routerMode] : []),
      ],
      { cwd: ROOT, stdio: 'pipe', shell: process.platform === 'win32' },
    );
    const index = join(outDir, 'index.html');
    writeFileSync(index, injectRestoreScript(readFileSync(index, 'utf8')));
    console.log('✅');
    built++;
  } catch (err) {
    console.log('❌');
    const msg = err.stderr?.toString().trim() || err.message;
    console.error(`      ${msg}`);
    failed++;
  }
}

// Generate the home page and the 404 fallback only for a full build.
if (!selector && built > 0) {
  writeHome();
  console.log('\n  📄  dist/index.html generated.');
}

console.log(`\n  ✨  Built: ${built}  Failed: ${failed}\n`);
if (failed > 0) process.exit(1);

function writeHome() {
  const { author } = JSON.parse(readFileSync(join(ROOT, 'src/theme/package.json'), 'utf8')).slidev.defaults;
  copyFileSync(join(ROOT, 'scripts/lib/site.css'), join(DIST, 'site.css'));
  writeFileSync(join(DIST, 'index.html'), renderHome(homeTalks, { author }));
  writeFileSync(join(DIST, '404.html'), render404(talks.map((t) => t.slug), base));
  // serve files as is on GitHub Pages
  writeFileSync(join(DIST, '.nojekyll'), '');
}
