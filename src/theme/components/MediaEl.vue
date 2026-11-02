<script setup lang="ts">
import { computed } from "vue";
// imported directly so decks don't need to list the addon in their headmatter
import QRCode from "slidev-addon-qrcode/components/QRCode.vue";
import {
  detectMediaKind,
  toQRCodeData,
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
const qrCodeData = computed(() => toQRCodeData(props.src));
const fitStyle = computed(() => ({ objectFit: props.objectFit || "contain" }));
</script>

<template>
  <div v-if="kind === 'qrcode'" class="media-el media-el--qrcode">
    <!-- QRCode only reads its props once: re-mount it when the data changes -->
    <QRCode
      :key="qrCodeData"
      :data="qrCodeData"
      :width="1000"
      :height="1000"
      type="svg"
      :dotsOptions="{ color: 'currentColor' }"
    />
  </div>
  <video
    v-else-if="kind === 'video'"
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

.media-el--qrcode {
  @apply flex items-center justify-center min-h-0;
  color: var(--slidev-theme-feoche-title-color);

  > div {
    @apply h-full max-w-full aspect-square;
  }

  svg {
    @apply w-full h-full;
    /* no anti-aliasing seams between modules */
    shape-rendering: crispEdges;
  }
}
</style>
