<script setup lang="ts">
import { computed } from "vue";
import { handleBackground } from "../layoutHelper";

const props = defineProps<{
  src?: string;
  window?: boolean;
  type?: "desktop" | "mobile";
  scale?: number;
  objectFit?: string;
  backgroundSize?: string;
  windowTitle?: string;
}>();

const style = computed(() =>
  handleBackground(props.src, false, props.backgroundSize ?? "contain"),
);
</script>

<template>
  <div
    v-if="window"
    class="slidev-layout media-full media-full--window default"
  >
    <Window
      :src="src"
      :scale="scale"
      :object-fit="objectFit"
      :type="type"
      :title="windowTitle"
    />
  </div>
  <div v-else class="slidev-layout media-full default" :style="style">
    <slot />
  </div>
</template>

<style>
.slidev-layout.media-full {
  height: calc(100% - 2.5rem);
}
.slidev-layout.media-full--window {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 2.5rem);
}
</style>
