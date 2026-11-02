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
  <div class="slidev-layout two-columns" :class="props.layoutClass">
    <div class="two-columns__col-left" :class="props.class">
      <slot/>
      <slot name="left"/>
    </div>
    <div class="two-columns__col-right" :class="props.class">
      <slot name="right"/>
    </div>
  </div>
</template>

<style>
.slidev-layout.two-columns {
  @apply w-full h-full grid grid-cols-2 gap-8;

  .two-columns__col-left {
    @apply flex flex-col gap-4;
  }

  .two-columns__col-right {
    @apply flex flex-col gap-4;
  }
}
</style>