<template>
  <div class="tags mb-1 flex w-full" style="top: 41px; z-index: 1">
    <template v-for="label in getLabels.slice(0, 4)">
      <div
        class="column-tag ml-1 first:ml-0 hover:brightness text-overflow"
        :class="[showName ? 'h-6 py-1 px-2' : 'h-2']"
        :style="{ backgroundColor: label.color }"
        :title="label.name"
        @click="showName = !showName"
      >
        <span class="text-inverse font-medium uppercase text-xs" :class="[showName ? 'visible' : 'invisible']">{{ label.name }}</span>
      </div>
    </template>
    <template v-if="getLabels.length >= 5">
      <div
        @click="showName = !showName"
        v-tooltip="{
          content: getRestLabel().join(', '),
          classes: ['bg-card shadow-xl px-3 text-sm font-medium rounded-lg py-2'],
          offset: '5',
        }"
        :class="[showName ? 'h-6 rounded-lg' : 'h-2']"
        class="bg-gray-300 ml-1 column-tag py-1 px-2"
        style="width: 60px"
      >
        <span class="font-medium" :class="[showName ? 'visible' : 'invisible']">+{{ getRestLabel().length }}</span>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    labels: Array,
  },
  data: () => ({
    showName: false,
  }),
  methods: {
    getRestLabel(labels) {
      return this.getLabels.slice(4, this.getLabels.length).map(label => label.name);
    },
  },
  computed: {
    getLabels() {
      return this.labels.map(label => {
        return this.$store.getters['labels/getLabelByLabelId'](label);
      });
    },
  },
};
</script>
<style scoped>
.column-tag {
  width: 20%;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}
</style>
