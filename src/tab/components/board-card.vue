<template>
  <v-card :ripple="false" hover width="300px" class="board-card mb-4" :class="{ 'elevation-5': board.id === $store.state.activeBoard }" @click="changeBoard">
    <v-card-title class="align-center grab justify-space-between background pt-2">
      <!--  -->
      <v-text-field
        v-model="boardName"
        autofocus
        @keyup.enter="renameBoard"
        hide-details
        class="mt-0 pt-0 edit-title-input"
        placeholder="Board title"
        v-if="editMode"
      ></v-text-field>
      <v-btn v-else-if="deleteMode" small depressed @click.stop="clearAll">Cancel</v-btn>
      <div style="max-width: 70%" class="d-flex" v-else>
        <span class="subtitle-1 font-weight-medium text-truncate d-inline-block" style="max-width: 75%" :title="board.title">{{ board.title }}</span>
        <v-btn @click.stop="starredBoard(board.id)" class="ml-2 star-board-button" icon text small>
          <v-icon color="yellow darken-1" :class="{ 'is-starred': isStarred(board.id) }" class="star-board-icon">{{
            isStarred(board.id) ? $icons.mdiStar : $icons.mdiStarOutline
          }}</v-icon>
        </v-btn>
      </div>
      <!---->
      <div v-if="editMode">
        <v-btn icon small @click.stop="clearAll">
          <v-icon>{{ $icons.mdiClose }}</v-icon>
        </v-btn>
        <v-btn icon small color="primary" @click.stop="renameBoard">
          <v-icon style="font-size: 22px">{{ $icons.mdiCheck }}</v-icon>
        </v-btn>
      </div>
      <v-btn v-else-if="deleteMode" color="error" small depressed @click.stop="deleteBoard">Delete</v-btn>
      <div class="board-card-action" v-else>
        <v-btn icon small color="primary" @click.stop="editBoard">
          <v-icon style="font-size: 22px">{{ $icons.mdiPencil }}</v-icon>
        </v-btn>
        <v-btn icon small color="error" @click.stop="deleteMode = true">
          <v-icon>{{ $icons.mdiDeleteOutline }}</v-icon>
        </v-btn>
      </div>
      <!-------->
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-chip pill v-for="item in items" color="transparent" class="ml-2 mt-2" :key="item.name">
        <v-icon left color="primary" left>{{ $icons[item.icon] }}</v-icon>
        <span>{{ getLength(item.name) }} </span>
        <span class="capitalize">{{ item.name }}</span>
      </v-chip>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    board: Object,
  },
  data: () => ({
    editMode: false,
    deleteMode: false,
    boardName: '',
    items: [{ name: 'collections', icon: 'mdiBookmarkOutline' }, { name: 'notes', icon: 'mdiNoteOutline' }, { name: 'tasks', icon: 'mdiCalendarCheckOutline' }],
  }),
  computed: {
    starBoard() {
      return this.$store.state.starBoard;
    },
  },
  methods: {
    starredBoard(boardId) {
      this.$store.commit('starBoard', boardId);
    },
    isStarred(boardId) {
      return boardId === this.$store.state.starBoard;
    },
    clearAll() {
      this.editMode = this.deleteMode = false;
      this.boardName = '';
    },
    editBoard(name) {
      this.editMode = true;
      this.boardName = this.$props.board.title;
    },
    renameBoard() {
      const boardId = this.$props.board.id;
      if (this.boardName === '') {
        this.$dialog.notify.error("Can't use current name");
      } else {
        this.$store
          .dispatch('renameBoard', { newName: this.boardName, boardId })
          .then(() => {
            this.clearAll();
          })
          .catch(message => {
            this.$dialog.notify.error(message);
          });
      }
    },
    deleteBoard() {
      this.$store.dispatch('deleteBoard', this.$props.board.id);
      this.clearAll();
    },
    changeBoard() {
      if (!this.editMode) this.$store.commit('activeBoard', this.$props.board.id);
    },
    getLength(key) {
      const item = this.$store.state[key].items[this.$props.board.id];
      if (item) return item.length;
    },
  },
};
</script>
<style lang="scss">
.board-card {
  margin-left: 12px;
  &:first-child {
    margin-left: 0;
  }
  &-action {
    transition: all 0.2s ease;
    visibility: hidden;
    opacity: 0;
  }
  &:hover {
    .board-card-action {
      visibility: visible;
      opacity: 1;
    }
  }
}
.edit-title-input {
  .v-input__control {
    max-width: 93%;
    font-size: 14px;
  }
}
</style>
