<!--
  Usage:
  ---
  layout: screenshot
  layoutClass: laptop   # or: mobile
  screenshot: /my-screenshot.png
  ---
  ::left::
  Context on the left
  ::right::
  Notes on the right
-->

<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
  },
  layoutClass: {
    type: String,
    default: "laptop",
  },
  screenshot: {
    type: String,
    default: "",
  },
})
</script>

<template>
  <div class="slidev-layout screenshot" :class="layoutClass">
    <div class="screenshot__cols">
      <div class="screenshot__col-left" :class="props.class">
        <slot name="left" />
      </div>
      <div class="screenshot__col-center">
        <div class="screenshot__frame">
          <img :src="screenshot" alt="screenshot" />
        </div>
      </div>
      <div class="screenshot__col-right" :class="props.class">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style>
.slidev-layout.screenshot {
  @apply w-full h-full flex items-center;

  .screenshot__cols {
    @apply grid gap-10 w-full items-center;
    grid-template-columns: 1fr 2fr 1fr;
  }

  .screenshot__col-left,
  .screenshot__col-right {
    @apply flex flex-col justify-center gap-4;
  }

  .screenshot__col-center {
    @apply flex items-center justify-center relative;
  }

  &.laptop .screenshot__frame {
    > img {
      object-fit: cover;
      max-width: 400px;
    }

    &::after {
      content: "";
      background: url("/macbook-air-frame.png") no-repeat;
      background-size: 100%;
      position: absolute;
      height: calc(100% * 2.3);
      width: calc(100% * 1.2);
      left: -40px;
      top: -20px;
    }
  }

  &.mobile .screenshot__frame {
    > img {
      border-radius: 37px;
      max-height: 475px;
      object-fit: cover;
    }

    &::after {
      content: "";
      background: url("/iphone-15-pro-max-frame.png") no-repeat;
      background-size: 56%;
      position: absolute;
      height: calc(100% * 1.1);
      width: 100%;
      left: 93px;
      top: -5px;
    }
  }
}
</style>
