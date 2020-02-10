<template>
  <div class="board-list">
    <v-popover placement="bottom-start" offset="5">
      <div class="hover:bg-blue-600 cursor-pointer transition-bg rounded px-2 border border-blue-600 flex items-center" style="height: 38px">
        <unicon name="apps" height="20" width="20" class="text-gray-200"></unicon>
        <p class="text-sm text-white ml-2">Boards</p>
      </div>
      <template slot="popover">
        <card-ui class="absolute shadow-xl" width="250px" style="padding: 17px 14px">
          <input-ui v-model="search" icon="search" input-style="background" class="text-gray-600 text-sm w-full" placeholder="Search board"></input-ui>
          <div class="mt-3 scrollbar overflow-y-auto" style="max-height: 300px">
            <div class="hover:bg-gray-100 cursor-pointer rounded transition-bg flex relative items-center first:mt-0 py-2 px-3" v-for="board in boards">
              <div class="absolute left-0 w-full h-full" v-close-popover style="z-index: 0" @click="updateActiveBoard(board.id)"></div>
              <p class="capitalize text-base text-overflow w-11/12" :class="{ 'text-blue-500': board.id === $store.state.activeBoard }">{{ board.title }}</p>
              <button-icon
                small
                icon="star"
                class="mr-1 text-gray-600"
                size="20"
                style="z-index: 1"
                :icon-style="board.starred ? 'monochrome' : 'line'"
                :class="{ 'text-yellow-500': board.starred }"
                @click="updateBoard(board)"
              ></button-icon>
            </div>
          </div>
          <div @click="addBoard" class="mt-3 cursor-pointer p-2 rounded hover:bg-gray-100 text-sm font-medium transition-bg text-gray-700">
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
export default {
  data: () => ({
    search: '',
  }),
  methods: {
    updateActiveBoard(id) {
      this.$store.commit('activeBoard', id);
    },
    updateBoard({ id, starred }) {
      this.$store.dispatch('board/update', {
        boardId: id,
        data: {
          starred: !starred,
        },
      });
    },
    addBoard() {
      if (this.boards.length === 0 && !!this.search) {
        this.$store.dispatch('board/add', this.search);
        this.search = '';
      } else {
        this.$modal.show('prompt', {
          title: 'Add board',
          text: 'You are too awesome',
          handler: title => {
            if (!title) return;
            this.$store.dispatch('board/add', title);
          },
        });
      }
    },
  },
  computed: {
    boards() {
      return this.$store.getters['board/getAllBoards']
        .sort((a, b) => b.starred - a.starred)
        .filter(board => {
          return board.title.match(this.search.toLowerCase());
        });
    },
  },
  mounted() {
    console.log(this.$store.getters['board/getAllBoards']);
  },
};
</script>
