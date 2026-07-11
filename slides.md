---
# === EDIT THESE INFORMATIONS ===
# title of your slide, will inferred from the first header if not specified
# (use search&replace to update)
title: Super Title

# slides description
# (use search&replace to update)
info: Talk description

# URL of the presentation
# (use search&replace to update)
url: https://slides.com/feoche/les-bookmarklets-c-est-chouette

# date of the presentation
date: 2024-06-21

# keywords field for exported PDF, comma-delimited
keywords: keyword1,keyword2

# force color schema for the slides, can be 'auto', 'light', or 'dark'
colorSchema: auto

# duration of the presentation
duration: 30min

# HTML tag attributes
htmlAttrs:
  dir: ltr
  lang: fr

# SEO meta tags
seoMeta:
  ogTitle: Super Title
  twitterTitle: Super Title
  ogDescription: Talk description
  twitterDescription: Talk description

  ogImage: https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60
  ogUrl: https://slides.com/feoche/les-bookmarklets-c-est-chouette
  twitterCard: summary_large_image
  twitterImage: https://pbs.twimg.com/profile_images/1881465971619119105/PdAr46fd_400x400.jpg
  twitterSite: francoiseoche
  twitterUrl: https://x.com/francoiseoche

# theme id, package name, or local path
# Learn more: https://sli.dev/guide/theme-addon.html#use-theme
theme: "./src/theme"
hideInToc: true
addons:
  - slidev-addon-qrcode
---

# {{ $frontmatter.title }}

### {{ $slidev.configs.author }}

::qr-code::
<QRCode
    class="qr-code"
    :width="200"
    :height="200"
    type="svg"
    :data="$frontmatter.url"
    color="transparent"
    :dotsOptions="{ color: 'white' }"
/>

<!-- Speaker Notes -->

---
src: ./src/decks/_common/intro.md
---
=== INTRODUCTION ===
---
src: ./src/decks/_common/disclaimer.md
---
=== DISCLAIMER ===
---
src: ./src/decks/_common/toc.md
---
=== TOC ===


---
src: ./src/templates/section.md
---
=== SECTION ===

---
src: ./src/templates/default.md
---
=== DEFAULT ===


---
src: ./src/templates/table.md
---
=== TABLE ===


---
src: ./src/templates/code.md
---
=== CODE ===

---
src: ./src/templates/full.md
---
=== FULL ===

---
src: ./src/templates/center.md
---
=== CENTER ===

---
src: ./src/templates/fact.md
---
=== FACT ===

---
src: ./src/templates/quotes.md
---
=== QUOTES ===



---
layout: media-full
media: https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60
backgroundSize: contain
---

<!-- Speaker Notes -->

---
layout: media
media: https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60
---

## Media

<!-- Speaker Notes -->

---
layout: media-left
media: "https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60"
---

## Media Left
### A cool subtitle

This is an image on the left

<!-- Speaker Notes -->

---
layout: media-right
media: "https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60"
---

## Media Right
### A cool subtitle

This is an image on the right

---
layout: media-full
window: true
media: https://francoiseoche.fr/
windowTitle: Website
---

<!-- Speaker Notes -->

---
layout: media
window: true
media: https://francoiseoche.fr/
windowTitle: Website
---

## Media Window

<!-- Speaker Notes -->

---
layout: media-left
window: true
media: https://francoiseoche.fr/
windowTitle: Website
---

## Media Window Left
### A cool subtitle

This is an iframe on the left

<!-- Speaker Notes -->

---
layout: media-right
window: true
media: https://francoiseoche.fr/
windowTitle: Website
---

## Media Window Right
### A cool subtitle

This is an iframe on the right

<!-- Speaker Notes -->

---
layout: media
window: true
media: https://www.iamfy.co/cdn/shop/files/m_2Fx1000_2F25dccac9-6ec7-490d-9c7d-5b02facba143_fe3c11a6-046f-402a-bdfa-38a1dcdbc0e4.jpg?crop=center&height=1000&v=1761237025&width=750&quality=60
---

## Media Window (portrait → mobile frame)

<!-- Speaker Notes -->

---
src: ./src/templates/two-cols.md
---
=== TWO COLS ===

---
src: ./src/templates/two-cols-header.md
---
=== TWO COLS HEADER ===

---
src: ./src/templates/three-cols.md
---
=== THREE COLS ===

---
src: ./src/templates/three-cols-header.md
---
=== THREE COLS HEADER ===

---
src: ./src/templates/three-rows.md
---
=== THREE ROWS ===

---
src: ./src/templates/six-cells-header.md
---
=== SIX CELLS HEADER ===

---
src: ./src/templates/draggable-elements.md
---
=== DRAGGABLE ELEMENTS ===

---
src: ./src/templates/diagrams.md
---
=== DIAGRAMS ===

---
src: ./src/templates/end.md
---
=== END ===

