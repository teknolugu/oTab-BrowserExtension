import Vue from 'vue';
import Vuex from 'vuex';
import modules from './modules';

Vue.use(Vuex);
const Store = new Vuex.Store({
  strict: false,
  modules,
  state: {
    isLoaded: false,
    firstChange: true,
    subItems: ['collections', 'notes', 'tasks'],
    activeMenu: '0',
    boards: [],
    activeBoard: '',
    activeTag: 'all_tags#e4e4e4',
    starBoard: '',
    homeCollection: '',
  },
  getters: {
    boards: state => {
      return state.boards
    },
    collections: state => {
      return state.collections.items
    },
    notes: state => {
      return state.notes.items
    },
    tasks: state => {
      return state.tasks.items
    },
    homeTabs: state => {
      if (state.homeCollection !== '') {
        let getId = state.homeCollection.split('=>');
        return state.collections.items[getId[0]][getId[1]].tabs.slice(0, 5);
      } else {
        return null;
      }
    },
    allData: state => {
      return {
        boards: state.boards,
        notes: state.notes.items,
        collections: state.collections.items,
        tasks: state.tasks.items,
      };
    },
    boardList: state => {
      return state.boards.map(({ title, id }) => ({ title, id }));
    },
    board: state => {
      return state.boards.find(board => board.id === state.activeBoard);
    },
  },
  mutations: {
    homeCollection(state, collection) {
      state.homeCollection = collection;
    },
    starBoard(state, boardId) {
      state.starBoard = boardId;
    },
    changeBoolean(state, { key, data }) {
      state[key] = data;
    },
    setAllData(state, data) {
      state.boards = data.oTabData.boards;
      state.subItems.forEach(item => (state[item].items = data.oTabData[item]));
    },
    triggerSave(state, key) {
      state[key].items = { ...state[key].items };
    },
    newTag(state, { tag, getters }) {
      getters.board.allTags.push(tag);
    },
    createBoard(state, { title, id }) {
      state.boards.push({
        title: title,
        id: id,
        allTags: [],
      });
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
      let items = state[key].items;
      state[key].items = {
        ...items,
        [boardId]: [],
      };
    },
    changeBoards(state, boards) {
      state.boards = boards;
    },
    delAllRelatedItem(state, { key, tagId }) {
      state[key].items[state.activeBoard].forEach(item => {
        let findTagIndex = item.tags.findIndex(tag => tag.id === tagId);
        if (findTagIndex !== -1) item.tags.splice(findTagIndex, 1);
      });
    },
    deleteBoard(state, boardIndex) {
      state.boards.splice(boardIndex, 1);
    },
    deleteBoardSubitem(state, boardId) {
      state.subItems.forEach(item => delete state[item].items[boardId]);
    },
    renameBoardIndex(state, { newName, newBoardId, boardId }) {
      let boardIndex = state.boards.findIndex(board => board.id === boardId);
      let board = state.boards[boardIndex];
      board.title = newName;
      board.id = newBoardId;
    },
    renameBoardSubItem(state, { subItem, newBoardId, boardId }) {
      state[subItem].items[newBoardId] = state[subItem].items[boardId];
      delete state[subItem].items[boardId];
    },
  },
  actions: {
    renameBoard({ state, commit }, { newName, boardId }) {
      return new Promise((resolve, reject) => {
        let newBoardId = newName.toLowerCase().replace(/ /g, '_');
        let dataExist = state.boards.some(board => board.id === newBoardId);
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
    async deleteBoard({ state, commit }, boardId) {
      let boardIndex = state.boards.findIndex(board => board.id === boardId);
      await commit('deleteBoard', boardIndex);
      boardId === state.activeBoard ? commit('activeBoard', state.boards[0].id) : null;
      await commit('deleteBoardSubitem', boardIndex);
    },
    createNewTag({ commit, getters }, tag) {
      return new Promise((resolve, reject) => {
        let tagId = tag.name + tag.color;
        let isTagExist = getters.board.allTags.findIndex(tag => tag.id === tagId);
        if (isTagExist !== -1) {
          reject('You already add ' + tag.name);
        } else {
          let compTag = { ...tag, id: tagId };
          commit('newTag', { tag: compTag, getters });
          resolve();
        }
      });
    },
    deleteTag({ state, commit, getters }, tagId) {
      state.activeTag === tagId ? commit('activeTag', 'all_tags#e4e4e4') : null;
      let index = getters.board.allTags.findIndex(tag => tag.id === tagId);
      commit('delTag', { getters, index });
      // Delete all related tag in subitem
      state.subItems.forEach(item => commit('delAllRelatedItem', { key: item, tagId }));
    },
    createNewBoard({ commit, state }, title) {
      return new Promise((resolve, reject) => {
        let boardId = title.toLowerCase().replace(/ /g, '_');
        let findBoard = state.boards.find(board => board.id === boardId);
        if (findBoard) {
          reject('You already add ' + title);
        } else {
          commit('createBoard', { title: title, id: boardId });
          state.subItems.forEach(item => commit('addBoardToSubItem', { key: item, boardId }));
          commit('activeBoard', boardId);
          resolve();
        }
      });
    },
    async initData({ state, commit, getters }, { data, isEmpty }) {
      if (!isEmpty) {
        await commit('setAllData', data);
        let activeBoard = data.starBoard === '' ? state.boards[0].id : data.starBoard;
        await commit('starBoard', data.starBoard);
        await commit('activeBoard', activeBoard);
        commit('homeCollection', data.homeCollection)
      }
      await commit('changeBoolean', { key: 'firstChange', data: false });
      setTimeout(() => {
        commit('changeBoolean', { key: 'isLoaded', data: true });
      }, 500);
    },
  },
});

export default Store;
