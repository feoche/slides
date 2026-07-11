# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A monorepo for creating presentations using two systems side-by-side:
- **Slidev** (Vue 3 + Markdown) — the primary system, with a custom theme at `src/theme/`
- **Reveal.js** (Pandoc-based static builds) — used by legacy decks under `src/pro/` and `src/z-misc/`

## Commands

```bash
# Slidev development
pnpm dev              # Start Slidev dev server (auto-opens browser)
pnpm build            # Build Slidev presentation for production
pnpm export           # Export slides to PDF (requires playwright-chromium)

# Export decks to documents (Markdown, HTML, PDF via Pandoc)
npm run export:docs                        # Export all Slidev decks
npm run export:docs -- --deck pro/bookmarklets  # Export single deck
npm run export:docs -- --verbose           # Show pandoc commands

# Scaffold a new talk
npm run new -- pro/my-talk "My Talk Title"
npm run new -- z-misc/my-talk "My Talk Title"

# Format markdown
pnpm prettier --write "**/*.md"
```

## Architecture

**Custom Slidev theme** (`src/theme/`): Published as `slidev-theme-feoche`. Contains 19 layouts (cover, section, quote, fact, image variants, iframe variants, two-cols, etc.), design tokens in `styles/tokens.css`, and helper functions in `layoutHelper.ts` (`formatDate`, `handleBackground`).

**Presentation decks**: Slidev decks live in `src/decks/` (organized as `src/decks/pro/`, `src/decks/misc/`, and `src/decks/_common/`), each containing `slides.md`, `meta.yaml`, and `assets/`.

**Build pipeline**:
- Slidev: `@slidev/cli` (Vite-based) builds and exports to PDF. `scripts/export-docs.js` exports decks to Markdown/HTML/PDF via Pandoc, using templates in `src/_templates/`.

## Key Conventions

- Package manager: **pnpm** (workspace configured in `pnpm-workspace.yaml`)
- Prettier with `prettier-plugin-slidev` reformats `.md` files using the slidev parser
- Fonts: Albert Sans (body), Outfit (headings), Cascadia Code (monospace)
- Theme supports both light and dark color schemes; primary color is `#00574a`
- Canvas: 980px wide, 16:9 aspect ratio
- Date frontmatter (`date: 2026-06-09`) is accessible in layouts via `$frontmatter.date`
- Reveal.js markdown uses `---` for horizontal slides and `--` for vertical slides
