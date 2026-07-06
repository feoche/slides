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
  handleBackground(props.media, false, props.backgroundSize ?? "contain"),
);
</script>

<template>
  <div
    v-if="window"
    class="slidev-layout media-full media-full--window default"
  >
    <Window
      :src="media"
      :scale="scale"
      :object-fit="objectFit"
      :type="type"
      :title="windowTitle"
    />
  </div>
  <div v-else class="slidev-layout media-full default" :style="style">
    <slot />
  </div>
</template>

<style>
.slidev-layout.media-full {
  height: calc(100% - var(--footer-height));

  &.media-full--window {
    @apply flex items-center justify-center;
    /* wider floor than the default media frame */
    --media-frame-min-width: 250px;
    width: 100%;
    padding: 1rem 2.5rem;

    .window,
    .mobile {
      min-width: var(--media-frame-min-width);
    }
  }
}
</style>
