<template>
  <div class="slidev-layout quote">
    <div class="quote__container">
      <slot />
    </div>
  </div>
</template>
<style>
.slidev-layout.quote {
  @apply grid h-full;

  .quote__container {
    @apply flex flex-col gap-4 my-auto mx-auto;

    blockquote {
      @apply py-4 px-8 bg-gray-200 border-l-4 border-[--color-green] text-[--color-green];

      .dark & {
        @apply border-[--color-cream] bg-[--color-green] text-[--color-cream];
      }

      p {
        @apply text-[--color-green];

        .dark & {
          @apply text-[--color-cream];
        }
      }
    }
  }
}
</style>