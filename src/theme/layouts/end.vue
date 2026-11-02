<script setup lang="ts">
import { computed } from 'vue'
import { handleBackground } from '../layoutHelper'

const props = defineProps({
  image: {
    type: String,
  },
  backgroundSize: {
    type: String,
    default: 'cover',
  },
})

const style = computed(() => handleBackground(props.image, false, props.backgroundSize))
</script>

<template>
  <div class="slidev-layout end">
    <slot/>
    <div class="bento-grid">
      <div class="bento-item end__main">
        <div class="end__image"
             :style="style"
             aria-hidden="true"/>
        <slot name="main"></slot>
      </div>
      <div class="bento-item end__feedback">
        <slot name="feedback"></slot>
      </div>
      <div class="bento-item end__qr-code">
        <slot name="qr-code"></slot>
      </div>
    </div>
  </div>
</template>

<style>
.slidev-layout.end {
  @apply flex flex-col gap-8;
  @apply p-8;

  .bento-grid {
    @apply grid grid-cols-5 grid-rows-3 gap-8 h-full;
  }

  .bento-item {
    @apply bg-[--color-deep-green] p-4 rounded-lg;
  }

  .end__main {
    @apply flex flex-col gap-10 py-8;
    grid-column: 1 / span 3;
    grid-row: 1 / span 3;

    .end__image {
      @apply w-40 aspect-ratio-1/1 rounded-full mx-auto;
      box-shadow: 0 0 0 .5rem var(--color-green);
      background-size: 110%;
    }

    ul {
      @apply list-none flex place-items-start gap-4 mx-auto;

      li {
        @apply m-0 text-center;
      }
    }

    h5, a {
      @apply text-4xl;
    }

    a {
      @apply mx-auto text-[--color-cream];
      letter-spacing: 1px;
    }
  }

  .end__feedback {
    grid-column: 4 / span 2;
    grid-row: 1;
  }

  .end__qr-code {
    @apply flex flex-col gap-2;
    grid-column: 4 / span 2;
    grid-row: 2 / span 2;

    /* `<MediaEl src="qr:…"/>` (or an image) fills the space under the label */
    .media-el {
      @apply flex-1 min-h-0;
    }
  }
}
</style>
