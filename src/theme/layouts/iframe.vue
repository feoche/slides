<script setup lang="ts">
defineProps<{
  url: string;
  scale?: number;
  type?: "desktop" | "mobile";
}>();
</script>

<template>
  <div class="slidev-layout iframe default">
    <slot />
    <Window
      :src="url"
      :scale="scale"
      :title="$frontmatter.iframeTitle"
      :type="type"
    />
  </div>
</template>

<style>
.iframe {
  @apply h-full;
  width: calc(100% - 2.5rem);
}
</style>
