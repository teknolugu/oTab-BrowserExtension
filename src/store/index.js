import Vue from 'vue';
import Vuex from 'vuex';
import Browser from 'webextension-polyfill';
import modules from './modules';

Vue.use(Vuex);

function saveData(key, data) {
  return Browser.storage.sync.set({ [key]: data });
}

function getData(key) {
  return Browser.storage.sync.get(key);
}

const Store = new Vuex.Store({
  strict: false,
  modules,
  state: {
    user: {
      name: 'Guest',
      email: '',
      emailVerified: false,
      lastLogin: null,
      createdAt: null,
    },
    isLogin: false,
    isLoaded: false,
    firstChange: true,
    subItems: ['collections', 'notes', 'tasks'],
    activeMenu: 0,
    boards: [],
    activeBoard: '',
    activeTag: 'all_tags#e4e4e4',
    starBoard: '',
    homeCollection: '',
    search: '',
  },
  getters: {
    boardList: state => {
      return state.boards.map(({ title, id }) => ({ title, id }));
    },
    board: state => {
      return state.boards.find(board => board.id === state.activeBoard);
    },
  },
  mutations: {
    changeUser(state, data) {
      state.user = data;
    },
    triggerSave(state, key) {
      state[key].items = { ...state[key].items };
    },
    search(state, text) {
      state.search = text;
    },
    homeCollection(state, tabs) {
      state.homeCollection = tabs;
    },
    starBoard(state, boardId) {
      const starBoardVal = boardId === state.starBoard ? '' : boardId;
      state.starBoard = starBoardVal;
      if (!state.firstChange) saveData('starBoard', starBoardVal);
    },
    changeBoolean(state, { key, data }) {
      state[key] = data;
    },
    initAppData(state, data) {
      state.boards = data.boards;
      state.subItems.forEach(item => (state[item].items = data[item]));
    },
    newTag(state, { tag, getters }) {
      getters.board.allTags.push(tag);
    },
    createBoard(state, { title, id }) {
      state.boards.push({
        title,
        id,
        allTags: [],
      });
      saveData('boards', state.boards);
    },
    delTag(state, { getters, index }) {
      getters.board.allTags.splice(index, 1);
    },
    activeBoard(state, id) {
      state.activeTag = 'all_tags#e4e4e4';
      state.activeBoard = state.collections.activeBoard = state.tasks.activeBoard = state.notes.activeBoard = id;
    },
    activeMenu(state, index) {
      state.activeMenu = index;
    },
    activeTag(state, tagId) {
      state.activeTag = tagId;
    },
    addBoardToSubItem(state, { key, boardId }) {
      const { items } = state[key];
      state[key].items = { ...items, [boardId]: [] };
      saveData(key, items);
    },
    changeBoards(state, boards) {
      state.boards = boards;
    },
    delAllRelatedItem(state, { key, tagId }) {
      state[key].items[state.activeBoard].forEach(item => {
        const findTagIndex = item.tags.findIndex(tag => tag.id === tagId);
        if (findTagIndex !== -1) item.tags.splice(findTagIndex, 1);
      });
    },
    deleteBoard(state, boardIndex) {
      if (state.boards.length === 1) {
        saveData('boards', []).then(() => (state.boards = []));
      } else {
        state.boards.splice(boardIndex, 1);
      }
    },
    deleteBoardSubitem(state, boardId) {
      state.subItems.forEach(async item => {
        delete state[item].items[boardId];
        saveData(item, state[item].items);
      });
    },
    renameBoardIndex(state, { newName, newBoardId, boardId }) {
      const boardIndex = state.boards.findIndex(board => board.id === boardId);
      const board = state.boards[boardIndex];
      board.title = newName;
      board.id = newBoardId;
      saveData('boards', state.boards);
    },
    renameBoardSubItem(state, { subItem, newBoardId, boardId }) {
      state[subItem].items = { [newBoardId]: state[subItem].items[boardId], ...state[subItem].items };
      delete state[subItem].items[boardId];
    },
  },
  actions: {
    renameBoard({ state, commit }, { newName, boardId }) {
      return new Promise((resolve, reject) => {
        const newBoardId = newName.toLowerCase().replace(/ /g, '_');
        const dataExist = state.boards.some(board => board.id === newBoardId);
        if (dataExist) {
          reject('Board already exist');
        } else {
          boardId === state.activeBoard ? commit('activeBoard', newBoardId) : null;
          commit('renameBoardIndex', { newName, newBoardId, boardId });
          state.subItems.forEach(async item => {
            await commit('renameBoardSubItem', { subItem: item, newBoardId, boardId });
          });
          resolve();
        }
      });
    },
    deleteBoard({ state, commit }, boardId) {
      const boardIndex = state.boards.findIndex(board => board.id === boardId);
      commit('deleteBoardSubitem', boardId);
      commit('deleteBoard', boardIndex);
      boardId === state.activeBoard ? commit('activeBoard', state.boards[0].id) : null;
      state.starBoard === boardId ? commit('starBoard', '') : null;
    },
    createNewTag({ commit, getters }, tag) {
      return new Promise((resolve, reject) => {
        const tagId = tag.name + tag.color;
        const isTagExist = getters.board.allTags.findIndex(tag => tag.id === tagId);
        if (isTagExist !== -1) {
          reject(`You already add ${tag.name}`);
        } else {
          const compTag = { ...tag, id: tagId };
          commit('newTag', { tag: compTag, getters });
          resolve();
        }
      });
    },
    deleteTag({ state, commit, getters }, tagId) {
      state.activeTag === tagId ? commit('activeTag', 'all_tags#e4e4e4') : null;
      const index = getters.board.allTags.findIndex(tag => tag.id === tagId);
      commit('delTag', { getters, index });
      // Delete all related tag in subitem
      state.subItems.forEach(item => commit('delAllRelatedItem', { key: item, tagId }));
    },
    createNewBoard({ commit, state }, title) {
      return new Promise((resolve, reject) => {
        const boardId = title.toLowerCase().replace(/ /g, '_');
        const findBoard = state.boards.find(board => board.id === boardId);
        if (findBoard) {
          reject(`You already add ${title}`);
        } else {
          commit('createBoard', { title, id: boardId });
          state.subItems.forEach(item => commit('addBoardToSubItem', { key: item, boardId }));
          commit('activeBoard', boardId);
          resolve();
        }
      });
    },
    async initData({ state, commit, getters }) {
      try {
        // Init App Data
        const appData = await getData(['boards', 'notes', 'tasks', 'collections']);
        if (appData.boards.length !== 0) {
          commit('initAppData', appData);

          // Init Data
          const data = await getData(['oTabMenu', 'oTabSettings', 'starBoard', 'homeCollection']);
          const activeBoard = data.starBoard === '' ? state.boards[0].id : data.starBoard;
          commit('starBoard', data.starBoard);
          commit('activeBoard', activeBoard);
          commit('homeCollection', data.homeCollection);
          commit('settings/changeSettings', data.oTabSettings);
          commit('activeMenu', data.oTabMenu);
        }
        commit('changeBoolean', { key: 'firstChange', data: false });
        setTimeout(() => {
          commit('changeBoolean', { key: 'isLoaded', data: true });
        }, 500);
      } catch (err) {
        console.log(err);
      }
    },
  },
});

export default Store;
