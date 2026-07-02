# Migrate Reveal.js conference decks to Slidev (feoche theme)

**Date:** 2026-07-02
**Status:** Approved for planning

## Goal

Convert every remaining Reveal.js/Pandoc conference deck under `src/pro/` and
`src/z-misc/` to Slidev decks on the `slidev-theme-feoche` theme, fitting the
theme's layouts to each slide's real content. Retire each deck's obsolete
Reveal artifacts and stop the Pandoc pipeline from touching Slidev decks.

## Decks in scope

Reveal → Slidev (fit layouts to content):
- `src/pro/ovhcloud-design-system` — 25 full-bleed background images (slides.com export) → `image-full` per slide.
- `src/pro/mauvaise-ux-sauve-voyage` — content deck (green-bg title/section slides, lists).
- `src/pro/ionic-the-hybrid-theory` — content deck (lists, tables, vertical slides).
- `src/pro/digital-bot-twitter` — already has Slidev frontmatter but broken theme path + Reveal artifacts; finish/repair the migration.
- `src/z-misc/speedrun` — large content deck (69 slides).
- `src/z-misc/tas` — content deck (46 slides).

Already Slidev, not in scope: `src/pro/bookmarklets`, root `slides.md`.

## Conversion conventions (per deck)

**Frontmatter header:** replace/prepend a Slidev frontmatter block built from the
deck's `meta.yaml` (title, info→info, author, keywords, lang→htmlAttrs.lang) plus:
```yaml
theme: ../../../src/_theme
colorSchema: auto
```
(`../../../src/_theme` resolves from `src/pro/<deck>` and `src/z-misc/<deck>` alike.)

**Slide mapping (fit to content):**
- First/title slide → `layout: cover`.
- "Qui suis-je" / speaker-intro slide → `layout: intro` (use an avatar `image:` if the deck has one, else omit).
- Reveal `<!-- .slide: data-background-color="#00574a" -->` (brand green) → a highlight layout: `section` for chapter dividers, `center` or `fact` for single-statement slides. Drop the raw directive.
- Reveal `<!-- .slide: data-background-image="URL" data-background-size="contain" -->` → `layout: image-full` with `image: URL` and `backgroundSize: contain`.
- Inline `data-background-color` on other slides → nearest-fit layout (`section`/`center`); do not hardcode the color (the theme owns it).
- Two-column content → `two-cols` / `two-cols-header`.
- Plain prose/lists/tables/code → `default`.
- Reveal vertical slides (`--`) → flatten to horizontal (`---`); Slidev has no vertical stacks.
- Remove all `<!-- .slide: … -->` directives and any Reveal-only HTML.
- Preserve speaker notes as Slidev `<!-- notes -->` where present.

**Artifact cleanup (per deck):** delete `index.html`, `_source.html`,
`index-static.html` (if present), and `meta.yaml` (its content is folded into
frontmatter).

## Build pipeline change

Modify `scripts/build.js` so `findDecks` skips any deck whose `slides.md` has a
Slidev frontmatter `theme:` key — keeps Pandoc working for any future Reveal
deck while ignoring all Slidev decks (including the pre-existing `bookmarklets`).

## Verification

Per deck: `pnpm exec slidev build "<deck>/slides.md" --out <scratch>` succeeds
with no missing-layout errors. After the build.js change: `node scripts/build.js`
reports 0 decks (all are now Slidev) and does not error on any Slidev deck.

## Out of scope

- Rewriting slide *content* beyond what the layout mapping requires (faithful migration, not a content rewrite).
- A multi-deck Slidev build/serve orchestration script (decks remain runnable via `slidev <path>`); can be a follow-up.

## Success criteria

- All 6 decks build as Slidev on the feoche theme.
- No `<!-- .slide: … -->` directives or Reveal artifacts remain in converted decks.
- `node scripts/build.js` no longer attempts to Pandoc-build Slidev decks.
- Each deck converted + cleaned in its own commit (sequential).
