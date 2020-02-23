<template>
  <div class="inline-block input-ui relative" :class="{ small, large, block, error, ['input-ui--' + inputStyle]: true }">
    <div class="flex items-center h-full">
      <unicon class="mr-2" @click="$emit('click:prepend')" :name="icon" v-if="!!icon" :class="[iconClass]"></unicon>
      <input
        v-autofocus="autofocus"
        @input="$emit('input', $event.target.value)"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        :type="type"
        style="z-index: 0; font-weight: inherit;"
        :value="value"
        class="flex-grow focus:outline-none"
        v-bind="$attrs"
        :style="{ width }"
      />
      <unicon :name="appendIcon" class="append-icon" @click="$emit('click:append')" v-if="!!appendIcon || type === 'password'"></unicon>
    </div>
  </div>
</template>
<script>
import { validationMixin } from 'vuelidate';
import '@/assets/scss/components/_input.scss';

const booleanProps = {
  type: Boolean,
  default: false,
};

export default {
  inheritAttrs: false,
  mixins: [validationMixin],
  props: {
    icon: {
      type: String,
      default: '',
    },
    appendIcon: {
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
    small: booleanProps,
    large: booleanProps,
    autofocus: booleanProps,
    block: booleanProps,
    error: booleanProps,
    type: {
      type: String,
      default: 'text',
    },
    validation: {
      type: [String, Array],
      default: '',
    },
    width: {
      type: [String, Number],
      default: '200px',
    },
    iconClass: String,
  },
};
</script>
