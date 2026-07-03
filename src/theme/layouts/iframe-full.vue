<script setup lang="ts">
defineProps<{
  url: string;
  scale?: number;
}>();
</script>

<template>
  <div class="iframe">
    <Window :src="url" :scale="scale" :title="$frontmatter.iframeTitle" />
  </div>
</template>

<style>
.iframe {
  @apply h-full;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>
