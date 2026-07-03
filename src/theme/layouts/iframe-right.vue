<script setup lang="ts">
defineProps<{
  url: string
  scale?: number
}>()
</script>

<template>
  <div class="iframe-right">
    <div class="slidev-layout default" v-bind="$attrs">
      <slot/>
    </div>
    <Window :src="url" :scale="scale" :title="$frontmatter.iframeTitle" />
  </div>
</template>

<style>
.iframe-right {
  @apply grid grid-cols-2;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>
