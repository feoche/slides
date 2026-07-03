<script setup lang="ts">
defineProps<{
  image: string
  objectFit?: string
}>()
</script>

<template>
  <div class="image-window-full">
    <Window :src="image" :object-fit="objectFit" :title="$frontmatter.iframeTitle" />
  </div>
</template>

<style>
.image-window-full {
  @apply h-full;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>
