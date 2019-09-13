<template>
  <v-app-bar app dense flat hide-on-scroll color="primary" dark class="menu-bar">
    <v-btn fab depressed small class="home-button" @click="emitBus('home')">
      <v-icon>{{ $icons.mdiHomeVariantOutline }}</v-icon>
    </v-btn>
    <v-btn fab class="home-button ml-3" @click="emitBus('boardManager')" depressed small>
      <v-icon>{{ $icons.mdiDeveloperBoard }}</v-icon>
    </v-btn>
    <v-tabs color="white" class="menu-bar--tabs" centered background-color="transparent" @change="changeActiveMenu" :value="$store.state.activeMenu">
      <v-tab v-for="menu in menus" :key="menu.index" class="app-tab">
        <v-icon class="mr-1">{{ $icons[menu.icon] }}</v-icon>
        <span class="capitalize">{{ menu.name }}s</span>
      </v-tab>
    </v-tabs>
    <div class="flex-grow-1"></div>
    <select-tag></select-tag>
    <account></account>
    <template v-slot:extension>
      <v-speed-dial open-on-hover v-model="speedDial" class="speed-dial-btn" fixed right direction="left" transition="slide-x-reverse">
        <template v-slot:activator>
          <v-btn v-model="speedDial" small color="pink" dark fab>
            <v-icon v-if="speedDial">{{ $icons.mdiClose }}</v-icon>
            <v-icon v-else>{{ $icons.mdiPlus }}</v-icon>
          </v-btn>
        </template>
        <v-tooltip bottom v-for="(item, index) in speedMenu" :key="index">
          <template v-slot:activator="{ on }">
            <v-btn fab dark small color="green" v-on="on" @click="createItem(item.name, item.commit)">
              <v-icon>{{ $icons[item.icon] }}</v-icon>
            </v-btn>
          </template>
          <span class="capitalize">add {{ item.name }}</span>
        </v-tooltip>
      </v-speed-dial>
      <v-text-field v-model="searchItem" placeholder="Type to search..." hide-details solo flat class="search-item" :prepend-inner-icon="$icons.mdiMagnify"></v-text-field>
      <div class="divider-menu ml-5"></div>
      <v-tabs show-arrows style="max-width: 85%" color="white" align-with-title background-color="transparent" :value="activeBoardIndex">
        <v-tabs-slider color="accent"></v-tabs-slider>
        <v-tab :ripple="false" v-for="board in boardList" :key="board.id" class="board-tab" :title="board.title" @click="activeBoardChange(board.id)">
          <span class="capitalize text-truncate">{{ board.title }}</span>
          <v-btn @click.stop="starredBoard(board.id)" class="ml-2 star-board-button" icon text small>
            <v-icon :class="{ 'is-starred': isStarred(board.id) }" class="star-board-icon">{{ isStarred(board.id) ? $icons.mdiStar : $icons.mdiStarOutline }}</v-icon>
          </v-btn>
        </v-tab>
      </v-tabs>
    </template>
  </v-app-bar>
</template>
<script>
import SelectTag from './select-tag';
import Bus from '../../utils/bus';
import Account from './account';

export default {
  components: { SelectTag, Account },
  data: () => ({
    speedDial: false,
    menus: [{ name: 'collection', icon: 'mdiBookmarkOutline' }, { name: 'note', icon: 'mdiNoteOutline' }, { name: 'task', icon: 'mdiCalendarCheckOutline' }],
    speedMenu: [
      { name: 'board', icon: 'mdiDeveloperBoard' },
      { name: 'collection', icon: 'mdiBookmarkOutline', commit: 'collections/createCollection' },
      { name: 'column', icon: 'mdiCalendarCheckOutline', commit: 'tasks/createColumn' },
    ],
  }),
  computed: {
    searchItem: {
      set(value) {
        this.$store.commit('search', value);
      },
      get() {
        return this.$store.state.search;
      },
    },
    boardList() {
      return this.$store.getters.boardList;
    },
    activeBoardIndex() {
      return this.$store.state.boards.findIndex(board => board.id === this.$store.state.activeBoard);
    },
  },
  methods: {
    isStarred(boardId) {
      return boardId === this.$store.state.starBoard;
    },
    starredBoard(boardId) {
      this.$store.commit('starBoard', boardId);
    },
    emitBus(name) {
      Bus.$emit(name);
    },
    async createItem(name, commit) {
      const result = await this.$dialog.prompt({
        text: `${name} name`,
        title: `Please input ${name} name`,
      });
      if (name === 'board' && typeof result === 'string') {
        if (result) {
          this.$store.dispatch('createNewBoard', result).catch(message => {
            this.$dialog.notify.error(message);
          });
        }
      } else if (typeof result === 'string') {
        if (this.$store.state.boards.length === 0) {
          this.$dialog.notify.error('You need board');
        } else {
          this.$store.commit(commit, { title: result });
        }
      }
    },
    changeActiveMenu(index) {
      this.$browser.storage.sync.set({ oTabMenu: index });
      this.$store.commit('activeMenu', index);
    },
    activeBoardChange(id) {
      const boardIndex = this.$store.state.boards.findIndex(board => board.id === id);
      this.$store.commit('activeBoard', this.$store.state.boards[boardIndex].id);
    },
  },
};
</script>
<style lang="scss">
.divider-menu {
  border: 1px solid #ffffff94;
  height: 60%;
}

.search-item {
  width: 180px;
  .v-input__control {
    font-size: 14px !important;
    min-height: 25px !important;
    .v-input__slot {
      i {
        font-size: 20px !important;
      }
      background-color: #0000001c !important;
    }
  }
}

.app-tab.v-tab--active {
  text-shadow: 2px 2px 2px #00000021;
}

.home-button {
  &:first-child {
    border: 1px solid #0000000f;
  }
  background-color: #00000005 !important;
}

.speed-dial-btn {
  bottom: -16px;
}

.board-tab {
  max-width: 180px !important;
  &:hover {
    .star-board-icon {
      visibility: visible;
      opacity: 1;
    }
  }

  .star-board-icon {
    &.is-starred {
      color: #fdd835 !important;
      visibility: visible;
      opacity: 1;
    }

    transition: all 0.2s ease;
    visibility: hidden;
    opacity: 0;
    font-size: 20px !important;
  }
}

.menu-bar {
  .v-toolbar__extension {
    padding-right: 75px !important;
  }
  .v-toolbar__content {
    border-bottom: 1px solid #ffffff36;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  &--tabs {
    position: absolute;
    z-index: -1;
    margin: 0 !important;
    left: 0;
  }
}
</style>
