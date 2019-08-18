<template>
  <el-card :class="{ 'active-board': board.id === $store.state.activeBoard }" shadow="never" class="board-card" @click.native="changeBoard(board.id)" :key="board.id">
    <div slot="header" class="clearfix">
      <div class="board-card-header">
        <!-- Edit Board -->
        <el-input size="mini" @keyup.enter.native="renameBoard(board.id)" v-model="boardName" autofocus v-if="editMode"></el-input>
        <!-- Edit Board -->
        <el-button plain v-else-if="deleteMode" @click.stop="clearAll" size="mini">Cancel</el-button>
        <!-- Actions -->
        <span class="board-title capitalize" v-else>{{ board.title }}</span>
        <i :class="[board.id === starBoard ? 'el-icon-star-on stared-board' : 'el-icon-star-off star-board']" @click.stop="staredBoard(board.id)"></i>
      </div>
      <div class="board-header--actions">
        <!-- Edit Board -->
        <template v-if="editMode">
          <el-button plain circle icon="el-icon-close" @click.stop="clearAll" size="mini"></el-button>
          <el-button type="primary" plain circle icon="el-icon-check" @click.stop="renameBoard(board.id)" size="mini"></el-button>
        </template>
        <!-- Delete Board -->
        <template v-else-if="deleteMode">
          <el-button size="mini" type="danger" @click.stop="deleteBoard(board.id)">Delete</el-button>
        </template>
        <!-- Actions -->
        <div class="action-buttons" v-else>
          <el-button type="danger" plain circle icon="el-icon-delete" @click.stop="deleteMode = true" size="mini"></el-button>
          <el-button plain circle icon="el-icon-edit" @click.stop="editBoard(board.title)" size="mini"></el-button>
        </div>
      </div>
    </div>
    <div v-for="item in items" class="board-item" :key="item.name">
      <unicon :name="item.icon" height="24px" width="24px"></unicon>
      <span>{{ getLength(board.id, item.name) }}</span>
      <span class="capitalize item-name">{{ item.name }}</span>
    </div>
  </el-card>
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
    items: [{ name: 'collections', icon: 'layers' }, { name: 'notes', icon: 'notes' }, { name: 'tasks', icon: 'clipboard-notes' }],
  }),
  computed: {
    starBoard() {
      return this.$store.state.starBoard;
    },
  },
  methods: {
    staredBoard(boardId) {
      this.$browser.storage.local.get('starBoard').then(data => {
        let boardData = boardId === data.starBoard ? '' : boardId;
        this.$store.commit('starBoard', boardData);
        this.$browser.storage.local.set({ starBoard: boardData });
      });
    },
    clearAll() {
      this.editMode = this.deleteMode = false;
      this.boardName = '';
    },
    editBoard(name) {
      this.editMode = true;
      this.boardName = name;
    },
    renameBoard(boardId) {
      if (this.boardName === '') {
        this.$message.error("Can't use current name");
      } else {
        this.$store
          .dispatch('renameBoard', { newName: this.boardName, boardId: boardId })
          .then(() => {
            this.clearAll();
          })
          .catch(err => {
            this.$message.error(err);
          });
      }
    },
    deleteBoard(boardId) {
      this.$store.dispatch('deleteBoard', boardId);
    },
    changeBoard(boardId) {
      if (!this.editMode) this.$store.commit('activeBoard', boardId);
    },
    getLength(boardId, key) {
      return this.$store.getters.allData[key][boardId].length;
    },
  },
};
</script>
<style lang="scss">
@import '../../assets/slide-transitions.scss';
@import '../../assets/themes/themes';

@include slideTransition(left, -5px, 0.3s);

$shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
$transition: all 0.3s ease;

.board-card-header {
  display: inline-block;
}
.stared-board {
  color: #f7ba2a;
  font-size: 20px;
  margin-left: 5px;
}
.star-board {
  visibility: hidden;
  opacity: 0;
  @include themify($themes) {
    color: themed('text-secondary');
  }
  &:hover {
    color: #f7ba2a;
  }
  font-size: 20px;
  margin-left: 5px;
  transition: all 0.2s ease;
}

.board-item {
  &:last-child {
    margin-top: 15px;
  }

  display: inline-block;
  margin: 0 10px;

  svg {
    vertical-align: middle;
    fill: #0793d6;
  }
}
.new-board-card {
  height: 170px;
  width: 300px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: $transition;
  cursor: pointer;
  &:hover {
    i {
      box-shadow: $shadow;
    }
    @include themify($themes) {
      background-color: themed('bg-color2');
    }
  }
  &--content {
    margin-top: -3px;
    text-align: center;
    i {
      transition: $transition;
      font-size: 20px;
      padding: 10px;
      border-radius: 30px;
      @include themify($themes) {
        background-color: themed('bg-color2');
      }
    }
    p {
      margin-top: 5px;
      font-size: 16px;
    }
  }
  @include themify($themes) {
    border: 2px dashed themed('light-border');
    background-color: themed('bg-color');
  }
}
.board-card {
  cursor: pointer;
  margin: 0 12px 12px 0;
  &:hover {
    .star-board {
      visibility: visible;
      opacity: 1;
    }
    .board-header--actions {
      .action-buttons {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
      }
    }
    box-shadow: $shadow;
  }
  transition: $transition;
  .board-header--actions {
    .action-buttons {
      visibility: hidden;
      opacity: 0;
      transition: $transition;
      transform: translateX(10px);
    }
    float: right;
    display: inline-block;
  }

  &.active-board {
    border: 1px solid #0793d6;
    box-shadow: $shadow;
  }

  height: 170px;
  width: 300px;
  border-radius: 4px;

  @include themify($themes) {
    background-color: themed('card');
  }

  .board-title {
    margin-top: 3px;
    display: inline-block;
    margin-bottom: 0;
    font-size: 15px;
    font-weight: 500;
    @include themify($themes) {
      color: themed('text-primary');
    }
  }
}
</style>
