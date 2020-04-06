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
import '~/assets/scss/components/_card.scss';

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
