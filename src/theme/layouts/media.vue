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
    <Media v-else :src="media" :object-fit="objectFit" />
  </div>
</template>

<style>
.slidev-layout.media {
  @apply h-full;

  &:not(.media--window) {
    @apply flex flex-col gap-8;

    :where(img, video, iframe) {
      @apply h-full w-auto object-contain;
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
