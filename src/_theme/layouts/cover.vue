<script setup lang="ts">
import {formatDate} from '../layoutHelper'
</script>

<template>
  <div class="slidev-layout cover">
    <div class="cover__content">
      <slot/>
    </div>
    <div class="cover__footer">
      <p class="cover__date">
        {{ formatDate($frontmatter.date) }}
      </p>
      <div class="cover__qr-code">
        <slot name="qr-code"></slot>
      </div>
    </div>
  </div>
</template>

<style>
.slidev-layout.cover {
  @apply p-10;

  .cover__content {
    @apply my-auto flex flex-col w-full gap-4 pb-10;

    h3 {
      @apply text-4xl;
    }
  }

  .cover__footer {
    @apply absolute bottom-0 left-0 right-0 ml-10 mr-2 my-2 flex place-content-between place-items-end;
  }

  .cover__date {
    @apply ml-auto mr-4 pb-3 text-xl;
  }

  .cover__qr-code {
    @apply flex-grow flex place-content-end;

    &:empty {
      display: none;
    }
  }
}
</style>
