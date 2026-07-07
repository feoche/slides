<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  nextTick,
} from "vue";

const props = defineProps<{
  src: string;
  title?: string;
  // Chrome style: a desktop browser window (default) or a mobile phone frame.
  type?: "desktop" | "mobile";
  // Content kind; auto-detected from src when omitted.
  content?: "iframe" | "image";
  scale?: number;
  objectFit?: string;
  url?: string;
}>();

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;

const renderAs = computed<"iframe" | "image">(
  () => props.content ?? (IMAGE_EXT.test(props.src) ? "image" : "iframe"),
);

// Device auto-detected from the image aspect ratio (portrait -> mobile,
// landscape -> desktop); iframes have no measurable ratio so default to
// desktop. The `type` prop always overrides.
const detected = ref<"desktop" | "mobile" | null>(null);

const device = computed(() => props.type ?? detected.value ?? "desktop");

function detectDevice() {
  if (renderAs.value !== "image" || typeof Image === "undefined") {
    detected.value = null;
    return;
  }
  const probe = new Image();
  probe.onload = () => {
    detected.value =
      probe.naturalHeight > probe.naturalWidth ? "mobile" : "desktop";
    nextTick(fit);
  };
  probe.src = props.src;
}

const scaleInvertPercent = computed(() => `${(1 / (props.scale || 1)) * 100}%`);

// Desktop image windows fill the available height via CSS; the image fills that
// height at its natural aspect ratio. CSS shrink-to-fit can't match the window
// width to the height-scaled image, so only the width is set here (height stays
// 100% in CSS) — the chrome hugs the image with no side bars. Mobile frames
// have a fixed aspect ratio and need none of this.
const root = ref<HTMLElement | null>(null);
const header = ref<HTMLElement | null>(null);
const subheader = ref<HTMLElement | null>(null);
const img = ref<HTMLImageElement | null>(null);

// Mobile frame refs (mirror of the desktop ones for the phone chrome).
const mobileRoot = ref<HTMLElement | null>(null);
const mobileBar = ref<HTMLElement | null>(null);
const mobileImg = ref<HTMLImageElement | null>(null);

const MOBILE_MIN_WIDTH = 200;

// Mobile image frames fill 100% of the available height; the frame width is
// derived from the image's aspect ratio so the phone chrome hugs the image with
// no bars beside it (floored at MOBILE_MIN_WIDTH). Iframes keep their CSS
// sizing.
function fitMobile() {
  const el = mobileRoot.value;
  const image = mobileImg.value;
  if (
    device.value !== "mobile" ||
    renderAs.value !== "image" ||
    !el ||
    !image ||
    !image.naturalWidth
  )
    return;

  el.style.height = "100%";
  const frameH = el.clientHeight;
  if (frameH <= 0) return;

  const styles = getComputedStyle(el);
  const padX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const padY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  const barH = mobileBar.value?.offsetHeight ?? 0;
  const contentH = frameH - padY - barH;
  if (contentH <= 0) return;

  const ratio = image.naturalWidth / image.naturalHeight;
  el.style.width = `${Math.max(MOBILE_MIN_WIDTH, Math.round(contentH * ratio + padX))}px`;
}

function fit() {
  fitImage();
  fitMobile();
}

function fitImage() {
  const el = root.value;
  const image = img.value;
  if (
    device.value !== "desktop" ||
    renderAs.value !== "image" ||
    !el ||
    !image ||
    !image.naturalWidth
  )
    return;

  // Measure the available area, then set the width to the image's displayed
  // width (capped to the area). Height is left to CSS (100%).
  el.style.width = "100%";
  const availW = el.clientWidth;
  const chromeH =
    (header.value?.offsetHeight ?? 0) + (subheader.value?.offsetHeight ?? 0);
  const availH = el.clientHeight - chromeH;
  if (availW <= 0 || availH <= 0) return;

  const ratio = image.naturalWidth / image.naturalHeight;
  el.style.width = `${Math.min(availW, Math.round(availH * ratio))}px`;
}

let observer: ResizeObserver | null = null;

onMounted(() => {
  detectDevice();
  fit();
  // Observe the parent (the available area); our own width change must not
  // feed back into the observer.
  const parent = (root.value ?? mobileRoot.value)?.parentElement;
  if (typeof ResizeObserver !== "undefined" && parent) {
    observer = new ResizeObserver(() => fit());
    observer.observe(parent);
  }
});

onBeforeUnmount(() => observer?.disconnect());

watch(
  () => [props.src, props.content],
  () => {
    detectDevice();
    nextTick(fit);
  },
);
</script>

