<script setup lang="ts">
defineProps<{
  image: string;
  objectFit?: string;
  type?: "desktop" | "mobile";
}>();
</script>

<template>
  <div class="image-window-left">
    <Window
      :src="image"
      :object-fit="objectFit"
      :title="$frontmatter.iframeTitle"
      :type="type"
    />
    <div class="slidev-layout default" v-bind="$attrs">
      <slot />
    </div>
  </div>
</template>

<style>
.image-window-left {
  @apply w-full grid grid-cols-2;
  height: calc(100% - 2.5rem);

  .window {
    @apply my-[2.5rem] mx-auto;
    height: calc(100% - 2.5rem);
  }
}
</style>
