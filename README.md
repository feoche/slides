# Slides Repository

Presentation slides by **François Eoche**, grouped by talk.  
Each talk lives in its own folder and is rendered as a [reveal.js](https://revealjs.com) presentation.  
Slides are authored in **Markdown** using reveal.js native markdown support (`data-markdown`).  
A [Pandoc](https://pandoc.org) build pipeline is also available for static/self-contained exports.

## Repository structure

```
slides/
├── _templates/
│   ├── revealjs.html        # Pandoc HTML template (reveal.js 5)
│   ├── shell.html           # Reference template for index.html shells
│   └── default-meta.yaml    # Shared Pandoc metadata & reveal.js defaults
├── _templates/
│   └── custom.css           # GLOBAL STYLES — design tokens, utilities, layout helpers
├── scripts/
│   ├── build.js             # Runs Pandoc on every slides.md → index-static.html
│   └── new-talk.js          # Scaffolds a new talk folder
├── pro/
│   └── <talk-slug>/         # Professional talks
│       ├── slides.md        # ← EDIT THIS — reveal.js markdown content
│       ├── meta.yaml        # Pandoc metadata (title, author, theme…)
│       ├── index.html       # reveal.js shell (loads slides.md at runtime)
│       ├── _source.html     # Original slides.com HTML (reference, do not edit)
│       └── assets/          # Talk-specific images
├── misc/
│   └── <talk-slug>/         # Miscellaneous / hobby talks (same structure)
└── index.html               # Root listing of all talks
```

## How slides work

### Runtime (recommended for presenting)

Each `index.html` is a lightweight **reveal.js shell** that loads `slides.md` at runtime
via the `RevealMarkdown` plugin. **This requires a web server** (not `file://`):

```bash
npm run serve   # starts live-server at http://localhost:3000
```

Then open any deck:
- `http://localhost:3000/pro/bookmarklets/`
- `http://localhost:3000/misc/speedrun/`

### Markdown syntax for slides

Use `slides.md` to author slide content with these separators:

```markdown
# Title Slide

Author name

---

## Horizontal slide (next section)

Content here.

--

## Vertical slide (sub-section)

Nested content.

---

## Fragments

- Item 1 <!-- .element: class="fragment" -->
- Item 2 <!-- .element: class="fragment" -->

---

## Slide with background

<!-- .slide: data-background-color="#ff0000" -->

## Red slide!

---

## Code with line highlighting

```javascript [1|3-5]
function hello(name) {
  // This line is highlighted first
  console.log(`Hello, ${name}!`);
  return true;
}
```

---

## Speaker notes

Notes:
These appear in the presenter view (press S).
```

### Static build (optional, requires Pandoc)

```bash
# Install Pandoc: winget install --id JohnMacFarlane.Pandoc
npm run build              # builds all decks → index-static.html
npm run build -- --deck pro/bookmarklets
```

## Creating a new talk

```bash
npm run new -- pro/my-talk "My Talk Title"
npm run new -- misc/my-hobby-talk "My Hobby Talk"
```

This scaffolds:
- `slides.md` — content template ready to edit
- `meta.yaml` — Pandoc metadata
- `index.html` — reveal.js shell
- `assets/` — directory for images

## Global styling

`_templates/custom.css` is automatically loaded by every deck. It provides:

- **Design tokens** (`:root` variables for fonts, colors, spacing)
- **reveal.js variable overrides** (maps tokens onto reveal.js CSS vars)
- **Layout helpers** — `.columns`, `.card`, `.centered`
- **Utility classes** — `.small`, `.large`, `.accent`, `.muted`, `.success`, `.warning`, `.danger`
- **Table styles** for markdown tables
- **Image styles** for markdown images

Per-deck overrides go in the deck's own `assets/` folder and are referenced from `index.html`.

## Pandoc template

`_templates/revealjs.html` supports all reveal.js configuration options via YAML front matter
in `meta.yaml`. See `_templates/default-meta.yaml` for all available options and their defaults.

---

## Title slide color palette

Use these background colors on section-title slides via the reveal.js slide attribute comment:

```markdown
<!-- .slide: data-background-color="#00574a" -->

# My Section Title
```

The palette is built around **6 base colors** expanded into 15 shades across 3 families.  
All colors use **white text** except `#FEB69C` and `#FFCBA4` which require **dark text** (⚠️).

### 🟢 Teal family

| # | Token | Hex | Usage |
|---|---|---|---|
| 1 | `teal-main` | `#00574a` | ★ Deck title · Speaker intro · Final slide |
| 2 | `teal-deep` | `#003D34` | Darker accent, dramatic section openers |
| 3 | `teal-mid`  | `#006B57` | Lighter teal, secondary sections |
| 4 | `teal-cool` | `#004E6E` | Teal-to-blue bridge, technical sections |
| 5 | `teal-muted`| `#2D5C55` | Muted, subdued chapter headings |

### 🟣 Purple & Blue family

| # | Token | Hex | Usage |
|---|---|---|---|
| 6  | `purple`      | `#784587` | First section after intro |
| 7  | `purple-deep` | `#52306B` | Darker purple, sub-chapters |
| 8  | `indigo`      | `#5254E1` | Second major section |
| 9  | `indigo-deep` | `#3537A8` | Darker indigo, technical deep-dives |
| 10 | `navy`        | `#2D3F8A` | Navy blue, calm informational slides |

### 🔴 Red & Warm family

| # | Token | Hex | Usage |
|---|---|---|---|
| 11 | `rose`         | `#86414B` | Third major section |
| 12 | `terracotta`   | `#AA4D38` | Closing / "what's next" slides |
| 13 | `brick`        | `#7A3427` | Darker warm, strong statements |
| 14 | `peach`        | `#FEB69C` | ⚠️ Light bg — use **dark text** |
| 15 | `peach-deep`   | `#FFCBA4` | ⚠️ Light bg — use **dark text**, soft endings |

### Recommended deck color flow

A typical 4-section deck would follow this progression:

```
Slide type          Color
─────────────────────────────────────
Deck title          #00574a  teal-main  (★)
Speaker / about me  #00574a  teal-main  (★)
─────────────────────────────────────
Section 1 title     #784587  purple
Section 2 title     #5254E1  indigo
Section 3 title     #86414B  rose
Section 4 title     #AA4D38  terracotta
─────────────────────────────────────
Closing / merci     #00574a  teal-main  (★)
```

For more sections, extend with the `-deep` or `-mid` variants from the same family.

