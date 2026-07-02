# slidev-theme-feoche

[![NPM version](https://img.shields.io/npm/v/slidev-theme-feoche?color=3AB9D4&label=)](https://www.npmjs.com/package/slidev-theme-feoche)

A (...) theme for [Slidev](https://github.com/slidevjs/slidev).

<!--
  Learn more about how to write a theme:
  https://sli.dev/guide/write-theme.html
--->

<!--
  run `npm run dev` to check out the slides for more details of how to start writing a theme
-->

<!--
  Put some screenshots here to demonstrate your theme

  Live demo: [...]
-->

## Install

Add the following frontmatter to your `slides.md`. Start Slidev then it will prompt you to install the theme automatically.

<pre><code>---
theme: <b>feoche</b>
---</code></pre>

Learn more about [how to use a theme](https://sli.dev/guide/theme-addon#use-theme).

## Layouts

### three-cols

Three columns (`1fr 2fr 1fr`) with an optional spanning bottom row. Add `layoutClass: centered` to vertically/horizontally center each column.

```md
---
layout: three-cols
---
::left::
Left
::center::
Center
::right::
Right
::bottom::
Spans all columns
```

### three-cols-header

Full-width header (default slot) above three equal columns.

```md
---
layout: three-cols-header
---
# Header
::left::
Left
::center::
Center
::right::
Right
```

### three-rows

Three stacked, vertically centered rows.

```md
---
layout: three-rows
---
::top::
Top
::center::
Center
::bottom::
Bottom
```

### six-cells-header

Full-width header above a 2×3 grid of cells.

```md
---
layout: six-cells-header
---
# Header
::top-left::
TL
::top-center::
TC
::top-right::
TR
::bottom-left::
BL
::bottom-center::
BC
::bottom-right::
BR
```

### screenshot

A device-framed screenshot flanked by two columns. Set `layoutClass` to `laptop` (default) or `mobile`, and `screenshot` to the image path.

```md
---
layout: screenshot
layoutClass: laptop
screenshot: /my-shot.png
---
::left::
Context
::right::
Notes
```

### Utility layouts

- `none` — bare slot passthrough with no chrome.
- `404` / `error` — used internally by Slidev.

## Components

This theme provides the following components:

> TODO:

## Contributing

- `npm install`
- `npm run dev` to start theme preview of `example.md`
- Edit the `example.md` and style to see the changes
- `npm run export` to generate the preview PDF
- `npm run screenshot` to generate the preview PNG
