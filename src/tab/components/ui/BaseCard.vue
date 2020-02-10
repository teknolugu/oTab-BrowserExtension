<template>
  <div
    class="max-w-sm rounded card-ui overflow-hidden text-sm bg-white transition-all px-4 py-3"
    :style="{ height, minHeight, width, minWidth }"
    :class="{ 'hover:shadow-lg': hover, border: outline, disabled: disabled }"
    @click="$emit('click')"
    style="min-width: 150px"
  >
    <div class="flex items-center mb-2" v-if="$slots.header">
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
.card-ui.disabled {
  pointer-events: none;
  @apply text-gray-600;
  box-shadow: none !important;
}
</style>
