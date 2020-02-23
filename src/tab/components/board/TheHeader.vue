<template>
  <div class="header flex items-center">
    <button-icon
      icon="star"
      class="mr-1"
      size="20"
      :icon-style="isDefaultBoard ? 'monochrome' : 'line'"
      :class="{ 'text-yellow': isDefaultBoard }"
      @click="updateDefaultBoard"
    ></button-icon>
    <input-ui
      v-if="editBoardTitle.active"
      @blur="updateBoardTitle"
      @keyup.enter="updateBoardTitle"
      v-model="editBoardTitle.title"
      input-style="background"
      class="text-sm"
      placeholder="Board name"
      autofocus
    ></input-ui>
    <h3 class="text-overflow transition-colors hover:bg-gray-200 board-title" v-else @click="(editBoardTitle.active = true), (editBoardTitle.title = board.title)">
      {{ board.title }}
    </h3>
    <div class="bg-gray-300 mx-4" style="width: 1px; height: 30px"></div>
    <div class="input-filter">
      <input-ui input-style="background" icon="search" placeholder="Search..." v-model="searchQuery" width="100px"></input-ui>
      <div class="inline-block ml-2">
        <select-ui class="capitalize" icon="filter" list-class="capitalize" :list="filterList" v-model="searchType"></select-ui>
      </div>
    </div>
    <div class="flex-grow"></div>
    <label-ui v-model="activeLabel">
      <button-ui class="h-10" :background-color="!!activeLabel ? getActiveLabel.color : ''">
        <span class="font-medium mr-2 align-top text-overflow inline-block" style="max-width: 100px">
          {{ !!activeLabel ? getActiveLabel.name : 'Label' }}
        </span>
        <unicon name="angle-down"></unicon>
      </button-ui>
    </label-ui>
  </div>
</template>
<script>
export default {
  data: () => ({
    selectedFilter: 'column',
    filterList: ['column', 'note', 'task', 'tab'],
    editBoardTitle: {
      active: false,
      title: '',
    },
  }),
  methods: {
    updateBoardTitle(key) {
      this.$store.dispatch('boards/update', {
        data: {
          title: this.editBoardTitle.title,
        },
      });
      this.editBoardTitle.active = false;
    },
    updateDefaultBoard() {
      this.$store.commit('ui/update', {
        key: 'defaultBoard',
        value: this.$store.state.ui.activeBoard,
      });
    },
  },
  computed: {
    isDefaultBoard() {
      return this.$store.state.ui.activeBoard === this.$store.state.ui.defaultBoard;
    },
    board() {
      return this.$store.getters['boards/getActiveBoard'];
    },
    searchQuery: {
      get() {
        return this.$store.state.ui.searchQuery;
      },
      set(value) {
        this.$store.commit('ui/update', {
          key: 'searchQuery',
          value: value.toLowerCase(),
        });
      },
    },
    activeLabel: {
      set(value) {
        this.$store.commit('ui/update', {
          key: 'activeLabel',
          value,
        });
      },
      get() {
        return this.$store.state.ui.activeLabel;
      },
    },
    getActiveLabel() {
      return this.$store.getters['labels/getLabelByLabelId'](this.$store.state.ui.activeLabel);
    },
    searchType: {
      get() {
        return this.$store.state.ui.searchType;
      },
      set(value) {
        this.$store.commit('ui/update', {
          key: 'searchType',
          value,
        });
      },
    },
  },
};
</script>
<style>
.label-button {
  cursor: pointer;
  transition: all 0.1s ease;
}
.label-button:hover {
  filter: brightness(0.9);
}
.board-title {
  @apply text-xl rounded-lg px-2 py-1;
  max-width: 200px;
  cursor: pointer;
  text-transform: capitalize;
}
.labels-tooltip {
  @apply shadow-xl;
  @apply rounded-lg;
  padding: 5px 10px;
  background-color: white;
}
</style>
