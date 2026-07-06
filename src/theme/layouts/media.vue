<script setup lang="ts">
import { computed } from "vue";
import { handleBackground } from "../layoutHelper";

const props = defineProps<{
  media?: string;
  window?: boolean;
  type?: "desktop" | "mobile";
  scale?: number;
  objectFit?: string;
  backgroundSize?: string;
  windowTitle?: string;
}>();

const style = computed(() =>
  handleBackground("transparent", false, props.backgroundSize ?? "cover"),
);
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
    />
    <img v-else :src="media" :style="style" />
  </div>
</template>

<style>
.slidev-layout.media {
  @apply h-full;

  &:not(.media--window) {
    @apply flex flex-col gap-8;

    img {
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
