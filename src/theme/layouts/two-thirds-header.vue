<!--
  Usage:
  ---
  layout: two-thirds-header
  reverse: false # true puts the narrow column on the left
  ---
  # Header spanning both columns
  ::left::
  Wide column (two thirds)
  ::right::
  Narrow column (one third)
  ::bottom::
  Spans both columns, right under them (at the bottom of the slide in exports)
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
  <div class="slidev-layout two-thirds-header" :class="[props.layoutClass, { reverse: props.reverse }]">
    <div class="two-thirds-header__col-header">
      <slot />
    </div>
    <div class="two-thirds-header__col-left" :class="props.class">
      <slot name="left" />
    </div>
    <div class="two-thirds-header__col-right" :class="props.class">
      <slot name="right" />
    </div>
    <div class="two-thirds-header__col-footer" :class="props.class">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style>
.slidev-layout.two-thirds-header {
  @apply grid grid-rows-[auto_auto_1fr] w-full h-full gap-4;
  grid-template-columns: 2fr 1fr;

  &.reverse {
    grid-template-columns: 1fr 2fr;
  }

  .two-thirds-header__col-header {
    @apply flex flex-col gap-4;
    grid-area: 1 / 1 / 2 / 3;
  }
  .two-thirds-header__col-left {
    @apply flex flex-col gap-4 min-w-0;
    grid-area: 2 / 1 / 3 / 2;
  }
  .two-thirds-header__col-right {
    @apply flex flex-col gap-4 min-w-0;
    grid-area: 2 / 2 / 3 / 3;
  }
  .two-thirds-header__col-footer {
    align-self: start;
    grid-area: 3 / 1 / 3 / 3;
  }
}

/* Exports: the bottom slot sits at the bottom of the slide (see styles/layout.css) */
html.slides-export .slidev-layout.two-thirds-header {
  @apply grid-rows-[auto_1fr_auto];

  .two-thirds-header__col-footer {
    align-self: end;
  }
}
</style>
