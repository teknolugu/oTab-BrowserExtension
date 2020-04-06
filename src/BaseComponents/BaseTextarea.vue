<template>
  <textarea
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @input="$emit('input', $event.target.value)"
    :placeholder="placeholder"
    :value="value"
    v-autofocus="autofocus"
    :style="{ maxWidth, width, minWidth, height, maxHeight, minHeight }"
    class="focus:outline-none input-ui p-2"
    :class="['input-ui--' + inputStyle]"
  >
  </textarea>
</template>
<script>
import '~/assets/scss/components/_input.scss';

export default {
  props: {
    value: String,
    inputStyle: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'background', 'transparent', 'outline'].indexOf(value) !== -1;
      },
    },
    autofocus: {
      type: Boolean,
      default: true,
    },
    placeholder: String,
    maxWidth: [Number, String],
    width: [Number, String],
    minWidth: [Number, String],
    height: [Number, String],
    minHeight: [Number, String],
    maxHeight: [Number, String],
  },
};
</script>
