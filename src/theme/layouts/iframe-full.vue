<script setup lang="ts">
defineProps<{
  url: string;
  scale?: number;
  type?: "desktop" | "mobile";
}>();
</script>

<template>
  <div class="iframe">
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
  width: calc(100% - 2.5rem);
  height: calc(100% - 2.5rem);
}
</style>
