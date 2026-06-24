<template>
  <div class="slidev-layout full">
    <slot class="w-full h-full" />
  </div>
</template>
<style>
.slidev-layout.full {
  @apply w-full h-full p-0 flex flex-col gap-4;
}
</style>