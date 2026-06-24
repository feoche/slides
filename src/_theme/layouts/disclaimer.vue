<template>
  <div class="slidev-layout disclaimer">
    <slot/>
  </div>
</template>

<style>
.slidev-layout.disclaimer {
  @apply bg-black text-white flex flex-col h-full gap-4 p-6;

  h2 {
    @apply text-red-500 uppercase text-center;
  }

  p {
    @apply text-[--color-cream] text-6 lh-7 m-0;
  }
}
</style>