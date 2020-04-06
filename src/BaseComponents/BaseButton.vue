<template>
  <button
    class="text-base button-ui"
    :disabled="disabled"
    :class="['btn-' + type, 'btn-' + size, loading ? 'loading' : '', 'btn-' + color, block ? 'w-full' : '']"
    :style="{ height, backgroundColor }"
    @click="$emit('click')"
    :type="buttonType"
  >
    <div class="lds-ellipsis" v-if="loading">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <slot v-else></slot>
  </button>
</template>
<script>
import '~/assets/scss/components/_button.scss';
import '~/assets/css/spinner.css';

export default {
  props: {
    height: String,
    backgroundColor: String,
    color: {
      type: String,
      default: 'primary',
      validator(value) {
        return ['primary', 'warning', 'danger', 'neutral'].indexOf(value) !== -1;
      },
    },
    size: {
      type: String,
      default: 'regular',
      validator(value) {
        return ['small', 'regular', 'large'].indexOf(value) !== -1;
      },
    },
    buttonType: String,
    type: {
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
    loading: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
