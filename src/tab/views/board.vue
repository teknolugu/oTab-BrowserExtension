<template>
  <div class="pr-6 board pl-16 pb-2 height-with-menu pt-4 flex flex-col">
    <the-header></the-header>
    <draggable v-model="columns" draggable=".list-wrapper" class="flex-grow rounded mt-4 pb-1 scrollbar flex overflow-x-auto overflow-y-hidden flex-no-wrap">
      <div class="list-wrapper ml-5 first:ml-0" v-for="column in columns" :key="column.id">
        <column-card :column="column"></column-card>
      </div>
      <div class="bg-gray-200 flex items-center text-gray-600 h-10 rounded mt-3 ml-5 px-3 hover:bg-gray-300 transition-bg cursor-pointer" style="width: 300px">
        <div @click="addColumnInput.active = true" class="h-full flex items-center" style="width: 300px" v-if="!addColumnInput.active">
          <unicon name="plus"></unicon>
          <span class="text-sm ml-2 font-medium">Add column</span>
        </div>
        <template v-else>
          <input-ui @keyup.enter.native="addColumn" v-model="addColumnInput.title" autofocus input-style="transparent" placeholder="Column name" class="text-sm w-8/12"></input-ui>
          <button-icon icon="multiply" small @click="addColumnInput.active = false"></button-icon>
          <span class="bg-blue-500 shadow-md ml-3 px-3 py-1 text-sm rounded text-white" @click="addColumn">ADD</span>
        </template>
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable';

import OpenTabs from '../components/board/TheOpenTabs.vue';
import ColumnCard from '../components/board/ColumnCard/index.vue';
import TheHeader from '../components/board/TheHeader.vue';

export default {
  components: { OpenTabs, ColumnCard, TheHeader, draggable },
  data: () => ({
    addColumnInput: {
      active: false,
      title: '',
    },
  }),
  computed: {
    columns: {
      get() {
        const { search, activeLabel } = this.$store.state;
        return this.$store.getters['column/getColumnsByBoardId']()
          .filter(column => {
            if (!!activeLabel) return column.labels.includes(activeLabel);

            return column;
          })
          .filter(column => {
            if (search.type === 'column') return column.title.toLowerCase().match(search.query);

            return column;
          });
      },
      set(columns) {
        this.$store.commit('changeColumns', columns);
      },
    },
  },
  methods: {
    addColumn() {
      if (this.addColumnInput.title === '') return;

      this.$store.dispatch('column/add', this.addColumnInput.title);
      this.addColumnInput = {
        active: false,
        title: '',
      };
    },
  },
};
</script>
