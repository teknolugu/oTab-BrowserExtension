import Vue from 'vue';
import indexFinder from '../utils/indexFinder';
import generateId from '../utils/generateId';

export default {
  state: () => ({
    '193691': [
      {
        name: 'satu',
        color: '#4299e1',
        id: 'satu_#4299e1',
      },
      {
        name: 'dua',
        color: '#f6ad55',
        id: 'dua_#f6ad55',
      },
      {
        name: 'hula slaksnlas lka',
        color: '#f6ad55',
        id: '1',
      },
      {
        name: 'dua',
        color: '#f6ad55',
        id: '2',
      },
      {
        name: 'dua',
        color: '#f6ad55',
        id: '3',
      },
      {
        name: 'dua',
        color: '#f6ad55',
        id: '4',
      },
    ],
  }),
  mutations: {
    addLabel(state, { boardId, data }) {
      state[boardId].push(data);
    },
    updateLabel(state, { boardId, index, data }) {
      const label = Object.assign({}, state[boardId][index], data);
      Vue.set(state[boardId], index, label);
    },
    deleteLabel(state, { boardId, index }) {
      state[boardId].splice(index, 1);
    },
  },
  getters: {
    getActiveBoardId: (state, getters, rootState) => {
      return rootState.activeBoard;
    },
    getLabelsByBoardId: (state, getters) => id => {
      const boardId = id ? id : getters.getActiveBoardId;

      return state[boardId];
    },
    getLabelByLabelId: (state, getters) => id => {
      return state[getters.getActiveBoardId].find(label => label.id === id);
    },
  },
  actions: {
    update({ state, commit, getters }, { id, data }) {
      const boardId = getters.getActiveBoardId;
      const index = indexFinder(state[boardId], id);

      if (index !== -1)
        commit('updateLabel', {
          boardId,
          index,
          data,
        });
    },
    add({ commit, getters, state }, { name, color }) {
      const boardId = getters.getActiveBoardId;
      const labelId = generateId(state[boardId]);
      const labelExist = getters.getLabelsByBoardId().some(label => {
        return label.name.toLowerCase() === name.toLowerCase() && label.color === color;
      });

      if (labelExist) return;

      commit('addLabel', {
        boardId,
        data: {
          name,
          color,
          id: labelId,
        },
      });
    },
    delete({ commit, getters, state, dispatch }, labelId) {
      const boardId = getters.getActiveBoardId;
      const findLabelIndex = state[boardId].findIndex(label => label.id === labelId);

      commit('deleteLabel', {
        boardId,
        index: findLabelIndex,
      });
      dispatch('column/deleteColumnLabel', labelId, { root: true });
    },
  },
};
