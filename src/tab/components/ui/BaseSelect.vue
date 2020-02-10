<template>
  <v-popover @show="showPopover = true" @hide="showPopover = false" offset="6">
    <div :class="[selectStyle, small ? 'px-2 py-1 text-sm' : 'p-2 text-base']" class="select inline-block hover:bg-gray-200 flex items-center cursor-pointer" tabindex="0">
      <unicon name="filter" class="mr-2" :height="iconSize" :width="iconSize"></unicon>
      <p class="select-none">{{ value }}</p>
      <unicon name="angle-down" :class="{ 'rotate-icon-180': showPopover, [small ? 'ml-3' : 'ml-5']: true }"></unicon>
    </div>

    <template slot="popover">
      <div class="shadow-xl border px-2 py-3 rounded bg-white text-base" style="min-width: 160px">
        <template v-if="list.length !== 0">
          <p
            v-for="(item, index) in list"
            :class="{ 'text-blue-500': item === value, [listClass]: true }"
            :key="index"
            v-close-popover
            class="py-1 px-2 rounded cursor-pointer hover:bg-gray-200 transition-bg"
            @click="$emit('input', item)"
          >
            {{ item }}
          </p>
        </template>
        <p v-else class="text-sm text-gray-600 text-center">No data</p>
      </div>
    </template>
  </v-popover>
</template>
<script>
const selectClasses = {
  default: 'border rounded',
};

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    inputStyle: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'background'].indexOf(value) !== -1;
      },
    },
    small: {
      type: Boolean,
      default: false,
    },
    value: [String, Number],
    listClass: String,
  },
  data: () => ({
    showPopover: false,
  }),
  computed: {
    selectStyle() {
      return selectClasses[this.inputStyle];
    },
    iconSize() {
      return this.small ? '20' : '22';
    },
  },
};
</script>
