<template>
  <div class="flex flex-col h-full">
    <p class="font-medium text-base inline-block px-4 text-gray-600">Open Tabs</p>
    <div class="tabs mt-4 overflow-auto scrollbar pl-5 pr-3 mr-2 pb-5 flex-grow">
      <div v-if="tabs.length === 0" class="text-center mt-8">
        <unicon name="window" class="mx-auto p-5 text-gray-600 bg-gray-300 rounded-full"></unicon>
        <p class="text-base mt-2 text-gray-600">No Data</p>
      </div>
      <Draggable v-else ghost-class="hidden-child" :list="tabs" :group="groupOptions">
        <card-tab v-for="tab in tabs" :key="tab.id" :data="tab"></card-tab>
      </Draggable>
    </div>
    <button-ui :disabled="tabs.length === 0" button-style="outline" @click="saveSession" class="hover:bg-gray-300 mx-5">Save session</button-ui>
  </div>
</template>
<script>
import Draggable from 'vuedraggable';
import CardTab from './ColumnCard/cards/CardTab';

export default {
  components: { Draggable, CardTab },
  data: () => ({
    groupOptions: { name: 'list', pull: 'clone', put: false, revertClone: true },
    tabs: [],
  }),
  computed: {
    hide() {
      return this.$store.state.hideOpenTabs;
    },
  },
  methods: {
    isURL(url) {
      const URLRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return URLRegex.test(url);
    },
    saveSession() {
      const date = new Date(Date.now()).toString();
      const columnTitle = `${date.slice(4, 10)}, ${date.slice(16, 21)}`;
      this.$store.dispatch('column/add', columnTitle).then(id => {
        this.$store.commit('item/sessionItem', { columnId: id, items: this.tabs });
      });
      this.$browser.tabs.remove(this.openTabs.map(tab => tab.id));
    },
  },
  mounted() {
    const extractTab = ({ title, url, favIconUrl, id }) => ({ title, url, favIconUrl, id, type: 'tab' });

    this.$browser.tabs.query({}).then(tabs => {
      this.tabs = tabs.filter(tab => this.isURL(tab.url)).map(tab => extractTab(tab));
    });

    this.$browser.tabs.onUpdated.addListener((id, info, tab) => {
      if (info.status === 'complete' && this.isURL(tab.url)) {
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
