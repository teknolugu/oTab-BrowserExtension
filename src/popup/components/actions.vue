<template>
  <div class="d-flex flex-column align-center" style="width: 100%">
    <v-btn depressed block :disabled="openTabs.length === 0 || $store.state.boards.length === 0" @click="saveSession" color="primary">Save Session</v-btn>
    <v-btn outlined block class="ml-0 mt-2" color="grey" :disabled="!isUrl || $store.state.boards.length === 0" @click="currentTab">Add Current Tab</v-btn>
  </div>
</template>
<script>
import Bus from '../bus';
import openTabs from '../../mixins/open-tabs';

export default {
  mixins: [openTabs],
  props: {
    isUrl: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    index: '',
  }),
  methods: {
    async saveSession() {
      // Create collection based on date
      const date = new Date(Date.now()).toString();
      const collectionName = `${date.slice(4, 10)}, ${date.slice(16, 21)}`;
      this.$store.commit('collections/createCollection', { title: collectionName, tabs: [...this.openTabs] });

      // check if there's a non website tab
      const tabs = await this.$browser.tabs.query({});
      const allTabs = await this.allTabs(); // method from openTabs mixin
      tabs.length === allTabs.length ? this.$browser.tabs.create({ active: true }) : null;
      await this.$browser.tabs.remove(this.openTabs.map(tab => tab.id));
    },
    currentTab() {
      this.$browser.tabs.query({ active: true, currentWindow: true }).then(tab => {
        const payload = {
          title: tab[0].title,
          url: tab[0].url,
          favIconUrl: tab[0].favIconUrl,
        };
        this.$store.commit('collections/addTab', { collectionIndex: this.index, payload });
      });
    },
  },
  async created() {
    Bus.$on('changeIndex', index => (this.index = index));
  },
};
</script>
