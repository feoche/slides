<script setup lang="ts">
import { computed } from "vue";
import { useNav } from "@slidev/client"

const { currentPage, total } = useNav()

const progressWidth = computed(() => {
  if (total.value <= 1) return "0%";
  return `${((currentPage.value - 1) / (total.value - 1)) * 100}%`;
});
</script>

<style>
.progress {
  @apply h-0 bg-inherit bg-clip-content box-content transition-opacity transition-padding transition-height;
}

.progress__container {
  @apply absolute bottom-0 right-0 left-0 h-.5;
}

.progress__bar {
  @apply h-full rounded bg-[--color-deep-green] dark:bg-[--color-cream] transition-width;
}
</style>

<template>
  <div
      class="progress"
  >
    <div class="progress__container">
      <div
          class="progress__bar"
          :style="{ width: progressWidth }"
      ></div>
    </div>
  </div>
</template>