<template>
  <div class="bg-gray-100 p-4">
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
  mounted() {
    console.log(this.boards, this.$store.state);
  },
};
</script>
