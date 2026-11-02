# Contributing

Conventions for writing talks and working on the tooling in this repository.

## Project Overview

A monorepo of talks written in **Slidev** (Vue 3 + Markdown) with a custom theme at `src/theme/`
(`slidev-theme-feoche`). **All talk content lives in `talks/`**, sorted into `talks/pro/` (work) and `talks/misc/`
(side projects); `src/` only holds tooling (theme, shared slides, templates). Every deck follows one common structure,
documented in `README.md` and embodied by `talks/slides.example.md`.

## Commands

```bash
# Scaffold a new talk in talks/<pro|misc>/<slug>/ (copies talks/slides.example.md)
npm run new -- pro/my-talk "My Talk Title"
npm run new -- misc/my-talk "My Talk Title"

# Slidev development (one deck at a time; slug = path under talks/, or just the folder name)
pnpm dev bookmarklets       # Serve a deck on :3030 (interactive picker without slug)
pnpm dev showcase           # Preview every theme layout (src/common/showcase)
pnpm build [bookmarklets]   # Build the website: every talk + home page (or one deck) into dist/
pnpm export bookmarklets    # Export one deck to PDF in its export/ folder (requires playwright-chromium)

# Export decks to documents (Markdown, HTML, PDF via Pandoc)
npm run export:docs                             # Export all decks
npm run export:docs -- --deck pro/bookmarklets  # Export single deck
npm run export:docs -- --verbose                # Show pandoc commands

# Format markdown
pnpm prettier --write "**/*.md"
```

## Creating or editing a deck — MUST follow

- **New deck**: always run `npm run new -- <pro|misc>/<slug> "Title"`. Never write a deck from scratch or copy another
  talk. Categories: `pro` (work) and `misc` (side projects) — nothing else.
- **Deck folder**: `talks/<pro|misc>/<slug>/` with `slides.md`, `meta.yaml` and `img/` (assets, referenced as
  `/file.jpg`). Don't create an `assets/` folder, and never put talks under `src/` or at the repo root.
- **Outlines**: a talk may start as `talks/<pro|misc>/<slug>/outline.md` (abstract + chapters). To turn it into a deck,
  run `npm run new` on the same slug, then fill `info`, `date`, `duration`, `keywords` and one section slide per `#`
  chapter from the outline.
- **Slide order** (keep it, even when the user only asks for content):
  1. headmatter + `layout: cover` slide (with the `::qr-code::` block: `<MediaEl :src="'qr:' + $frontmatter.url"/>`)
  2. `src: ../../../src/common/intro.md`
  3. `src: ../../../src/common/disclaimer.md`
  4. `src: ../../../src/common/toc.md`
  5. content: per chapter, one `layout: section` slide with a `# h1`, then content slides titled with `## h2`
  6. a `layout: center` closing slide
  7. `src: ../../../src/common/end.md`, with `qrCode: qr:<url>` (or an image) next to it for the feedback QR code
     (the one QR code set in frontmatter: shared slides can't take content from the talk)
- **Shared slides** live in `src/common/`; include them with `src:`, never copy their content into a deck.
  Paths are relative to the deck (`../../../` to the repo root for `<pro|misc>/<slug>`, one more `../` per extra
  level; same for `theme: ../../../src/theme`).
- **Headmatter**: keep every key from `slides.example.md` (`title`, `info`, `url`, `date`, `keywords`, `colorSchema`,
  `duration`, `htmlAttrs`, `seoMeta`, `theme`, `addons`); fill them in, don't delete them. `themeConfig` is optional:
  use it to override theme colors (keys listed in `README.md`, section *Colors*).
- **Headings**: `#` only on cover and section slides (they build the TOC), `##` slide titles, `###` subtitles
  (on the line right under the title: a blank line in between makes it a regular heading).
- **Layouts**: use only theme layouts (list + slots in `README.md`, snippets in `src/templates/`). Prefer an existing
  layout over custom HTML/CSS; a per-slide `<style>` block is the last resort.
- **Media**: use `media`, `media-left`, `media-right`, `media-full` with the `media:` prop (image, `.mp4`, YouTube
  URL or `qr:<data>` for a QR code); `window: true` for a browser frame, `type: mobile` for a phone. In slide content,
  QR codes and other media are `<MediaEl src="qr:…"/>`.
- **Images in slide content**: write `<img :src="'/file.jpg'" alt="…">` (bound `src`). Markdown `![](/file.jpg)` and
  plain `<img src="/file.jpg">` fail the build (Slidev import guard). Frontmatter `media: /file.jpg` is fine.
- **Speaker notes** go in a trailing `<!-- ... -->` comment on each slide.
- Default language is French (`htmlAttrs.lang: fr`) unless told otherwise.
- **Verify** a deck by building it: `pnpm exec slidev build talks/<pro|misc>/<slug>/slides.md --out <tmp dir>`.
- When the structure or a layout changes, update `slides.example.md`, `README.md` and `CONTRIBUTING.md` together.

## Architecture

**Custom Slidev theme** (`src/theme/`): layouts in `layouts/`, components (`MediaEl`, `Window`, `Progress`) in
`components/`, design tokens in `styles/tokens.css`, helpers in `layoutHelper.ts` (`formatDate`, `handleBackground`,
`detectMediaKind`). The author name is set in `src/theme/package.json` and read via `$slidev.configs.author`.

**Talks**: `talks/pro/`, `talks/misc/`. Shared slides in `src/common/`, plus the `showcase` and `media-demo` decks
used to preview the theme. `scripts/boards.js` discovers every `talks/**/slides.md` (slug relative to `talks/`) and
`src/common/**/slides.md` (slug `common/<name>`); `pnpm dev` also accepts a unique folder name.

**Scripts**: `new-talk.js` (scaffold from the example), `serve-boards.js` (`pnpm dev`), `build-boards.js`
(`pnpm build`, home page, its style and 404 fallback in `scripts/lib/`; talks shown on the home page in
`talks/home.yaml`), `export-board.js` (`pnpm export`),
`export-docs.js` (Pandoc export using `src/_templates/` and the deck's `meta.yaml`).

## Key Conventions

- Package manager: **pnpm** (workspace configured in `pnpm-workspace.yaml`)
- Prettier with `prettier-plugin-slidev` reformats `.md` files using the slidev parser
- Fonts: Albert Sans (body), Outfit (headings), Cascadia Code (monospace)
- Theme supports both light and dark color schemes; primary color is `#00574a`
- Canvas: 980px wide, 16:9 aspect ratio
- Date frontmatter (`date: 2026-06-09`) is accessible in layouts via `$frontmatter.date`
