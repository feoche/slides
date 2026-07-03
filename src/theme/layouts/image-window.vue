<script setup lang="ts">
defineProps<{
  image: string
  objectFit?: string
}>()
</script>

<template>
  <div class="slidev-layout image-window default">
    <slot/>
    <Window :src="image" :object-fit="objectFit" :title="$frontmatter.iframeTitle" />
  </div>
</template>

<style>
.image-window {
  @apply h-full;
  width: calc(100% - 2.5rem);
}
</style>
