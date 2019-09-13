<template>
  <v-dialog origin="top center" v-model="visible" fullscreen content-class="custom-fullscreen-dialog">
    <v-card>
      <v-card-title>
        <span>Boards</span>
        <v-text-field outlined class="board-manager-search ml-4" v-model="search" hide-details placeholder="Search boards..."></v-text-field>
        <v-btn icon @click="visible = false" class="right">
          <v-icon>{{ $icons.mdiClose }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider class="mb-5 mt-2"></v-divider>
      <v-card-text>
        <div class="d-flex align-center mb-4 justify-space-between">
          <v-btn depressed small color="primary" @click="newBoard">
            <v-icon left>{{ $icons.mdiPlus }}</v-icon>
            New board
          </v-btn>
          <span class="text-uppercase caption font-weight-medium">
            you have <span class="font-weight-bold">{{ $store.state.boards.length }}</span> board(s)
          </span>
        </div>
        <draggable v-model="boards" class="boardManager-content d-flex flex-row flex-wrap" handle=".board-card">
          <template v-for="board in boards">
            <board-card :board="board"></board-card>
          </template>
        </draggable>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import Draggable from 'vuedraggable';
import Bus from '../utils/bus';
import BoardCard from './board-card';

export default {
  components: { BoardCard, Draggable },
  data: () => ({
    search: '',
    visible: false,
  }),
  methods: {
    async newBoard() {
      const result = await this.$dialog.prompt({
        text: 'Board name',
        title: 'Create new board',
      });
      if (typeof result === 'undefined') {
        this.$dialog.notify.error("Can't use current name");
      } else {
        this.$store.dispatch('createNewBoard', result).catch(message => {
          this.$dialog.notify.error(message);
        });
      }
    },
  },
  computed: {
    boards: {
      get() {
        if (this.$store.state.boards.length !== 0) {
          return this.$store.state.boards.filter(board => board.title.toLowerCase().match(this.search));
        }
        return [];
      },
      set(boards) {
        this.$store.commit('changeBoards', boards);
      },
    },
  },
  created() {
    Bus.$on('boardManager', () => (this.visible = true));
  },
};
</script>
<style lang="scss">
.board-manager-search {
  .v-input__slot {
    width: 200px;
    font-size: 14px;
    min-height: 20px !important;
  }
}
.custom-fullscreen-dialog {
  .v-card {
    border-radius: 0px !important;
  }
}
</style>
