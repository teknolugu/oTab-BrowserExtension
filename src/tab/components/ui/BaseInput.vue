<template>
  <div class="inline-block input relative" :class="['input--' + inputStyle, inputSize.padding]">
    <div class="flex items-center h-full" style="box-sizing: border-box;">
      <unicon class="mr-2" :name="icon" v-if="!!icon" :class="[iconClass]" :height="inputSize.icon" :width="inputSize.icon"></unicon>
      <input
        v-autofocus="autofocus"
        :style="{ width }"
        @input="$emit('input', $event.target.value)"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        :type="type"
        style="z-index: 0"
        :maxlength="max"
        :value="value"
        class="bg-transparent flex-grow focus:outline-none"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>
<script>
import '@/assets/css/input-style.css';

export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    inputStyle: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'outline', 'background', 'transparent'].indexOf(value) !== -1;
      },
    },
    small: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: 'inherit',
    },
    iconClass: String,
    placeholder: String,
    type: String,
    max: [Number, String],
  },
  computed: {
    inputSize() {
      return this.small
        ? {
            padding: 'p-2',
            icon: '19',
          }
        : {
            padding: 'p-2',
            icon: '22',
          };
    },
  },
};
</script>
