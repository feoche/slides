<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps<{
  url: string
  scale?: number
}>()

const scaleInvertPercent = computed(() => `${(1 / (props.scale || 1)) * 100}%`)
</script>

<template>
  <div class="iframe-right">
    <div class="slidev-layout default" v-bind="$attrs">
      <slot/>
    </div>
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
.iframe-right {
  @apply grid grid-cols-2;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>