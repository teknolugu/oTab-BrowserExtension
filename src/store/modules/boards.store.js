import Vue from 'vue';
import generateId from '@/utils/generateId';
import { setStorage, getStorage } from '@/utils/storage';

const browser = require('webextension-polyfill');

export default {
  state: () => ({}),

  getters: {
    getActiveBoard: (state, getters, rootState) => {
      return state[rootState.ui.activeBoard];
    },
    getBoardByBoardId: state => boardId => {
      return state[boardId];
    },
    getAllBoards: state => {
      return Object.keys(state).map(key => ({
        id: key,
        ...state[key],
      }));
    },
  },

  mutations: {
    updateBoard(state, { boardId, data }) {
      const dataSet = { ...state[boardId], ...data };
      Vue.set(state, boardId, dataSet);
    },
    addBoard(state, { id, board }) {
      Vue.set(state, id, board);
    },
    deleteBoard(state, boardId) {
      Vue.delete(state, boardId);
    },
  },

  actions: {
    update({ commit, rootState, state }, { boardId, data }) {
      commit('updateBoard', {
        boardId: boardId || rootState.ui.activeBoard,
        data,
      });
      setStorage('boards', state);
    },
    add({ commit, state }, title) {
      return new Promise(resolve => {
        const id = generateId(state);
        const board = {
          title,
          createdDate: Date.now(),
        };

        commit('addBoard', { id, board });
        commit('labels/addEntity', id, { root: true });
        commit('columns/addEntity', id, { root: true });

        setStorage('boards', state);

        resolve(id);
      });
    },
    delete({ commit, state, rootState }, boardId) {
      return new Promise(resolve => {
        const { defaultBoard, activeBoard } = rootState.ui;
        const columnEntities = rootState.columns[boardId].map(column => column.id);

        if (defaultBoard === boardId)
          commit(
            'ui/update',
            {
              key: 'defaultBoard',
              value: '',
            },
            { root: true }
          );
        if (activeBoard === boardId)
          commit(
            'ui/update',
            {
              key: 'activeBoard',
              value: Object.keys(state)[0],
            },
            { root: true }
          );

        commit('deleteBoard', boardId);
        commit('columns/deleteEntity', boardId, { root: true });
        commit('labels/deleteEntity', boardId, { root: true });
        columnEntities.forEach(columnId => {
          commit('items/deleteEntity', columnId, { root: true });
        });

        setStorage('boards', state);
        resolve();
      });
    },
  },
};
