<template>
  <div class="board-list">
    <v-popover placement="right-start" offset="10">
      <unicon name="apps" v-tooltip.right="'Boards'" class="hover:bg-secondary cursor-pointer transition-colors rounded-lg p-2 text-inverse-soft"></unicon>
      <template slot="popover">
        <card-ui class="absolute shadow-xl" width="250px" style="padding: 17px 14px">
          <input-ui v-model="search" icon="search" input-style="background" class="text-default-soft text-sm w-full" placeholder="Search board"></input-ui>
          <scrollbar class="mt-3" style="max-height: 250px">
            <list-ui v-for="board in boards" :key="board.id" :active="board.id === $store.state.ui.activeBoard" small @click="updateUIState('activeBoard', board.id)">
              <p class="capitalize text-overflow" style="max-width: 160px">{{ board.title }}</p>
              <button-icon
                slot="suffix"
                small
                icon="star"
                class="mr-1 text-default-soft"
                size="20"
                style="z-index: 1"
                :icon-style="isDefaultBoard(board.id) ? 'monochrome' : 'line'"
                :class="{ 'text-yellow': isDefaultBoard(board.id) }"
                @click="updateUIState('defaultBoard', board.id)"
              ></button-icon>
            </list-ui>
          </scrollbar>
          <div @click="addBoard" class="mt-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors text-default">
            <unicon name="plus" class="align-bottom"></unicon>
            <span v-if="boards.length === 0 && !!search">Create "{{ search }}" board</span>
            <span v-else>Add board</span>
          </div>
        </card-ui>
      </template>
    </v-popover>
  </div>
</template>
<script>
import scrollbar from 'vue-perfect-scrollbar';

export default {
  components: { scrollbar },
  data: () => ({
    search: '',
  }),
  methods: {
    updateUIState(key, value) {
      this.$store.commit('ui/update', {
        key,
        value,
      });
    },
    isDefaultBoard(boardId) {
      return this.$store.state.ui.defaultBoard === boardId;
    },
    addBoard() {
      if (this.boards.length === 0 && !!this.search) {
        this.$store.dispatch('boards/add', this.search);
        this.search = '';
      } else {
        this.$modal.show('prompt', {
          title: 'Add board',
          type: 'text',
          placeholder: 'Board name',
          button: {
            color: 'primary',
            text: 'Create board',
          },
          handler: title => {
            if (!title) return;
            this.$store.dispatch('boards/add', title);
          },
        });
      }
    },
  },
  computed: {
    boards() {
      return this.$store.getters['boards/getAllBoards'].filter(board => {
        return board.title.match(this.search.toLowerCase());
      });
    },
  },
};
</script>
