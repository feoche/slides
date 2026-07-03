<!--
  Usage:
  ---
  layout: three-cols
  ---
  ::left::
  Left column
  ::center::
  Center column (wider)
  ::right::
  Right column
  ::bottom::
  Spans all columns, aligned to the bottom
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
  <div class="slidev-layout three-cols" :class="layoutClass">
    <div class="three-cols__cols">
      <div class="three-cols__col-left" :class="props.class">
        <slot name="left" />
      </div>
      <div class="three-cols__col-center" :class="props.class">
        <slot name="center" />
      </div>
      <div class="three-cols__col-right" :class="props.class">
        <slot name="right" />
      </div>
    </div>
    <div class="three-cols__col-bottom" :class="props.class">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style>
.slidev-layout.three-cols {
  @apply w-full h-full grid grid-rows-[1fr_auto] gap-4;

  .three-cols__cols {
    @apply grid gap-8;
    grid-template-columns: 1fr 2fr 1fr;
  }

  .three-cols__col-left,
  .three-cols__col-center,
  .three-cols__col-right {
    @apply flex flex-col gap-4;
  }

  .three-cols__col-bottom {
    align-self: end;
  }

  &.centered .three-cols__cols {
    @apply items-center;
  }

  &.centered .three-cols__col-left,
  &.centered .three-cols__col-center,
  &.centered .three-cols__col-right {
    @apply items-center justify-center text-center;
  }
}
</style>
