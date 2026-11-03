<!--
  Usage:
  ---
  layout: three-rows
  ---
  ::top::
  Top row
  ::center::
  Center row
  ::bottom::
  Bottom row
-->

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
  },
  layoutClass: {
    type: String,
  },
})
</script>

<template>
  <div class="slidev-layout three-rows" :class="layoutClass">
    <div class="three-rows__row-top" :class="props.class">
      <slot name="top" />
    </div>
    <div class="three-rows__row-center" :class="props.class">
      <slot name="center" />
    </div>
    <div class="three-rows__row-bottom" :class="props.class">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style>
.slidev-layout.three-rows {
  @apply w-full h-full grid grid-rows-3 gap-8;

  .three-rows__row-top,
  .three-rows__row-center,
  .three-rows__row-bottom {
    @apply flex flex-col justify-start gap-2;
  }
}

/* Exports: each row's content vertically centered (see styles/layout.css) */
html.slides-export .slidev-layout.three-rows {
  .three-rows__row-top,
  .three-rows__row-center,
  .three-rows__row-bottom {
    @apply justify-center;
  }
}
</style>
