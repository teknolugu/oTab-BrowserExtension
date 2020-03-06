<template>
  <unicon
    name="check"
    class="checkbox rounded-full border border-blue-500 hover:border-2 cursor-pointer inline-block fill-current text-primary"
    :class="{ checked: value }"
    @click.native="emitevent"
    height="20"
    width="20"
  ></unicon>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clickHandler() {
      this.$emit('input', true);
    },
    emitevent() {
      this.$emit('input', !this.value);
      this.$emit('change', !this.value);
    },
  },
};
</script>
<style lang="scss">
@keyframes checked {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}
.checkbox {
  transition: background-color 0.1s ease;
  overflow: hidden;
  svg {
    visibility: hidden;
  }
  &:hover svg {
    visibility: visible;
    animation: checked 0.2s ease;
  }
  &.checked {
    background-color: rgba(66, 153, 225, 0.2);
    svg {
      visibility: visible;
      animation: checked 0.2s ease;
    }
  }
}
</style>
