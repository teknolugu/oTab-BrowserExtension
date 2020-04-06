<template>
  <div class="board-list-container">
    <div class="mb-6">
      <input-ui v-model="search" icon="search" class="text-sm" placeholder="Search board" input-style="background"></input-ui>
      <button-ui class="float-right text-inverse " @click="createBoard">Create board</button-ui>
    </div>
    <div class="boards-list mt-8">
      <div class="board-wrapper pt-4 pr-5 inline-block" v-for="board in boards">
        <card-ui class="border" hover width="230px">
          <template slot="header">
            <p class="text-xs text-default-soft">{{ getColumnsLength(board.id) }} COLUMN(s)</p>
            <div class="flex-grow"></div>
            <p class="float-right text-xs text-default-soft">{{ board.createdDate | formatTimestamp }}</p>
          </template>
          <input-ui autofocus v-model="editBoard.title" block class="mt-2 text-sm" @blur="updateBoard" v-if="board.id === editBoard.id" input-style="background"></input-ui>
          <p v-else @click="gotoBoard(board.id)" class="board--title line-clamp" style="height: 47px;">{{ board.title }}</p>
          <div class="mt-3" style="height: 30px">
            <button-icon square small class="border" icon="pen" @click="editBoard = board"></button-icon>
            <button-icon square small class="border text-red ml-1" icon="trash" @click="deleteBoard(board)"></button-icon>
            <button-icon
              icon="star"
              @click="updateDefaultBoard(board.id)"
              :icon-style="isDefaultBoard(board.id) ? 'monochrome' : 'line'"
              :class="{ 'text-yellow': isDefaultBoard(board.id) }"
              small
              class="float-right"
            ></button-icon>
          </div>
        </card-ui>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

export default {
  data: () => ({
    editBoard: {
      id: '',
      title: '',
    },
    search: '',
  }),
  computed: {
    boards() {
      return this.$store.getters['boards/getAllBoards'].filter(board => {
        return board.title.match(this.search.toLowerCase());
      });
    },
  },
  methods: {
    updateDefaultBoard(boardId) {
      this.$store.commit('ui/update', {
        key: 'defaultBoard',
        value: boardId,
      });
    },
    isDefaultBoard(boardId) {
      return this.$store.state.ui.defaultBoard === boardId;
    },
    gotoBoard(boardId) {
      this.$store.commit('ui/update', {
        key: 'activeBoard',
        value: boardId,
      });
      this.$router.push({ path: 'board' });
    },
    createBoard() {
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
    },
    updateBoard() {
      this.$store.dispatch('boards/update', {
        boardId: this.editBoard.id,
        data: {
          title: this.editBoard.title,
        },
      });
      this.editBoard = {
        title: '',
        id: '',
      };
    },
    deleteBoard({ title, id }) {
      this.$modal.show('delete', {
        title: 'Delete board',
        text: title,
        handler: confirm => {
          if (confirm) this.$store.dispatch('boards/delete', id);
        },
      });
    },
    getColumnsLength(boardId) {
      return this.$store.getters['columns/getColumnsByBoardId'](boardId).length;
    },
  },
  filters: {
    formatTimestamp(value) {
      return dayjs(value).format('MMM Do');
    },
  },
};
</script>
<style scoped>
.board--title:hover {
  @apply text-primary;
}
.board--title {
  @apply mt-1 transition-colors cursor-pointer text-lg font-medium leading-tight capitalize duration-200 ease-in-out;
}
</style>
