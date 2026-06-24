<script setup lang="ts">
import {computed} from 'vue'
import {handleBackground} from '../layoutHelper'

const props = defineProps({
  image: {
    type: String,
  },
  backgroundSize: {
    type: String,
    default: 'cover',
  },
})

const style = computed(() => handleBackground('transparent', false, props.backgroundSize))
</script>

<template>
  <div class="slidev-layout image default">
    <slot/>
    <img :src="image" :style="style" />
  </div>
</template>

<style>
.slidev-layout.image {
  @apply h-full flex flex-col gap-8;

  img {
    @apply h-full w-auto object-contain;
  }
}
</style>