<template>
  <div class="menu">
    <el-menu class="el-menu" mode="horizontal" text-color="#a0cfff" active-text-color="#409EFF" :default-active="activeIndex">
      <el-menu-item class="select-board-item">
        <el-select placeholder="Select Board" name="select-input" size="medium" :value="board.id" @change="activeBoardChange">
          <div class="new-board-item el-select-dropdown__item" value="new-board" @click="createNewBoard" disabled>
            <i class="el-icon-plus"></i>
            <span>Create New Board</span>
          </div>
          <div class="divider-select"></div>
          <el-option v-for="board in $store.getters.boardList" :key="board.id" :label="board.title" class="board-item-name" :value="board.id">
            <span>{{ board.title }}</span>
            <el-button circle size="mini" type="danger" plain icon="el-icon-delete" class="delete-board" @click.stop="deleteBoard(board.id)"></el-button>
          </el-option>
        </el-select>
      </el-menu-item>
      <el-menu-item v-for="menu in menus" :index="menu.index" :key="menu.index" @click="changeActiveTab(menu.index)">
        <unicon :name="menu.icon" height="23px" width="23px"></unicon>
        {{ menu.name }}
      </el-menu-item>
      <el-menu-item class="tag-select-menu">
        <el-select :value="$store.state.activeTag" placeholder="Select Tag" size="small" @change="activeTag">
          <template slot="prefix">
            <i class="el-icon-price-tag"></i>
          </template>
          <el-option v-for="item in allTags" :key="item.id" :label="item.name" :value="item.id" class="option-tag">
            <div>
              <p :style="{ 'background-color': item.color }" :class="{ 'tag-menu-item': item.id !== 'all_tags#e4e4e4' }">{{ item.name }}</p>
              <el-button type="danger" @click.stop="delTag(item.id)" icon="el-icon-delete" size="mini" v-if="item.id !== 'all_tags#e4e4e4'"></el-button>
            </div>
          </el-option>
        </el-select>
      </el-menu-item>
      <el-menu-item class="right">
        <el-popover placement="bottom" width="260" trigger="click">
          <div class="new-tag-popover-title bb">
            <p>Create New Tag</p>
            <el-button type="primary" size="mini" class="right" @click="createNewTag">Create</el-button>
          </div>
          <div class="new-tag-popover">
            <el-input show-word-limit :maxlength="10" autofocus v-model="newTag.name" placeholder="Tag name" size="medium"></el-input>
            <div class="color-picker">
              <el-color-picker :predefine="predefine.colors" size="small" v-model="newTag.color"></el-color-picker>
              <button :style="{ 'background-color': newTag.color }" @click="changeColor" size="small">Change Color</button>
            </div>
          </div>
          <el-button size="small" slot="reference" class="new-tag-button" :style="{ 'background-color': activeTagColor }" type="primary">+ New Tag</el-button>
        </el-popover>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import newBoard from '../mixins/new-board';
export default {
  mixins: [newBoard],
  data: () => ({
    menus: [{ index: '0', name: 'Collections', icon: 'layers' }, { index: '1', name: 'Notes', icon: 'notes' }, { index: '2', name: 'Tasks', icon: 'clipboard-notes' }],
    activeIndex: '0',
    predefine: {
      index: 0,
      colors: ['#409EFF', '#fea49f', '#51d0de', '#F7C331', '#F56C6C', '#7575dd'],
    },
    newTag: {
      name: '',
      color: '#409EFF',
    },
  }),
  computed: {
    board() {
      return this.$store.getters.board;
    },
    allTags() {
      let allTags = [{ name: 'all tags', color: '#e4e4e4', id: 'all_tags#e4e4e4' }, ...this.board.allTags];
      return allTags;
    },
    activeTagColor() {
      return '#' + this.$store.state.activeTag.split('#')[1];
    },
  },
  methods: {
    deleteBoard(boardId) {
      this.$confirm('This will permanently delete the board. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      })
        .then(() => {
          this.$store.dispatch('deleteBoard', boardId);
          this.$message({
            type: 'success',
            message: 'Delete completed',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled',
          });
        });
    },
    createNewTag() {
      if (this.newTag.name === '') {
        this.$message({
          message: 'Tag Name is blank',
          type: 'warning',
        });
      } else {
        this.$store
          .dispatch('createNewTag', this.newTag)
          .then(() => (this.newTag.name = ''))
          .catch(message => {
            this.$message({
              message: message,
              type: 'warning',
            });
          });
      }
    },
    delTag(tagId) {
      this.$store.dispatch('deleteTag', tagId);
    },
    changeColor() {
      if (this.predefine.index === this.predefine.colors.length - 1) {
        this.predefine.index = 0;
        this.newTag.color = this.predefine.colors[0];
        return;
      }
      this.newTag.color = this.predefine.colors[(this.predefine.index += 1)];
    },
    activeTag(tag) {
      this.$store.commit('activeTag', tag);
    },
    changeActiveTab(index) {
      this.$store.commit('activeMenu', index);
    },
    activeBoardChange(id) {
      let boardIndex = this.$store.state.boards.findIndex(board => board.id === id);
      this.$store.commit('activeBoard', this.$store.state.boards[boardIndex].id);
    },
  },
};
</script>
<style lang="scss">
.board-item-name:hover {
  .delete-board {
    opacity: 1;
    visibility: visible;
  }
}
.delete-board {
  margin-top: 3px !important;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  float: right;
}
.menu {
  .el-menu {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
.new-tag-popover-title {
  padding: 3px 10px 9px 10px;
  * {
    display: inline-block;
    margin-bottom: 0px;
  }
}
.new-tag-button {
  border: none !important;
}
.color-picker {
  button {
    &:hover {
      filter: brightness(1.1);
    }
    margin-left: 7px;
    width: 100%;
    border-radius: 4px;
    border: none;
    color: white;
    outline: none;
    cursor: pointer;
  }
}
.new-tag-popover {
  padding: 10px;
  .color-picker {
    padding: 7px 0;
    display: flex;
  }
}
.tag-menu-item {
  width: 77%;
  display: inline-block;
}

.tag-select-menu {
  float: right !important;
  padding-left: 0 !important;

  input {
    text-transform: capitalize !important;
  }
}

.el-input__inner[name='select-input'] {
  text-transform: capitalize;
}

.board-item-name {
  text-transform: capitalize;
}

.el-menu {
  background-color: #fff;
  z-index: 1;
}

.new-board-item {
  color: #606266 !important;
  cursor: pointer !important;

  &:hover {
    background-color: #f5f7fa !important;
  }
}

.divider-select {
  background-color: #dcdfe6;
  height: 1px;
  margin: 5px 0;
}

.empty-text {
  list-style: none;
}

.el-menu-item.is-active {
  svg {
    fill: #409eff;
  }
}

.el-menu-item {
  svg {
    fill: #a0cfff;
  }
}

.select-board-item {
  margin-right: 20px !important;

  .el-select {
    margin-top: -3px;
  }

  &:after {
    content: '';
    position: absolute;
    height: 30px;
    width: 1px;
    background-color: #e4e7ed;
    margin: 15px 20px;
  }
}
</style>
