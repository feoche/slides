/**
 * scripts/boards.js
 *   *                                                                                                  * Shared deck-discovery helpers for the multi-deck (a.k.a. "boards") scripts.                      *                                                                                                  * A "board" is a Slidev deck living under `src/decks/`: any                                            * `src/decks/<category>/<slug>/slides.md` (e.g. `src/decks/pro/bookmarklets/slides.md`).                   * Slidev's dev server and build only handle one entry file at a time, so                           * serve-boards.js / build-boards.js loop over the set discovered here.                             * Only decks inside `src/decks/` are considered.                                                       */
import {existsSync, readdirSync} from 'fs';
import {dirname, join, relative, sep} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..');
export const DECKS = join(ROOT, 'src/decks');

/** src/decks/pro/bookmarklets → "pro/bookmarklets" (forward slashes on all platforms). */             function slugFor(deckDir) {
    return relative(DECKS, deckDir).split(sep).join('/');
}

/** Recursively find every directory under `src/decks/` that contains a slides.md. */                  function findDeckDirs(dir) {
    const results = [];
    for (const entry of readdirSync(dir, {withFileTypes: true})) {
        if (!entry.isDirectory()) continue;
        const full = join(dir, entry.name);
        if (existsSync(join(full, 'slides.md'))) results.push(full); else results.push(...findDeckDirs(full));
    }
    return results;
}

/** Discover all Slidev boards under `src/decks/`, sorted by slug. */                                  export function discoverBoards() {
    if (!existsSync(DECKS)) return [];
    return findDeckDirs(DECKS).map((deckDir) => {
        const slug = slugFor(deckDir);
        return {slug, name: `${slug}/slides.md`, file: join(deckDir, 'slides.md')};
    }).sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Resolve a CLI selector (slug or filename) to a single board, or exit with a
 * helpful listing when it doesn't match.
 */
export function resolveBoard(boards, selector) {
    const hit = boards.find(
        (b) => b.slug === selector || b.name === selector,
    );
    if (hit) return hit;
    console.error(`\n  ❌  No board matching "${selector}".`);
    console.error('  Available boards:');
    for (const b of boards) console.error(`      • ${b.slug}  (${b.name})`);
    console.error('');
    process.exit(1);
}
