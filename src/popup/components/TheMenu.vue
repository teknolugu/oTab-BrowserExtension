<template>
  <div class="h-16 px-6">
    <select-ui :list="boards" item-key="title" item-value="id" block v-model="activeBoard" class="w-full"></select-ui>
    <input-ui input-style="background"></input-ui>
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
