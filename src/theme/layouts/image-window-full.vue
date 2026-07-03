<script setup lang="ts">
defineProps<{
  image: string;
  objectFit?: string;
  type?: "desktop" | "mobile";
}>();
</script>

<template>
  <div class="image-window-full">
    <Window
      :src="image"
      :object-fit="objectFit"
      :title="$frontmatter.iframeTitle"
      :type="type"
    />
  </div>
</template>

<style>
.image-window-full {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>
