<template>
  <div class="flex flex-col h-full">
    <p class="font-medium text-base inline-block px-4 text-default-soft">Open Tabs</p>
    <scrollbar class="tabs mt-4 px-5 pb-5 flex-grow">
      <div v-if="tabs.length === 0" class="text-center mt-8 text-default-soft">
        <unicon name="window" class="mx-auto p-5 bg-gray-300 rounded-full"></unicon>
        <p class="text-base mt-2">No Data</p>
      </div>
      <Draggable v-else ghost-class="hidden-child" v-model="tabs" :group="groupOptions" @change="closeTab" :clone="generateTabData">
        <card-tab v-for="tab in tabs" :key="tab.id" :data="tab"></card-tab>
      </Draggable>
    </scrollbar>
    <button-ui :disabled="tabs.length === 0" type="outline" @click="saveSession" class="mx-5 mt-3">Save session</button-ui>
  </div>
</template>
<script>
import Draggable from 'vuedraggable';
import dayjs from 'dayjs';
import scrollbar from 'vue-perfect-scrollbar';

import generateId from '@/utils/generateId';
import isURL from '@/utils/isURL';

import CardTab from './ColumnCard/cards/CardTab';

export default {
  components: { Draggable, CardTab, scrollbar },
  data: () => ({
    tabs: [],
  }),
  computed: {
    hide() {
      return this.$store.state.ui.hideOpenTabs;
    },
    groupOptions() {
      return {
        name: 'list',
        pull: this.$store.state.settings.closeTabOnSave ? true : 'clone',
        put: false,
      };
    },
  },
  methods: {
    closeTab(event) {
      if (event.removed) this.$browser.tabs.remove(event.removed.element.id);
    },
    generateTabData(data) {
      return {
        ...data,
        id: generateId(this.$store.state.items),
      };
    },
    async saveSession() {
      const tabs = this.$tabs.query({});
      const columnTitle = dayjs(Date.now())
        .format('MMM Do, HH:mm')
        .toString();

      this.$store.dispatch('columns/add', columnTitle).then(id => {
        this.$store.commit('items/sessionItem', { columnId: id, items: this.tabs });
      });
      this.$browser.tabs.remove(this.tabs.map(tab => tab.id));
    },
  },
  mounted() {
    const extractTab = ({ title, url, favIconUrl, id }) => ({ title, url, favIconUrl, id, type: 'tab' });

    this.$browser.tabs.query({}).then(tabs => {
      this.tabs = tabs.filter(tab => isURL(tab.url)).map(tab => extractTab(tab));
    });

    this.$browser.tabs.onUpdated.addListener((id, info, tab) => {
      if (info.status === 'complete' && isURL(tab.url)) {
        const tabIndex = this.tabs.findIndex(item => item.id === id);

        if (tabIndex === -1) {
          this.tabs.push(extractTab(tab));
        } else {
          this.tabs.splice(tabIndex, 1, extractTab(tab));
        }
      }
    });
    this.$browser.tabs.onRemoved.addListener(id => {
      const index = this.tabs.findIndex(tab => tab.id === id);
      if (index !== -1) this.tabs.splice(index, 1);
    });
  },
};
</script>
