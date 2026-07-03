<script setup lang="ts">
defineProps<{
  image: string;
  objectFit?: string;
  type?: "desktop" | "mobile";
}>();
</script>

<template>
  <div class="slidev-layout image-window default">
    <slot />
    <Window
      :src="image"
      :object-fit="objectFit"
      :title="$frontmatter.iframeTitle"
      :type="type"
    />
  </div>
</template>

<style>
.image-window {
  @apply h-full;
  width: calc(100% - 2.5rem);
}
</style>
