<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  url: string
  scale?: number
}>()

const scaleInvertPercent = computed(() => `${(1 / (props.scale || 1)) * 100}%`)
</script>

<template>
  <div class="slidev-layout iframe default">
    <slot/>
    <div class="iframe-container"
         :style="{ width: scaleInvertPercent }">
      <span class="iframe-header">
        <span class="iframe-title">
          {{ $frontmatter.iframeTitle }}
        </span>
        <span class="iframe-controls">
          <span>−</span>
          <span class="text-sm">⧉</span>
          <span>×</span>
        </span>
      </span>
      <span class="iframe-subheader">
        <span class="iframe-subcontrols">
          <span>←</span>
          <span>→</span>
          <span>⟳</span>
        </span>
        <input type="search" class="iframe-url" :value="url">
      </span>
      <iframe
          id="frame"
          :src="url"
          :style="scale ? { transform: `scale(${scale})`, transformOrigin: 'top left' } : {}"
      />
    </div>
  </div>
</template>

<style>
.iframe {
  @apply h-full;
  width: calc(100% - 2.5rem);
}

.iframe-container {
  @apply relative w-full h-full m-4 mb-0 rounded-2 overflow-hidden bg-[--color-green] border-1 border-gray box-sizing-border-box shadow-2xl;
  height: calc(100% - 1.5rem);

  .iframe-header {
    @apply flex bg-[--color-deep-green] color-[--color-cream] py-1.5 px-2 rounded-t-md place-content-between place-items-center overflow-hidden;
  }

  .iframe-title {
    @apply flex font-bold mx-1 color-[--color-cream];
  }

  .iframe-controls {
    @apply flex gap-1;

    & > span {
      @apply w-5 h-5 inline-flex items-center justify-center rounded-full bg-gray-200 font-sm opacity-50 color-[--color-deep-green];
    }
  }

  .iframe-subheader {
    @apply flex bg-gray-200 color-gray gap-2 p-1;

    .iframe-subcontrols {
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