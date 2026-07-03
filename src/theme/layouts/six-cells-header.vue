<!--
  Usage:
  ---
  layout: six-cells-header
  ---
  # Header spanning the grid
  ::top-left::
  #### Top left
  ::top-center::
  #### Top center
  ::top-right::
  #### Top right
  ::bottom-left::
  #### Bottom left
  ::bottom-center::
  #### Bottom center
  ::bottom-right::
  #### Bottom right
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
  <div class="slidev-layout six-cells-header" :class="layoutClass">
    <div class="six-cells-header__col-header">
      <slot />
    </div>
    <div class="six-cells-header__cells">
      <div class="six-cells-header__cell-top-left" :class="props.class">
        <slot name="top-left" />
      </div>
      <div class="six-cells-header__cell-top-center" :class="props.class">
        <slot name="top-center" />
      </div>
      <div class="six-cells-header__cell-top-right" :class="props.class">
        <slot name="top-right" />
      </div>
      <div class="six-cells-header__cell-bottom-left" :class="props.class">
        <slot name="bottom-left" />
      </div>
      <div class="six-cells-header__cell-bottom-center" :class="props.class">
        <slot name="bottom-center" />
      </div>
      <div class="six-cells-header__cell-bottom-right" :class="props.class">
        <slot name="bottom-right" />
      </div>
    </div>
  </div>
</template>

<style>
.slidev-layout.six-cells-header {
  @apply grid grid-rows-[auto_1fr] w-full h-full gap-4;

  .six-cells-header__col-header {
    @apply flex flex-col gap-4;
  }

  .six-cells-header__cells {
    @apply grid gap-4;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  .six-cells-header__cells > div {
    @apply flex flex-col gap-2;
  }

  .six-cells-header__cell-top-left {
    grid-area: 1 / 1 / 2 / 2;
  }

  .six-cells-header__cell-top-center {
    grid-area: 1 / 2 / 2 / 3;
  }

  .six-cells-header__cell-top-right {
    grid-area: 1 / 3 / 2 / 4;
  }

  .six-cells-header__cell-bottom-left {
    grid-area: 2 / 1 / 3 / 2;
  }

  .six-cells-header__cell-bottom-center {
    grid-area: 2 / 2 / 3 / 3;
  }

  .six-cells-header__cell-bottom-right {
    grid-area: 2 / 3 / 3 / 4;
  }
}
</style>
