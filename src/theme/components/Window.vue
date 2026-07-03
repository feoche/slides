<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  src: string;
  title?: string;
  type?: "iframe" | "image";
  scale?: number;
  objectFit?: string;
}>();

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;

const resolvedType = computed<"iframe" | "image">(
  () => props.type ?? (IMAGE_EXT.test(props.src) ? "image" : "iframe"),
);

const scaleInvertPercent = computed(() => `${(1 / (props.scale || 1)) * 100}%`);
</script>

<template>
  <div
    class="window"
    :style="resolvedType === 'iframe' ? { width: scaleInvertPercent } : {}"
  >
    <span class="window-header">
      <span class="window-title">{{ title }}</span>
      <span class="window-controls">
        <span>−</span>
        <span class="text-sm">⧉</span>
        <span>×</span>
      </span>
    </span>
    <span class="window-subheader">
      <span class="window-subcontrols">
        <span>←</span>
        <span>→</span>
        <span>⟳</span>
      </span>
      <input
        type="search"
        class="window-url"
        :value="resolvedType === 'iframe' ? src : undefined"
      />
    </span>
    <iframe
      v-if="resolvedType === 'iframe'"
      :src="src"
      :style="
        scale
          ? { transform: `scale(${scale})`, transformOrigin: 'top left' }
          : {}
      "
    />
    <img
      v-else
      :src="src"
      class="w-full h-full object-top"
      :style="{ objectFit: objectFit || 'cover' }"
    />
  </div>
</template>

<style>
.window {
  @apply relative w-full h-full m-4 mb-0 rounded-2 overflow-hidden bg-[--color-green] border-1 border-gray box-sizing-border-box shadow-2xl;
  height: calc(100% - 1.5rem);

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
      @apply flex gap-1 lh-1;

      & > span {
        @apply w-6 h-6 inline-flex items-center justify-center font-lg color-[--color-deep-green];
      }
    }

    input {
      @apply flex-1 px-2 rounded-sm border-gray border-solid border-1 text-xs lh-1 bg-[--color-cream] color-[--color-deep-green];
    }
  }

  iframe {
    @apply w-full h-full;
  }
}
</style>
