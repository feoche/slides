#!/usr/bin/env node
/**
 * scripts/build.js
 *
 * Runs Pandoc on every <talk>/slides.md to produce <talk>/index-static.html
 * using the shared _templates/revealjs.html template and
 * _templates/default-meta.yaml defaults.
 *
 * Each deck may also have a local meta.yaml that overrides global defaults.
 *
 * Usage:
 *   node scripts/build.js
 *   node scripts/build.js --deck pro/bookmarklets
 *   node scripts/build.js --verbose
 *
 * Note: index.html in each deck is a live shell that loads slides.md at
 * runtime via the RevealMarkdown plugin (requires a web server).
 * The static build generates index-static.html (fully self-contained).
 */
import { execSync }         from 'child_process';
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname, relative }    from 'path';
import { fileURLToPath }    from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');

const args    = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const SINGLE  = args[args.indexOf('--deck') + 1] || null;

// ── Pandoc check ──────────────────────────────────────────────────────────
try {
  const ver = execSync('pandoc --version', { encoding: 'utf8' }).split('\n')[0];
  console.log(`\n  📖  ${ver}`);
} catch {
  console.error('\n  ❌  pandoc not found.');
  console.error('  Install from https://pandoc.org/installing.html');
  console.error('  On Windows with winget:  winget install --id JohnMacFarlane.Pandoc');
  process.exit(1);
}

const TEMPLATE = join(ROOT, '_templates', 'revealjs.html');
const META     = join(ROOT, '_templates', 'default-meta.yaml');
const SKIP     = new Set(['_templates', '_templates', 'scripts', 'node_modules', '.git', '.idea', '.github', 'index.html']);

if (!existsSync(TEMPLATE)) {
  console.error(`\n  ❌  Template not found: ${TEMPLATE}`);
  process.exit(1);
}

// ── Discover decks (recursive, up to 2 levels deep) ─────────────────────
// A Slidev deck declares a `theme:` in its leading frontmatter block; the
// Pandoc/Reveal pipeline must not touch those.
function isSlidevDeck(slidesFile) {
  const txt = readFileSync(slidesFile, 'utf8');
  if (!txt.startsWith('---')) return false;
  const end = txt.indexOf('\n---', 3);
  const fm = end === -1 ? txt : txt.slice(0, end);
  return /^\s*theme\s*:/m.test(fm);
}

function findDecks(dir, depth = 0) {
  if (depth > 1) return [];
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (SKIP.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    const slidesFile = join(fullPath, 'slides.md');
    if (existsSync(slidesFile)) {
      if (isSlidevDeck(slidesFile)) continue;
      results.push(fullPath);
    } else {
      results.push(...findDecks(fullPath, depth + 1));
    }
  }
  return results;
}

let deckPaths = findDecks(ROOT);

if (SINGLE) {
  const target = join(ROOT, SINGLE);
  deckPaths = deckPaths.filter(p => p === target || p.endsWith(SINGLE));
  if (deckPaths.length === 0) {
    console.log(`\n  ⚠️  No slides.md found in "${SINGLE}/".`);
    process.exit(0);
  }
}

if (deckPaths.length === 0) {
  console.log('\n  ⚠️  No slides.md files found.');
  process.exit(0);
}

console.log(`\n  🔨  Building ${deckPaths.length} deck(s)…\n`);

let built = 0, failed = 0;

for (const talkDir of deckPaths) {
  const rel       = relative(ROOT, talkDir);
  const srcFile   = join(talkDir, 'slides.md');
  const outFile   = join(talkDir, 'index-static.html');
  const localMeta = join(talkDir, 'meta.yaml');

  process.stdout.write(`  📦  ${rel}/slides.md → index-static.html … `);

  const metaArgs = existsSync(localMeta)
    ? [`--metadata-file "${META}"`, `--metadata-file "${localMeta}"`]
    : [`--metadata-file "${META}"`];

  const cmd = [
    'pandoc',
    '--standalone',
    `--to revealjs`,
    `--template "${TEMPLATE}"`,
    ...metaArgs,
    `-o "${outFile}"`,
    `"${srcFile}"`,
  ].join(' ');

  if (VERBOSE) console.log(`\n      ${cmd}`);

  try {
    execSync(cmd, { cwd: talkDir, stdio: VERBOSE ? 'inherit' : 'pipe', encoding: 'utf8' });
    console.log('✅');
    built++;
  } catch (err) {
    console.log('❌');
    if (err.stderr) console.error(`      ${err.stderr.trim()}`);
    failed++;
  }
}

console.log(`\n  ✨  Built: ${built}  Failed: ${failed}\n`);
if (failed > 0) process.exit(1);

