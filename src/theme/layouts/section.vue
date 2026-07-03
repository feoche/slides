<template>
  <div class="slidev-layout section">
    <slot/>
  </div>
</template>
<style>
.slidev-layout.section {
  @apply flex flex-col gap-4 h-full place-content-center;

  h1 {
    @apply text-6xl fw-500 m-0;
  }
}
</style>