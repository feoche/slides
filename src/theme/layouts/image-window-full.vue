<script setup lang="ts">
defineProps<{
  image: string;
  objectFit?: string;
}>();
</script>

<template>
  <div class="image-window-full">
    <DesktopWindow
      :src="image"
      :object-fit="objectFit"
      :title="$frontmatter.iframeTitle"
    />
  </div>
</template>

<style>
.image-window-full {
  display: grid;
  place-items: center;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>
