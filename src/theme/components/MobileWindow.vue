<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  src: string;
  title?: string;
  type?: "iframe" | "image";
  scale?: number;
  objectFit?: string;
  url?: string;
}>();

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;

const resolvedType = computed<"iframe" | "image">(
  () => props.type ?? (IMAGE_EXT.test(props.src) ? "image" : "iframe"),
);

const scaleInvertPercent = computed(() => `${(1 / (props.scale || 1)) * 100}%`);
</script>

<template>
  <!-- Fake mobile browser: a phone frame (fixed aspect ratio, sized in CSS)
       wrapping a compact address bar and an iframe or image. -->
  <div class="mobile">
    <div class="mobile-frame">
      <div class="mobile-notch"></div>
      <div class="mobile-screen">
        <div class="mobile-bar">
          <span class="mobile-bar-icon">🔒</span>
          <span class="mobile-url">{{
            resolvedType === "iframe" ? (url ?? src) : title
          }}</span>
          <span class="mobile-bar-icon">⋯</span>
        </div>
        <div
          class="mobile-content"
          :style="
            resolvedType === 'iframe' ? { width: scaleInvertPercent } : {}
          "
        >
          <iframe
            v-if="resolvedType === 'iframe'"
            :src="src"
            :style="
              scale
                ? { transform: `scale(${scale})`, transformOrigin: 'top left' }
                : {}
            "
          />
          <img
            v-else
            :src="src"
            class="mobile-img"
            :style="{ objectFit: objectFit || 'cover' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.mobile {
  @apply flex h-full w-full items-center justify-center;
}

.mobile-frame {
  @apply relative flex flex-col overflow-hidden bg-[--color-deep-green] shadow-2xl;
  aspect-ratio: 10 / 20;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  padding: 0.55rem;
  border-radius: 2.25rem;
  border: 2px solid #0003;

  .mobile-notch {
    @apply absolute top-0 left-1/2 z-10 bg-black;
    width: 32%;
    height: 1.1rem;
    transform: translateX(-50%);
    border-bottom-left-radius: 0.7rem;
    border-bottom-right-radius: 0.7rem;
  }

  .mobile-screen {
    @apply relative flex flex-1 flex-col overflow-hidden bg-[--color-cream];
    border-radius: 1.75rem;
    min-height: 0;
  }

  .mobile-bar {
    @apply flex items-center gap-2 bg-gray-200 color-[--color-deep-green];
    padding: 1.4rem 0.9rem 0.4rem;

    .mobile-bar-icon {
      @apply flex-none text-xs opacity-60;
    }

    .mobile-url {
      @apply flex-1 truncate rounded-full bg-[--color-cream] px-3 py-1 text-center text-xs color-[--color-deep-green];
    }
  }

  .mobile-content {
    @apply relative flex-1;
    min-height: 0;

    iframe,
    .mobile-img {
      @apply h-full w-full;
    }
  }
}
</style>
