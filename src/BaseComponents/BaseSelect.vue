<template>
  <v-popover @show="showPopover = true" class="select-ui" :class="{ block }" :placement="placement" @hide="showPopover = false" offset="6">
    <div class="select-ui__wrapper" :class="{ small }">
      <unicon :name="icon" v-if="!!icon" class="mr-2 icon"></unicon>
      <p class="select-none w-11/12 text-overflow">{{ getValueName }}</p>
      <unicon name="angle-down" :class="{ 'rotate-icon-180': showPopover }" class="select-ui__arrow-icon ml-3"></unicon>
    </div>

    <template slot="popover">
      <card-ui class="shadow-xl" style="padding: 10px" min-width="160px">
        <template v-if="list.length !== 0">
          <list-ui v-for="(item, index) in list" small :class="{ 'text-primary': isActiveItem(item), [listClass]: true }" :key="index" v-close-popover @click="emitEvent(item)">
            <p class="text-overflow" style="max-width: 240px">
              {{ typeof item === 'object' ? item[itemKey] : item }}
            </p>
          </list-ui>
        </template>
        <p v-else class="text-sm text-default-soft text-center">No data</p>
      </card-ui>
    </template>
  </v-popover>
</template>
<script>
import '~/assets/scss/components/_select.scss';

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
    small: Boolean,
    returnObject: Boolean,
    block: Boolean,
    placement: {
      type: String,
      default: 'bottom',
    },
    value: [String, Number],
    itemKey: String,
    itemValue: String,
    icon: String,
    listClass: String,
  },
  data: () => ({
    showPopover: false,
  }),
  methods: {
    isActiveItem(item) {
      if (typeof item === 'object') return item[this.itemValue] === this.value;

      return item === this.value;
    },
    emitEvent(item) {
      this.$emit('input', typeof item === 'object' ? (this.returnObject ? item : item[this.itemValue]) : item);
    },
  },
  computed: {
    getValueName() {
      if (typeof this.list[0] === 'object') {
        return this.list.find(item => item[this.itemValue] === this.value)[this.itemKey];
      }
      return this.value;
    },
  },
};
</script>
