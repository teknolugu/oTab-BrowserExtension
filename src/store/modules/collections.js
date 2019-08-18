export default {
  state: {
    activeBoard: '',
    items: {},
  },
  getters: {
    list: state => {
      return state.items[state.activeBoard];
    },
  },
  mutations: {
    addTab(state, { collectionIndex, payload }) {
      state.items[state.activeBoard][collectionIndex].tabs.push(payload);
    },
    editTab(state, { title, url, collectionIndex, index }) {
      let tab = state.items[state.activeBoard][collectionIndex].tabs[index];
      tab.title = title;
      tab.url = url;
    },
    editTitle(state, { collectionTitle, index }) {
      state.items[state.activeBoard][index].title = collectionTitle;
    },
    delCollection(state, index) {
      state.items[state.activeBoard].splice(index, 1);
    },
    delCollectionTag(state, { tagId, collectionIndex }) {
      let board = state.items[state.activeBoard];
      let tagIndex = board[collectionIndex].tags.findIndex(tag => tag.id === tagId);
      board[collectionIndex].tags.splice(tagIndex, 1);
    },
    addCollectionTag(state, { allTags, select, index }) {
      let board = state.items[state.activeBoard];
      for (let id of select) {
        let tagIndex = allTags.findIndex(item => item.id === id);
        if (tagIndex !== -1) board[index].tags.push(allTags[tagIndex]);
      }
    },
    createCollection(state, { title, tabs }) {
      let getTabs = typeof tabs === 'undefined' ? [] : tabs;
      let board = state.items[state.activeBoard];
      board.push({
        title: title,
        tabs: getTabs,
        tags: [],
      });
    },
    removeCollectionTab(state, { collectionIndex, tabIndex }) {
      let board = state.items[state.activeBoard];
      board[collectionIndex].tabs.splice(tabIndex, 1);
    },
  },
  actions: {
    addCollectionTag({ rooState, commit, rootGetters }, { select, index }) {
      let allTags = rootGetters.board.allTags;
      commit('addCollectionTag', { allTags, select, index });
    },
  },
};