<template>
  <!-- Mobile phone frame -->
  <div
    v-if="device === 'mobile'"
    ref="mobileRoot"
    class="mobile"
    :class="{ 'mobile--image': renderAs === 'image' }"
    :style="renderAs === 'iframe' ? { width: scaleInvertPercent } : {}"
  >
    <div class="mobile-screen">
      <div ref="mobileBar" class="mobile-bar">
        <mdi-home class="mobile-bar-icon">⌂</mdi-home>
        <span class="mobile-url">{{ url || "" }}</span>
        <mdi-menu class="mobile-bar-icon">☰</mdi-menu>
      </div>
      <div
          class="mobile-content"
          :style="renderAs === 'iframe' ? { width: scaleInvertPercent } : {}"
      >
        <iframe
            v-if="renderAs === 'iframe'"
            :src="src"
            :style="
              scale
                ? { transform: `scale(${scale})`, transformOrigin: 'top left' }
                : {}
            "
        />
        <img
            v-else
            ref="mobileImg"
            :src="src"
            class="mobile-img"
            :style="{ objectFit: objectFit || 'contain' }"
            @load="fitMobile"
        />
      </div>
    </div>
  </div>

  <!-- Desktop browser window -->
  <div
    v-else
    ref="root"
    class="window"
    :class="{ 'window--image': renderAs === 'image' }"
    :style="renderAs === 'iframe' ? { width: scaleInvertPercent } : {}"
  >
    <span ref="header" class="window-header">
      <span class="window-title">{{ title }}</span>
      <span class="window-controls">
        <span>−</span>
        <span class="text-sm">⧉</span>
        <span>×</span>
      </span>
    </span>
    <span ref="subheader" class="window-subheader">
      <span class="window-subcontrols">
        <span>←</span>
        <span>→</span>
        <span>⟳</span>
      </span>
      <input
        type="search"
        class="window-url"
        :value="renderAs === 'iframe' ? (url ?? src) : undefined"
      />
    </span>
    <iframe
      v-if="renderAs === 'iframe'"
      :src="src"
      :style="
        scale
          ? { transform: `scale(${scale})`, transformOrigin: 'top left' }
          : {}
      "
    />
    <img
      v-else
      ref="img"
      :src="src"
      class="window-img"
      :style="{ objectFit: objectFit || 'contain' }"
      @load="fitImage"
    />
  </div>
</template>

<style>
.window {
  @apply relative w-full h-full m-4 mb-0 rounded-2 overflow-hidden bg-[--color-green] border-1 border-gray box-sizing-border-box shadow-2xl;
  height: calc(100% - var(--media-frame-inset));

  .window-header {
    @apply flex bg-[--color-deep-green] color-[--color-cream] py-1.5 px-2 rounded-t-md place-content-between place-items-center overflow-hidden;
  }

  .window-title {
    @apply flex font-bold mx-1 color-[--color-cream];
  }

  .window-controls {
    @apply flex gap-1;

    & > span {
      @apply w-5 h-5 inline-flex items-center justify-center rounded-full bg-gray-200 font-sm opacity-50 color-[--color-deep-green];
    }
  }

  .window-subheader {
    @apply flex bg-gray-200 color-gray gap-2 p-1;

    .window-subcontrols {
      @apply flex gap-1;

      & > span {
        @apply w-6 h-6 inline-flex items-baseline justify-center lh-5 font-lg color-[--color-deep-green];
      }
    }

    .window-url {
      @apply box-border w-full flex-1 px-2 rounded-sm border-gray border-solid border-1 text-xs lh-1 bg-[--color-cream] color-[--color-deep-green];
    }
  }

  iframe {
    @apply w-full h-full;
  }
}

/* Desktop image windows fill the available height and center in their area; the
   image fills that height at its natural aspect ratio. The window width is set
   to the image's displayed width in script (see fitImage) so the chrome hugs
   the image. Default width is 100% for the no-JS / pre-hydration case. */
.window--image {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  margin: auto;

  .window-img {
    display: block;
    flex: 1 1 0;
    min-height: 0;
    width: 100%;
  }
}

/* Mobile phone frame: fixed aspect ratio, sized purely in CSS. */
.mobile {
  @apply relative flex flex-col overflow-hidden bg-[--color-deep-green] shadow-2xl box-sizing-border-box;
  padding: 0.55rem;
  border-radius: 2.25rem;

  &::before {
    content: "";
    @apply absolute top-[0.125rem] left-1/2 z-10 bg-[--color-deep-green];
    width: 32%;
    height: 1.1rem;
    transform: translateX(-50%);
    border-bottom-left-radius: 0.7rem;
    border-bottom-right-radius: 0.7rem;
  }

  .mobile-screen {
    @apply relative flex flex-1 flex-col overflow-hidden bg-[--color-cream];
    border-radius: 1.75rem;
    min-height: 0;
  }

  .mobile-bar {
    @apply flex items-center pt-4 pb-1 px-3 gap-2 bg-gray-200 color-[--color-deep-green];

    .mobile-bar-icon {
      @apply flex-none text-black text-lg color-[--color-deep-green];
    }

    .mobile-url {
      @apply flex-1 overflow-hidden whitespace-nowrap box-sizing-border-box h-5 px-1 rounded-sm border-gray border-solid border-1 text-xs lh-5 bg-[--color-cream] color-[--color-deep-green];
    }
  }

  .mobile-content {
    @apply flex flex-1 flex-col;
    min-height: 0;

    iframe {
      @apply h-full w-full;
    }

    .mobile-img {
      @apply h-full w-auto;
      min-height: 0;
    }
  }
}

/* Mobile image frames fill 100% height; the frame width is set in script
   (see fitMobile) from the image ratio so the whole image shows with no side
   bars. Default width is auto for the no-JS / pre-hydration case. */
.mobile--image {
  height: 100%;
  width: auto;
}
</style>
