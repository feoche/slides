<!--
  Usage:
  ---
  layout: three-cols-header
  ---
  # Header spanning all columns
  ::left::
  Left
  ::center::
  Center
  ::right::
  Right
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
  <div class="slidev-layout three-cols-header" :class="layoutClass">
    <div class="three-cols-header__col-header">
      <slot />
    </div>
    <div class="three-cols-header__col-left" :class="props.class">
      <slot name="left" />
    </div>
    <div class="three-cols-header__col-center" :class="props.class">
      <slot name="center" />
    </div>
    <div class="three-cols-header__col-right" :class="props.class">
      <slot name="right" />
    </div>
    <div class="three-cols-header__col-footer" :class="props.class">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style>
.slidev-layout.three-cols-header {
  @apply grid grid-cols-3 grid-rows-[auto_1fr_auto] w-full h-full gap-4;

  .three-cols-header__col-header {
    @apply flex flex-col gap-4;
    grid-area: 1 / 1 / 2 / 4;
  }

  .three-cols-header__col-left {
    @apply flex flex-col gap-4;
    grid-area: 2 / 1 / 3 / 2;
  }

  .three-cols-header__col-center {
    @apply flex flex-col gap-4;
    grid-area: 2 / 2 / 3 / 3;
  }

  .three-cols-header__col-right {
    @apply flex flex-col gap-4;
    grid-area: 2 / 3 / 3 / 4;
  }

  .three-cols-header__col-footer {
    align-self: end;
    grid-area: 3 / 1 / 4 / 4;
  }
}
</style>
