<script setup lang="ts">
import { computed } from "vue";
import { handleBackground, detectMediaKind } from "../layoutHelper";

const props = defineProps<{
  media?: string;
  window?: boolean;
  type?: "desktop" | "mobile";
  scale?: number;
  objectFit?: string;
  backgroundSize?: string;
  windowTitle?: string;
  class?: string;
  url?: string;
}>();

const style = computed(() =>
  handleBackground(props.media, false, props.backgroundSize ?? "cover"),
);

const isImage = computed(() => detectMediaKind(props.media) === "image");
</script>

<template>
  <div class="media-left" :class="{ 'media-left--window': window }">
    <div class="media-left__media-container">
      <Window
        v-if="window"
        :src="media"
        :scale="scale"
        :object-fit="objectFit"
        :type="type"
        :title="windowTitle"
        :url="url"
      />
      <div v-else-if="isImage" class="media-left__image" :style="style" />
      <Media v-else :src="media" :object-fit="objectFit" />
    </div>
    <div class="slidev-layout default" :class="props.class">
      <slot />
    </div>
  </div>
</template>

<style>
.media-left {
  @apply w-full flex;
  height: calc(100% - var(--footer-height));

  &__image {
    @apply w-full h-full;
  }

  &__media-container {
    padding: var(--media-frame-inset) 1rem 0 3rem;
    min-width: 375px;
  }

  .slidev-layout {
    @apply flex-1;
  }
}
</style>
