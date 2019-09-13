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
      const tab = state.items[state.activeBoard][collectionIndex].tabs[index];
      tab.title = title;
      tab.url = url;
    },
    editTitle(state, { collectionTitle, index }) {
      state.items[state.activeBoard][index].title = collectionTitle;
    },
    delCollection(state, index) {
      state.items[state.activeBoard].splice(index, 1);
    },
    addTag(state, { collectionIndex, tag }) {
      state.items[state.activeBoard][collectionIndex].tags.push(tag);
    },
    delTag(state, { collectionIndex, tagId }) {
      const { tags } = state.items[state.activeBoard][collectionIndex];
      const findTagIndex = tags.findIndex(tag => tag.id === tagId);
      tags.splice(findTagIndex, 1);
    },
    createCollection(state, { title, tabs }) {
      const getTabs = typeof tabs === 'undefined' ? [] : tabs;
      const board = state.items[state.activeBoard];
      board.push({
        title,
        tabs: getTabs,
        tags: [],
      });
    },
    removeCollectionTab(state, { collectionIndex, tabIndex }) {
      const board = state.items[state.activeBoard];
      board[collectionIndex].tabs.splice(tabIndex, 1);
    },
  },
};
