<template>
  <div class="popup bg-gray-200 flex flex-col" v-if="retrieved">
    <the-menu></the-menu>
    <div class="px-4 mt-4">
      <input-ui input-style="outline" placeholder="Search column" block v-model="search" icon="search"></input-ui>
    </div>
    <the-columns :search="search" v-model="columnId"></the-columns>
    <bottom-menu :active-tab="activeTab" :columnId="columnId"></bottom-menu>
  </div>
</template>
<script>
import TheMenu from './components/TheMenu.vue';
import TheColumns from './components/TheColumns.vue';
import BottomMenu from './components/TheBottomMenu.vue';
import isURL from '@/utils/isURL';

export default {
  components: { TheMenu, TheColumns, BottomMenu },
  data: () => ({
    retrieved: false,
    search: '',
    columnId: '',
    activeTab: null,
  }),
  created() {
    this.$store.watch(
      state => state.ui.activeBoard,
      boardId => {
        const columns = this.$store.getters['columns/getColumnsByBoardId']();

        if (columns.length !== 0) this.columnId = columns[0].id;
      }
    );

    this.$store.dispatch('retrieveData').then(async ({ boards }) => {
      const tab = await this.$browser.tabs.query({ active: true });

      this.activeTab = tab[0];

      if (Object.keys(boards).length === 0 || !isURL(tab[0].url)) return;

      this.retrieved = true;
    });
  },
};
</script>
<style>
.popup {
  height: 470px;
  width: 320px;
}
.column-container {
  height: 250px;
  overflow-y: auto;
}
</style>
