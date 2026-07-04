# Migrate Reveal decks to Slidev — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. One deck per task, sequential, committed independently.

**Goal:** Convert 6 Reveal.js decks under `src/pro/` and `src/z-misc/` to Slidev on the feoche theme, fit-to-content, and stop Pandoc from building Slidev decks.

**Tech Stack:** Slidev (`@slidev/cli`), feoche theme (`src/theme`), Node build script, pnpm.

## Global Constraints

- Conversion conventions are defined in the spec `docs/superpowers/specs/2026-07-02-migrate-reveal-to-slidev-design.md` — every deck task MUST follow the "Conversion conventions" section verbatim.
- Frontmatter theme path is exactly `theme: ../../../src/theme` for every deck.
- Delete each deck's `index.html`, `_source.html`, `index-static.html`, `meta.yaml` after folding meta into frontmatter.
- Faithful migration: preserve slide content/order; only restructure for layout fit and flatten vertical (`--`) slides.
- Per-deck verification: `pnpm exec slidev build "<deck>/slides.md" --out "<scratch>/deck-dist"` must end with `✓ built in …` and no missing-layout errors. Ignore harmless `[INVALID_ANNOTATION]`/`[PLUGIN_TIMINGS]` node_modules warnings.
- Scratch out dir: `C:/Users/ADMINI~1/AppData/Local/Temp/claude/C--dev-slides/d15c9444-c9d5-4c74-8512-c7f5ab7383a0/scratchpad/deck-dist`
- Commit trailer on every commit: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

## Task 1: Stop Pandoc build from touching Slidev decks

**Files:** Modify `scripts/build.js`

- [ ] **Step 1:** In `findDecks`, when a `slides.md` exists, read it and skip the deck if its leading frontmatter block contains a `theme:` line (Slidev deck marker). Add a small helper:

```js
import { readFileSync } from 'fs';

function isSlidevDeck(slidesFile) {
  const txt = readFileSync(slidesFile, 'utf8');
  if (!txt.startsWith('---')) return false;
  const end = txt.indexOf('\n---', 3);
  const fm = end === -1 ? txt : txt.slice(0, end);
  return /^\s*theme\s*:/m.test(fm);
}
```
Then in the `if (existsSync(slidesFile))` branch, `if (isSlidevDeck(slidesFile)) continue;` before pushing.

- [ ] **Step 2:** Add `readFileSync` to the existing `fs` import.

- [ ] **Step 3:** Run `node scripts/build.js`. Expected: it reports building only genuine Reveal decks (before other tasks run, that's the not-yet-converted ones); crucially it must NOT list `pro/bookmarklets`. Confirm bookmarklets is skipped.

- [ ] **Step 4:** Commit `scripts/build.js`.

---

## Tasks 2–7: One deck per task (sequential)

Each task follows the SAME procedure; the only variable is the deck path. Do them in this order (simplest first):

- Task 2: `src/pro/ovhcloud-design-system` (25 background images → `image-full`)
- Task 3: `src/pro/mauvaise-ux-sauve-voyage`
- Task 4: `src/pro/ionic-the-hybrid-theory`
- Task 5: `src/z-misc/tas`
- Task 6: `src/z-misc/speedrun`
- Task 7: `src/pro/digital-bot-twitter` (repair existing partial Slidev migration; fix theme path to `../../../src/theme`, apply conventions, delete Reveal artifacts)

**Procedure per deck (checklist to repeat):**

- [ ] **Step 1:** Read the deck's `slides.md` and `meta.yaml` in full.
- [ ] **Step 2:** Rewrite `slides.md` as a Slidev deck per the spec's Conversion conventions: build the frontmatter header from `meta.yaml` + `theme: ../../../src/theme`; map each slide to the best-fit layout; flatten vertical slides; strip all `<!-- .slide: … -->` directives and Reveal-only HTML.
- [ ] **Step 3:** Delete the deck's `index.html`, `_source.html`, `index-static.html` (if present), `meta.yaml`.
- [ ] **Step 4:** Build-verify: `pnpm exec slidev build "<deck>/slides.md" --out "<scratch>/deck-dist"`. Fix any missing-layout / frontmatter errors until it ends with `✓ built in …`.
- [ ] **Step 5:** Commit with message `feat(deck): migrate <deck> to Slidev` + trailer.

---

## Task 8: Final verification

- [ ] **Step 1:** `node scripts/build.js` → expected `Built: 0 Failed: 0` (all decks are now Slidev) and no errors.
- [ ] **Step 2:** Build each converted deck once more via `slidev build` to confirm all 6 pass.
- [ ] **Step 3:** `git status` clean except pre-existing untracked/user files.

## Self-Review Notes

- Spec coverage: build.js change (T1), all 6 decks (T2–T7), final verification (T8).
- Conventions centralized in spec; each deck task references them — no per-task duplication of the mapping rules.
