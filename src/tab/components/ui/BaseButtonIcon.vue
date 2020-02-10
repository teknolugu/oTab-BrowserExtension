<template>
  <unicon
    v-on="$listeners"
    :name="icon"
    class="cursor-pointer transition-bg fill-current"
    :class="[buttonColor, buttonPadding, square ? 'rounded' : 'rounded-full']"
    :width="size"
    :icon-style="iconStyle"
    :height="size"
  ></unicon>
</template>
<script>
const buttonColors = {
  transparent: '',
  grey: 'hover:bg-gray-200',
  blue: 'hover:bg-blue-200',
  red: 'hover:bg-red-200',
  green: 'hover:bg-green-200',
};

export default {
  props: {
    icon: {
      type: String,
      required: true,
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
      default: 'grey',
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
    buttonPadding() {
      return this.small ? 'p-1' : 'p-2';
    },
  },
};
</script>
