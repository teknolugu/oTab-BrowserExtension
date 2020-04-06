<template>
  <div class="bg-gray-100 p-4 flex items-center">
    <unicon name="home-alt" @click="openExtTab" class="p-2 rounded-lg mr-4 bg-gray-200 cursor-pointer"></unicon>
    <select-ui :list="boards" item-key="title" item-value="id" block v-model="activeBoard" class="w-full"></select-ui>
  </div>
</template>
<script>
export default {
  data: () => ({}),
  computed: {
    boards() {
      return this.$store.getters['boards/getAllBoards'];
    },
    activeBoard: {
      set(value) {
        this.$store.commit('ui/update', {
          key: 'activeBoard',
          value,
        });
      },
      get() {
        return this.$store.state.ui.activeBoard;
      },
    },
  },
  methods: {
    openExtTab() {
      this.$browser.tabs.create({
        active: true,
        url: this.$browser.runtime.getURL('/tab/tab.html'),
      });
    },
  },
};
</script>
