<script setup lang="ts">

const props = defineProps({
  class: {
    type: String,
  },
  layoutClass: {
    type: String,
  }
})
</script>

<template>
  <div class="slidev-layout two-cols-header" :class="layoutClass">
    <div class="two-cols-header__col-header">
      <slot />
    </div>
    <div class="two-cols-header__col-left" :class="props.class">
      <slot name="left" />
    </div>
    <div class="two-cols-header__col-right" :class="props.class">
      <slot name="right" />
    </div>
    <div class="two-cols-header__col-footer" :class="props.class">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style>
.two-cols-header {
  @apply grid grid-cols-2 grid-rows-[auto_auto_1fr] w-full h-full gap-4;

  .two-cols-header__col-header {
    @apply flex flex-col gap-4;
    grid-area: 1 / 1 / 2 / 3;
  }
  .two-cols-header__col-left {
    @apply flex flex-col gap-4;
    grid-area: 2 / 1 / 3 / 2;
  }
  .two-cols-header__col-right {
    @apply flex flex-col gap-4;
    grid-area: 2 / 2 / 3 / 3;
  }
  .two-cols-header__col-footer {
    align-self: start;
    grid-area: 3 / 1 / 3 / 3;
  }
}

/* Exports: the bottom slot sits at the bottom of the slide (see styles/layout.css) */
html.slides-export .slidev-layout.two-cols-header {
  @apply grid-rows-[auto_1fr_auto];

  .two-cols-header__col-footer {
    align-self: end;
  }
}
</style>