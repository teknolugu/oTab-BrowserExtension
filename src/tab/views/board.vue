<template>
  <div class="board content-wrapper height-with-menu flex flex-col" style="padding-bottom: 3px">
    <the-header></the-header>
    <draggable v-model="columns" draggable=".list-wrapper" class="flex-grow rounded-lg mt-4 pb-1 flex overflow-x-auto overflow-y-hidden flex-no-wrap">
      <div class="list-wrapper ml-5 first:ml-0" v-for="column in columns" :key="column.id">
        <column-card :column="column"></column-card>
      </div>
      <div
        class="bg-gray-200 flex items-center text-default-soft h-10 rounded-lg mt-3 ml-5 px-3 hover:bg-gray-300 duration-100 ease-in-out transition-colors cursor-pointer"
        style="width: 300px"
      >
        <div @click="addColumnInput.active = true" class="h-full flex items-center" style="width: 300px" v-if="!addColumnInput.active">
          <unicon name="plus"></unicon>
          <span class="text-sm ml-2 font-medium">Add column</span>
        </div>
        <template v-else>
          <input-ui @keyup.enter.native="addColumn" v-model="addColumnInput.title" autofocus input-style="transparent" placeholder="Column name" class="text-sm w-8/12"></input-ui>
          <div class="inline-block w-4/12 pl-2">
            <button-icon icon="multiply" class="align-middle" small @click="addColumnInput.active = false"></button-icon>
            <button-ui size="small" class="ml-2 align-middle" @click="addColumn">ADD</button-ui>
          </div>
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
        const { searchType, searchQuery, activeLabel } = this.$store.state.ui;
        return this.$store.getters['columns/getColumnsByBoardId']()
          .filter(column => {
            if (!!activeLabel) return column.labels.includes(activeLabel);

            return column;
          })
          .filter(column => {
            if (searchType === 'column') return column.title.toLowerCase().match(searchQuery);

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

      this.$store.dispatch('columns/add', this.addColumnInput.title);
      this.addColumnInput = {
        active: false,
        title: '',
      };
    },
  },
};
</script>
