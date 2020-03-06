<template>
  <div
    class="card-ui overflow-hidden "
    :style="{ height, minHeight, width, minWidth }"
    :class="{ 'hover:shadow-lg': hover, border: outline, disabled: disabled }"
    @click="$emit('click')"
    style="min-width: 150px"
  >
    <div class="flex items-center" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    height: String,
    minHeight: String,
    minWidth: {
      type: String,
      default: '150px',
    },
    width: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    hover: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style>
.card-ui {
  transition-timing-function: ease;
  @apply transition duration-200 rounded-lg text-default text-sm bg-card px-4 py-3;
}
.card-ui.disabled {
  pointer-events: none;
  @apply text-default-soft;
  box-shadow: none !important;
}
</style>
