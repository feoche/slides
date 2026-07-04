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
  class?: string;
}>();

const style = computed(() =>
  handleBackground(props.src, false, props.backgroundSize ?? "cover"),
);
</script>

<template>
  <div class="media-right" :class="{ 'media-right--window': window }">
    <div class="slidev-layout default" :class="props.class">
      <slot />
    </div>
    <Window
      v-if="window"
      :src="src"
      :scale="scale"
      :object-fit="objectFit"
      :type="type"
      :title="windowTitle"
    />
    <div v-else class="media-right__image" :style="style" />
  </div>
</template>

<style>
.media-right {
  @apply w-full grid grid-cols-2;
  height: calc(100% - 2.5rem);

  &__image {
    @apply w-full h-full;
  }
}
.media-right:not(.media-right--window) {
  @apply auto-rows-fr;
}
.media-right--window {
  width: calc(100% - 2.5rem);
}
.media-right--window .window,
.media-right--window .mobile {
  height: calc(100% - 2.5rem);
  margin: 2.5rem auto;
}
</style>
