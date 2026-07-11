<script setup lang="ts">
import { computed } from "vue";
import {
  detectMediaKind,
  toYouTubeEmbed,
  resolveAssetUrl,
  type MediaKind,
} from "../layoutHelper";

const props = defineProps<{
  src: string;
  objectFit?: string;
  kind?: MediaKind;
}>();

const kind = computed<MediaKind>(() => props.kind ?? detectMediaKind(props.src));
const resolved = computed(() => resolveAssetUrl(props.src));
const embedSrc = computed(() =>
  kind.value === "youtube" ? toYouTubeEmbed(props.src) : props.src,
);
const fitStyle = computed(() => ({ objectFit: props.objectFit || "contain" }));
</script>

<template>
  <video
    v-if="kind === 'video'"
    class="media-el"
    :src="resolved"
    :style="fitStyle"
    controls
    playsinline
  />
  <iframe
    v-else-if="kind === 'youtube'"
    class="media-el"
    :src="embedSrc"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  />
  <iframe v-else-if="kind === 'iframe'" class="media-el" :src="src" />
  <img v-else class="media-el" :src="resolved" :style="fitStyle" />
</template>

<style>
.media-el {
  @apply w-full h-full;
}
</style>
