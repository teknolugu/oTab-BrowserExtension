<template>
  <div class="list-ui" :class="{ small, active, block }" @click="$emit('click')">
    <unicon class="list-ui__icon" :name="icon" v-if="!!icon"></unicon>
    <slot name="prefix"></slot>
    <div class="list-ui__content flex-grow">
      <slot></slot>
    </div>
    <slot name="suffix"></slot>
  </div>
</template>
<script>
import '~/assets/scss/components/_list.scss';

export default {
  props: {
    icon: String,
    small: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    block: Boolean,
  },
};
</script>
