---
theme: ./src/theme
title: Window component test
---

# Window test deck

Scratch deck — delete after verifying (plan Task 4).

---
layout: iframe
url: https://example.com
scale: 0.75
iframeTitle: Example (iframe)
---

## iframe (slot + window)

- bullet one
- bullet two

---
layout: iframe-full
url: https://example.com
iframeTitle: Example (iframe-full)
---

---
layout: iframe-left
url: https://example.com
iframeTitle: Example (iframe-left)
---

## iframe-left slot

window on the left

---
layout: iframe-right
url: https://example.com
iframeTitle: Example (iframe-right)
---

## iframe-right slot

window on the right

---
layout: image-window
image: https://example.com/window-test.png
iframeTitle: Shot (image-window)
---

## image-window (slot + window)

- bullet one

---
layout: image-window-full
image: https://example.com/window-test.png
iframeTitle: Shot (image-window-full)
---

---
layout: image-window-left
image: https://example.com/window-test.png
iframeTitle: Shot (image-window-left)
---

## image-window-left slot

---
layout: image-window-right
image: https://example.com/window-test.png
objectFit: contain
iframeTitle: Shot (image-window-right)
---

## image-window-right slot

---
layout: default
---

## Raw Window component

<Window src="https://example.com" title="Direct iframe" :scale="0.5" />

<Window src="https://example.com/pic.png" title="Direct image (auto-detect)" object-fit="contain" />

<Window src="https://example.com/no-ext" type="image" title="Type override → image" />
