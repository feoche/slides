<script setup lang="ts">
defineProps<{
  url: string;
  scale?: number;
}>();
</script>

<template>
  <div class="iframe-left">
    <DesktopWindow
      :src="url"
      :scale="scale"
      :title="$frontmatter.iframeTitle"
    />
    <div class="slidev-layout default" v-bind="$attrs">
      <slot />
    </div>
  </div>
</template>

<style>
.iframe-left {
  @apply w-full grid grid-cols-2;
  height: calc(100% - 2.5rem);
}
</style>
