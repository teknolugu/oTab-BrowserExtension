<template>
  <div class="bottom-menu mt-3">
    <button-ui class="mr-2 w-6/12" :disabled="columnId === ''" @click="saveCurrentTab">Save current</button-ui>
    <button-ui class="w-6/12" @click="saveSession">Save session</button-ui>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import isURL from '@/utils/isURL';

export default {
  props: {
    columnId: String,
    activeTab: Object,
  },
  methods: {
    saveSession() {
      this.$browser.tabs.query({}).then(result => {
        const tabs = result
          .map(tab => {
            return {
              title: tab.title,
              url: tab.url,
              favIconUrl: tab.favIconUrl,
              id: tab.id,
              type: 'tab',
            };
          })
          .filter(tab => isURL(tab.url));

        if (tabs.length === 0) return;

        const columnTitle = dayjs(Date.now())
          .format('MMM DD, HH:mm')
          .toString();

        this.$store.dispatch('columns/add', columnTitle).then(columnId => {
          this.$store.commit('items/sessionItem', { columnId, items: tabs });
          this.$browser.tabs.create({
            active: true,
            url: this.$browser.runtime.getURL('/tab/tab.html'),
          });
          this.$browser.tabs.remove(tabs.map(tab => tab.id));
        });
      });
    },
    saveCurrentTab() {
      this.$store.commit('items/addItem', {
        columnId: this.columnId,
        data: {
          title: this.activeTab.title,
          url: this.activeTab.url,
          favIconUrl: this.activeTab.favIconUrl,
          id: this.activeTab.id,
          type: 'tab',
        },
      });
    },
  },
};
</script>
<style lang="scss">
.bottom-menu {
  @apply px-4 flex items-center justify-around;
}
</style>
