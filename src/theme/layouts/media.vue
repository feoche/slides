<script setup lang="ts">
const props = defineProps<{
  media?: string;
  window?: boolean;
  type?: "desktop" | "mobile";
  scale?: number;
  objectFit?: string;
  backgroundSize?: string;
  windowTitle?: string;
  url?: string;
}>();
</script>

<template>
  <div class="slidev-layout media default" :class="{ 'media--window': window }">
    <slot />
    <Window
      v-if="window"
      :src="media"
      :scale="scale"
      :object-fit="objectFit"
      :type="type"
      :title="windowTitle"
      :url="url"
    />
    <MediaEl v-else :src="media" :object-fit="objectFit" />
  </div>
</template>

<style>
.slidev-layout.media {
  @apply h-full;

  &:not(.media--window) {
    @apply flex flex-col gap-8;
    /* the media stops above the footer */
    height: calc(100% - var(--footer-height));

    /* min-h-0: shrink to the space left under the title */
    img,
    video,
    iframe {
      @apply h-full min-h-0 w-auto object-contain;
    }

    .media-el--qrcode {
      @apply flex-1;
    }
  }

  &.media--window {
    width: calc(100% - var(--footer-height));

    .window,
    .mobile {
      @apply mx-auto;
      min-width: var(--media-frame-min-width);
    }
  }
}
</style>
