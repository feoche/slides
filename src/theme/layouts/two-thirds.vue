<!--
  Usage:
  ---
  layout: two-thirds
  reverse: false # true puts the narrow column on the left
  ---
  Wide column (two thirds)
  ::right::
  Narrow column (one third)
-->

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
  },
  layoutClass: {
    type: String,
  },
  reverse: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="slidev-layout two-thirds" :class="[props.layoutClass, { reverse: props.reverse }]">
    <div class="two-thirds__col-left" :class="props.class">
      <slot/>
      <slot name="left"/>
    </div>
    <div class="two-thirds__col-right" :class="props.class">
      <slot name="right"/>
    </div>
  </div>
</template>

<style>
.slidev-layout.two-thirds {
  @apply w-full h-full grid gap-8;
  grid-template-columns: 2fr 1fr;

  &.reverse {
    grid-template-columns: 1fr 2fr;
  }

  .two-thirds__col-left,
  .two-thirds__col-right {
    @apply flex flex-col gap-4 min-w-0;
  }
}
</style>
