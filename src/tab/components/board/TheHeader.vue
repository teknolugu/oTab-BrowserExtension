<template>
  <div class="header flex items-center">
    <button-icon
      icon="star"
      class="mr-1"
      size="20"
      :icon-style="board.starred ? 'monochrome' : 'line'"
      :class="{ 'text-yellow-500': board.starred }"
      @click="updateBoard('starred')"
    ></button-icon>
    <input-ui
      v-if="editBoardTitle.active"
      @blur="updateBoard('title')"
      @keyup.enter="updateBoard('title')"
      v-model="editBoardTitle.title"
      input-style="background"
      class="text-sm"
      placeholder="Board name"
      autofocus
    ></input-ui>
    <h3 class="text-overflow transition-bg hover:bg-gray-200 board-title" v-else @click="(editBoardTitle.active = true), (editBoardTitle.title = board.title)">
      {{ board.title }}
    </h3>
    <div class="bg-gray-400 mx-4" style="width: 1px; height: 30px"></div>
    <div class="input-filter">
      <input-ui small input-style="background" icon="search" placeholder="Search..." class="text-sm" v-model="searchQuery" width="120px"></input-ui>
      <div class="inline-block ml-2">
        <select-ui class="capitalize" small list-class="capitalize" :list="filterList" v-model="searchType"></select-ui>
      </div>
    </div>
    <div class="flex-grow"></div>
    <label-ui v-model="activeLabel">
      <button-ui class="text-white shadow-lg" height="38px" :background-color="!!activeLabel ? getActiveLabel.color : ''">
        <span class="text-base font-medium mr-2 align-top text-overflow inline-block" style="max-width: 100px">
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
    updateBoard(key) {
      const value = key === 'starred' ? !this.board.starred : this.editBoardTitle.title;
      this.$store.dispatch('board/update', {
        data: {
          [key]: value,
        },
      });
      this.editBoardTitle.active = false;
    },
    updateSearch(key, value) {
      this.$store.commit('updateSearch', { key, value });
    },
    updateActiveLabel(label) {
      this.$store.commit('updateActiveLabel', label);
    },
  },
  computed: {
    board() {
      return this.$store.getters['board/getActiveBoard'];
    },
    searchQuery: {
      get() {
        return this.$store.state.search.query;
      },
      set(value) {
        this.updateSearch('query', value.toLowerCase());
      },
    },
    activeLabel: {
      set(value) {
        this.$store.commit('updateActiveLabel', value);
      },
      get() {
        return this.$store.state.activeLabel;
      },
    },
    getActiveLabel() {
      return this.$store.getters['label/getLabelByLabelId'](this.$store.state.activeLabel);
    },
    searchType: {
      get() {
        return this.$store.state.search.type;
      },
      set(value) {
        this.updateSearch('type', value);
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
  @apply text-xl;
  @apply rounded;
  @apply px-2;
  @apply py-1;
  max-width: 200px;
  cursor: pointer;
  text-transform: capitalize;
}
.labels-tooltip {
  @apply shadow-xl;
  @apply rounded;
  padding: 5px 10px;
  background-color: white;
}
</style>
