<template>
  <unicon
    v-on="$listeners"
    :name="icon"
    class="cursor-pointer btn-icon fill-current"
    :class="{ ['btn-icon--' + color]: true, square: square, small: small, disabled: disabled }"
    :width="size"
    :icon-style="iconStyle"
    :height="size"
  ></unicon>
</template>
<script>
import '@/assets/scss/components/_button-icon.scss';

export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    square: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [String, Number],
      default: '20',
    },
    color: {
      type: String,
      default: 'gray',
      validator(value) {
        return ['gray', 'blue', 'red', 'green'].indexOf(value) !== -1;
      },
    },
    small: {
      type: Boolean,
      default: false,
    },
    iconStyle: String,
  },
  computed: {
    buttonColor() {
      return buttonColors[this.color];
    },
  },
};
</script>
