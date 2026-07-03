<script setup lang="ts">
import { computed } from 'vue'
import { handleBackground } from '../layoutHelper'

const props = defineProps({
  image: {
    type: String,
  },
  class: {
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
  <div class="image-left">
    <div class="image-left__image" :style="style" />
    <div class="slidev-layout default" :class="props.class">
      <slot />
    </div>
  </div>
</template>

<style>
.image-left {
  @apply w-full grid grid-cols-2 auto-rows-fr;
  height: calc(100% - 2.5rem);

  &__image {
    @apply w-full h-full;
  }
}
</style>