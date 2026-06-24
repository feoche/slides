<template>
  <div class="slidev-layout center">
    <slot />
  </div>
</template>
<style>
.slidev-layout.center {
  @apply h-full flex flex-col gap-4 place-content-center place-items-center text-center;
}
</style>
