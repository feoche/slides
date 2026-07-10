# Pandoc Document Export for Slidev Decks — Design

**Date:** 2026-07-10
**Author:** François Eoche (with Claude)
**Status:** Approved design, pending implementation plan

## Problem

All decks in this repo have migrated to Slidev (each `slides.md` declares
`theme:`). The migration left the previous Pandoc→reveal.js pipeline orphaned:

- `_templates/` (which held the reveal.js template and meta) was deleted.
- `scripts/build.js` still runs Pandoc against a missing template and
  *skips* every deck that declares `theme:` — i.e. all current decks.
- `scripts/new-talk.js` scaffolds reveal.js decks, not Slidev decks.

We want Pandoc to serve a new role: **export Slidev decks into readable
document formats** — flat Markdown, a standalone HTML handout, and a PDF
document (a reading document, not slides). Slidev keeps its native
PDF/PPTX/PNG *slide* export; Pandoc covers the document/handout outputs
Slidev does not produce.

## Goal / Non-goals

**Goals**
- Convert each deck's `slides.md` to: flat GFM Markdown, standalone HTML
  handout, and PDF document.
- Reuse the existing Node+Pandoc + per-deck `meta.yaml` conventions.
- Repurpose the orphaned scripts cleanly.

**Non-goals**
- Reproducing slide visuals/layouts faithfully — this is a *document*, not a
  slide render.
- Including speaker notes (explicitly excluded — see Decisions).
- Round-tripping documents back into Slidev.

## The core challenge: Pandoc-clean input

A Slidev `slides.md` is not directly Pandoc-readable:

- Per-slide `---` separators + `layout:` frontmatter blocks → Pandoc sees
  stray horizontal rules and mid-document YAML.
- Slidev constructs: slot markers (`::left::` / `::right::`), the `<Window>`
  component, `v-click` / `v-motion` / `<template>` directives.
- `media-*` layouts put their image in frontmatter (`media:`), not the body.
- Speaker notes live in `<!-- -->` comments.

So a normalization step must run before Pandoc.

## Approach (chosen: A)

Use Slidev's own parser (`@slidev/parser`, already present transitively at
v52.16.0) to split the deck into `{ frontmatter, content, note }` per slide
with exact Slidev semantics, then a pure transformer flattens each slide into
clean Markdown, concatenate, and hand the intermediate to Pandoc.

Rejected alternatives:
- **B — `slidev export --format md` → Pandoc:** less code, but the export
  still carries layout frontmatter/Vue bits and gives no control over
  structure; quality unknown and unmodifiable.
- **C — raw `slides.md` + Pandoc Lua filter:** most fragile; mid-document YAML
  and Vue components are exactly what Pandoc's reader handles poorly.

## Architecture

```
slides.md ──[@slidev/parser]──> slides[] ──[normalizer]──> clean.md ──[pandoc]──> {.md, .html, .pdf}
             split + frontmatter                (intermediate)          per --to
```

## Components

### 1. `scripts/lib/slidev-normalize.js` (pure, unit-testable)

- **Input:** parsed Slidev deck (headmatter + slides array).
- **Output:** a single Pandoc-friendly Markdown string.
- **Per-slide transform rules:**
  - Drop slide separators and layout-only frontmatter.
  - **Slots** `::left::` / `::right::` → remove markers, keep content in order.
  - **`media-*` layouts** → emit frontmatter `media:` image as
    `![](path)` at the slide top so images survive into the handout.
  - **`<Window>`** → unwrap to inner content (optionally a titled fenced block).
  - **`v-click` / `v-motion` / `<template>`** directives → strip wrapper,
    preserve inner content.
  - **Speaker notes** → dropped (excluded per decision).
  - **Headings:** `layout: section`/`cover`/`intro` slide headings map to `#`;
    normal content slide headings map to `##`, giving the document real
    structure.

### 2. `scripts/export-docs.js` (orchestrator, replaces build.js)

- Mirrors current `build.js` shape: recursive deck discovery, `--deck` filter,
  `--verbose`, per-deck `meta.yaml` merge over `_templates/default-meta.yaml`,
  Pandoc presence check with the friendly install message.
- **Inverts the deck filter:** now *targets* decks that declare `theme:`
  (all current decks) instead of skipping them.
- For each deck, writes the intermediate `clean.md`, then runs Pandoc per
  format into `<deck>/export/`:
  - `--to gfm` → `export/slides.md` (flat markdown)
  - `--to html5 --standalone` (+ handout template/CSS) → `export/handout.html`
  - `--to pdf` (via `--pdf-engine`) → `export/handout.pdf`

### 3. Templates — recreate a minimal `_templates/` for export

- `_templates/default-meta.yaml` — shared Pandoc metadata defaults.
- `_templates/handout.html` + `_templates/handout.css` — export-flavored
  standalone HTML template (document, not reveal.js).

### 4. `scripts/new-talk.js` — scaffold Slidev decks

- Replace the reveal.js shell/markdown scaffold with a Slidev `slides.md`
  (frontmatter with `theme: <relative path to src/theme>`, `layout: cover`,
  a couple of example slides using repo layouts) plus optional `meta.yaml`
  for export metadata. Remove the reveal.js `index.html` generation.

### 5. `package.json`

- Add `@slidev/parser` as a direct dependency.
- Scripts: `export:docs` (all decks), `export:docs -- --deck <path>` (one).

## Data flow & error handling

- **Missing Pandoc** → friendly install message, exit (as today).
- **Missing LaTeX / PDF engine** → warn and skip PDF only; still emit
  `.md`/`.html`. Do not fail the whole run.
- **Per-deck failures isolated**; end-of-run summary counts (matches current
  `build.js` UX).
- **Assets:** outputs live in `<deck>/export/`; image paths are deck-relative.
  For HTML the relative `assets/...` links resolve from the deck; for PDF pass
  `--resource-path=<deck dir>`.

## Testing

- Unit tests for `slidev-normalize.js` covering each transform rule (slots,
  media layout image extraction, `<Window>` unwrap, directive stripping,
  heading mapping, notes exclusion) using small fixture slide inputs.
- Integration smoke: run `export:docs --deck misc/speedrun` and assert the
  three output files exist and the flat markdown contains expected headings
  and no `layout:`/`::right::`/`<!-- -->` residue.

## Decisions

- **Speaker notes:** excluded entirely from all exports.
- **Old scripts:** `build.js` repurposed into `export-docs.js`; `new-talk.js`
  updated to scaffold Slidev decks. Dead reveal.js pipeline removed.
- **Formats:** flat Markdown, standalone HTML handout, PDF document.
