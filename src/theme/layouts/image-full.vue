<script setup lang="ts">
import {computed} from 'vue'
import {handleBackground} from '../layoutHelper'

const props = defineProps({
  image: {
    type: String,
  },
  backgroundSize: {
    type: String,
    default: 'contain',
  },
})

const style = computed(() => handleBackground(props.image, false, props.backgroundSize))
</script>

<template>
  <div class="slidev-layout image-full default" :style="style">
    <slot/>
  </div>
</template>

<style>
.slidev-layout.image-full {
  height: calc(100% - 2.5rem);
}
</style>