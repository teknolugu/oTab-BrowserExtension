<template>
  <textarea
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @input="$emit('input', $event.target.value)"
    :placeholder="placeholder"
    :value="value"
    :style="{ maxWidth, width, minWidth, height, maxHeight, minHeight }"
    class="focus:outline-none p-2"
    :class="['input--' + inputStyle]"
  >
  </textarea>
</template>
<script>
import '@/assets/css/input-style.css';

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
