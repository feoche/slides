<script setup lang="ts">
defineProps<{
  image: string;
  objectFit?: string;
}>();
</script>

<template>
  <div class="image-window-right">
    <div class="slidev-layout default" v-bind="$attrs">
      <slot />
    </div>
    <Window
      :src="image"
      :object-fit="objectFit"
      :title="$frontmatter.iframeTitle"
    />
  </div>
</template>

<style>
.image-window-right {
  @apply grid grid-cols-2;
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>
