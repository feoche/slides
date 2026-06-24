<template>
  <div class="slidev-layout fact">
    <slot/>
  </div>
</template>

<style>
.slidev-layout.fact {
  @apply text-center flex flex-col gap-4 h-full place-content-center;

  h2 {
    @apply text-8xl fw-700;
  }
}
</style>