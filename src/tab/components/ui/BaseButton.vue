<template>
  <button
    class="py-2 px-4 rounded text-sm transition-all"
    :disabled="disabled"
    :class="{ ['button--' + buttonStyle]: true, 'button--disabled': disabled }"
    :style="{ height, backgroundColor }"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>
<script>
import '@/assets/css/button-style.css';

export default {
  props: {
    height: String,
    backgroundColor: String,
    buttonStyle: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'outline', 'text'].indexOf(value) !== -1;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
