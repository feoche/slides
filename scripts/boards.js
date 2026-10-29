/**
 * scripts/boards.js
 *
 * Shared deck-discovery helpers for the multi-deck (a.k.a. "boards") scripts.
 *
 * A "board" is a Slidev deck: any folder containing a `slides.md`, found under
 *   - `talks/` — the talks themselves, slug relative to `talks/` (e.g. `pro/bookmarklets`);
 *   - `src/common/` — theme preview decks, slug prefixed with `common/` (e.g. `common/showcase`).
 * Slidev's dev server and build only handle one entry file at a time, so
 * serve-boards.js / build-boards.js loop over the set discovered here.
 */
import {existsSync, readdirSync} from 'fs';
import {dirname, join, relative, sep} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..');
export const TALKS = join(ROOT, 'talks');
export const COMMON = join(ROOT, 'src/common');

/** Recursively find every directory under `dir` that contains a slides.md. */
function findDeckDirs(dir) {
    const results = [];
    for (const entry of readdirSync(dir, {withFileTypes: true})) {
        if (!entry.isDirectory() || entry.name === 'node_modules') continue;
        const full = join(dir, entry.name);
        if (existsSync(join(full, 'slides.md'))) results.push(full); else results.push(...findDeckDirs(full));
    }
    return results;
}

/** Boards under `base`, slugs relative to it (forward slashes on all platforms) with an optional prefix. */
function boardsIn(base, prefix = '') {
    if (!existsSync(base)) return [];
    return findDeckDirs(base).map((deckDir) => {
        const slug = prefix + relative(base, deckDir).split(sep).join('/');
        return {slug, name: `${slug}/slides.md`, file: join(deckDir, 'slides.md')};
    });
}

/** Discover all Slidev boards (talks first, then theme previews), each group sorted by slug. */
export function discoverBoards() {
    const bySlug = (a, b) => a.slug.localeCompare(b.slug);
    return [...boardsIn(TALKS).sort(bySlug), ...boardsIn(COMMON, 'common/').sort(bySlug)];
}

/**
 * Resolve a CLI selector to a single board, or exit with a helpful listing when
 * it doesn't match. Accepts the full slug (`pro/bookmarklets`), its file name,
 * or just the last folder name when it's unique (`bookmarklets`).
 */
export function resolveBoard(boards, selector) {
    const exact = boards.find((b) => b.slug === selector || b.name === selector);
    if (exact) return exact;
    const short = boards.filter((b) => b.slug.split('/').pop() === selector);
    if (short.length === 1) return short[0];
    console.error(`\n  ❌  No board matching "${selector}".`);
    console.error('  Available boards:');
    for (const b of boards) console.error(`      • ${b.slug}  (${b.name})`);
    console.error('');
    process.exit(1);
}
