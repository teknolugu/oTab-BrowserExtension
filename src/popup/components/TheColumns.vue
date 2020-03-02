<template>
  <scrollbar class="mt-4 column-container">
    <div class="column-wrapper pb-3 px-4">
      <template v-for="column in columns">
        <card-ui
          class="first:mt-0 mt-2 cursor-pointer"
          :class="{ 'text-primary border border-primary': column.id === value }"
          @click="$emit('input', column.id)"
          hover
          :key="column.id"
        >
          <p class="text-base font-medium align-middle text-overflow w-10/12 inline-block" :class="{ 'text-primary': column.id === value }">{{ column.title }}</p>
          <span class="text-default-soft text-xs align-middle">{{ countTab(column.id) }} tabs</span>
        </card-ui>
      </template>
      <input-ui
        autofocus
        v-model="columnTitle"
        block
        placeholder="Column title"
        input-style="outline"
        class="mt-4"
        @keyup.enter.native="addNewColumn"
        @blur="addNewColumn"
        v-if="showInput"
      ></input-ui>
      <button-ui class="text-left mt-2" block type="text" v-else @click="showInput = true">
        Create new column
      </button-ui>
    </div>
  </scrollbar>
</template>
<script>
import scrollbar from 'vue-perfect-scrollbar';

export default {
  components: { scrollbar },
  props: {
    search: String,
    value: String,
  },
  data: () => ({
    showInput: false,
    columnTitle: '',
  }),
  computed: {
    columns() {
      return this.$store.getters['columns/getColumnsByBoardId']().filter(column => column.title.match(this.search.toLowerCase()));
    },
  },
  methods: {
    addNewColumn() {
      if (!this.showInput || this.columnTitle === '') return;

      this.$store.dispatch('columns/add', this.columnTitle);
      this.columnTitle = '';
      this.showInput = false;
    },
    countTab(columnId) {
      return this.$store.getters['items/getItemsByColumnId'](columnId).filter(item => item.type === 'tab').length;
    },
  },
};
</script>
<style>
.column-container {
  height: 260px;
  overflow-y: auto;
}
</style>
