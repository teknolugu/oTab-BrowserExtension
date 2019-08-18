<template>
  <div class="actions-container">
    <el-button :disabled="openTabs.length === 0" size="medium" icon="el-icon-download" @click="saveSession" plain>Save Session</el-button>
    <el-button type="primary" @click="currentTab" size="medium" icon="el-icon-plus" :disabled="!isUrl">Add Current Tab</el-button>
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
      let date = new Date(Date.now()).toString();
      let collectionName = date.slice(4, 10) + ', ' + date.slice(16, 21);
      this.$store.commit('collections/createCollection', { title: collectionName, tabs: [...this.openTabs] });

      // check if there's a non website tab
      let tabs = await this.$browser.tabs.query({});
      let allTabs = await this.allTabs(); //method from openTabs mixin
      console.log(tabs.length === allTabs.length);
      tabs.length === allTabs.length ? this.$browser.tabs.create({ active: true }) : null;
      await this.$browser.tabs.remove(this.openTabs.map(tab => tab.id));
    },
    currentTab() {
      this.$browser.tabs.query({ active: true, currentWindow: true }).then(tab => {
        let payload = {
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
<style lang="scss">
.actions-container {
  button {
    &:last-child {
      margin-top: 10px !important;
    }
    margin: 0 !important;
    width: 100%;
  }
  padding: 9px 15px;
}
</style>
