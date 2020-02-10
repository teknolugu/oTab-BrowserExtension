<template>
  <unicon
    name="check"
    class="checkbox rounded-full border border-blue-500 hover:border-2 cursor-pointer inline-block fill-current text-blue-500"
    :class="{ 'bg-blue-200 checked': value }"
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
<style>
@keyframes checked {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}

.checkbox svg {
  visibility: hidden;
}
.checkbox:hover svg {
  visibility: visible;
  animation: checked 0.2s ease;
}
.checkbox {
  transition: background-color 0.1s ease;
  overflow: hidden;
}
.checkbox.checked svg {
  visibility: visible;
  animation: checked 0.2s ease;
}
</style>
