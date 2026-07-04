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
  <div class="media-left" :class="{ 'media-left--window': window }">
    <Window
      v-if="window"
      :src="src"
      :scale="scale"
      :object-fit="objectFit"
      :type="type"
      :title="windowTitle"
    />
    <div v-else class="media-left__image" :style="style" />
    <div class="slidev-layout default" :class="props.class">
      <slot />
    </div>
  </div>
</template>

<style>
.media-left {
  @apply w-full grid grid-cols-2;
  height: calc(100% - 2.5rem);

  &__image {
    @apply w-full h-full;
  }
}
.media-left:not(.media-left--window) {
  @apply auto-rows-fr;
}
.media-left--window .window {
  @apply my-[2.5rem] mx-auto;
  height: calc(100% - 2.5rem);
}
</style>
