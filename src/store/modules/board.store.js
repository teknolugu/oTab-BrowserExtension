import Vue from 'vue';
import generateId from '../utils/generateId';

export default {
  state: () => ({
    '193691': {
      title: 'primary board',
      starred: true,
      createdDate: 1580721850539,
    },
    '88873': {
      title: 'secondary board',
      starred: false,
      createdDate: 1580721850039,
    },
  }),

  getters: {
    getActiveBoard: (state, getters, rootState) => {
      return state[rootState.activeBoard];
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
      const dataSet = Object.assign({}, state[boardId], data);
      Vue.set(state, boardId, dataSet);
    },
    addBoard(state, { id, board }) {
      Vue.set(state, id, board);
    },
  },

  actions: {
    update({ commit, rootState }, { boardId, data }) {
      commit('updateBoard', {
        boardId: boardId ? boardId : rootState.activeBoard,
        data,
      });
    },
    add({ commit, state }, title) {
      const id = generateId(state);
      const board = {
        title,
        createdDate: Date.now(),
        starred: false,
      };
      commit('addBoard', { id, board });
      commit('column/addEntity', id, { root: true });
    },
  },
};
