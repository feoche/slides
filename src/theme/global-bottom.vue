<script setup lang="ts">
import {shouldHighlightLayout} from './layoutHelper';
import { computed, watchEffect } from 'vue';
import { useNav } from '@slidev/client';
import Progress from './components/Progress.vue';

// Exports (`slidev export` loads every slide with `?print`, the /export page
// too) get `slides-export` on <html>: layouts spread their content there, but
// keep it at the top of the slide when presenting (see styles/layout.css)
const { isPrintMode } = useNav();
watchEffect(() => document.documentElement.classList.toggle('slides-export', isPrintMode.value));

const background = computed(() => shouldHighlightLayout($slidev.nav.currentLayout)
    ? 'var(--slidev-theme-feoche-highlight-background-color)'
    : 'var(--slidev-theme-feoche-background-color)');
const color = computed(() => shouldHighlightLayout($slidev.nav.currentLayout)
    ? 'var(--slidev-theme-feoche-highlight-text-color)'
    : 'var(--slidev-theme-feoche-text-color)');
</script>

<!-- masquer le pied de page de la mise en page "cover" -->
<template>
  <footer
      v-if="!['cover', 'intro', 'disclaimer', 'end']
            .includes($slidev.nav.currentLayout)"
      :style="{background: `linear-gradient(180deg, transparent 0, ${background} 30%)`,color}"
      class="footer"
  >
    <p class="footer__title"
       v-if="!shouldHighlightLayout($slidev.nav.currentLayout)"
       aria-hidden="true">
      <slot name="conference-title">
        {{ $slidev.configs.author }}&nbsp;&mdash;&nbsp;{{ $slidev.configs.title }}
      </slot>
    </p>
    <p class="footer__page-number">
      <slot name="page-number">
        <span class="sr-only">Page </span>
        <SlideCurrentNo />
      </slot>
    </p>
    <Progress position="bottom"/>
  </footer>
</template>
<style>
.footer {
  @apply absolute bottom-0 left-0 right-0 pb-2 pt-3 px-4 flex place-content-between place-items-end z-1;
}
.footer__page-number {
  @apply ml-auto;
}

</style>