<template>
  <div id="app">
    <template v-if="$store.state.isLoaded">
      <template v-if="!isEmpty">
        <Menu></Menu>
        <transition name="el-fade-in-linear" mode="out-in">
          <keep-alive>
            <Collections v-if="activeMenu === '0'"></Collections>
            <Notes v-if="activeMenu === '1'"></Notes>
            <Tasks v-if="activeMenu === '2'"></Tasks>
          </keep-alive>
        </transition>
      </template>
      <template v-else>
        <div class="empty-board">
          <div class="empty-board-wrapper" @click="createNewBoard">
            <div class="empty-board-button">
              <i class="el-icon-plus"></i>
              <span>New Board</span>
            </div>
            <div class="empty-board-text">
              <p>You have no board, click here to create new one</p>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <p>wait....</p>
    </template>
  </div>
</template>
<script>
import Menu from './components/menu';
import Collections from './views/collections';
import Notes from './views/notes';
import Tasks from './views/tasks';
import Bus from './utils/bus';
import newBoard from '../mixins/new-board';
export default {
  mixins: [newBoard],
  components: { Menu, Collections, Tasks, Notes },
  watch: {
    allData: {
      handler(val) {
        if (!this.$store.state.firstChange) {
          this.allData.boards.length === 0 ? (this.isEmpty = true) : (this.isEmpty = false);
          this.$browser.storage.sync.set({ oTabData: this.allData });
        }
      },
      deep: true,
    },
    activeBoard(val) {
      Bus.$emit('changeBoard', val);
    }
  },
  data: () => ({
    isEmpty: false,
  }),
  computed: {
    activeBoard() {
      return this.$store.state.activeBoard;
    },
    allData() {
      return this.$store.getters.allData;
    },
    activeMenu() {
      return this.$store.state.activeMenu;
    },
  },
  async created() {
    let storage = this.$browser.storage.sync;
    let data = await storage.get('oTabData');
    let menu = await storage.get('oTabMenu');
    this.$store.commit('activeMenu', menu.oTabMenu)
    this.isEmpty = data.oTabData.boards.length === 0 ? true : false;
    this.$store.dispatch('setAllData', { data, isEmpty: this.isEmpty });
  },
};
</script>
<style lang="scss">
@import '../assets/slide-transitions.scss';

@include slideTransition(left, -10px);
html, body{
  height: 100%;
}
.empty-board {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .empty-board-button {
    font-size: 40px;
    overflow: hidden;
    height: 45px;
    padding: 10px 13px;
    border-radius: 50px;
    background-color: #ececec;
    color: #7d7d7d;
    transition: all 0.5s ease;
    margin: 0 auto;
    width: 40px;
  }

  .empty-board-text {
    margin-top: 10px;
    font-size: 16px;
    color: #606266;
  }
}

.empty-board-wrapper {
  padding: 20px;
  cursor: pointer;
}

.empty-board-wrapper:hover {
  .empty-board-button {
    width: 80%;
  }
}

.el-main {
  height: 90%;
}
</style>
