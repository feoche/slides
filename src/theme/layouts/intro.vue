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
  <div class="slidev-layout intro">
    <div class="intro__image"
         :style="style"
         aria-hidden="true"/>
    <slot />
  </div>
</template>
<style>
.slidev-layout.intro {
  @apply flex flex-col h-full gap-6;

  .intro__image {
    @apply absolute top-0 right-0 m-8 w-40 aspect-ratio-1/1 rounded-full;
    box-shadow: 0 0 0 .5rem var(--color-deep-green);
    background-size: 110%;
  }

  h2 {
    @apply text-6xl fw-700;

    & + h3 {
      @apply text-4xl mb-2;
    }
  }

  ul {
    @apply gap-5;
  }

  a {
    @apply inline-flex ml-auto px-0.5;
  }
}
</style>