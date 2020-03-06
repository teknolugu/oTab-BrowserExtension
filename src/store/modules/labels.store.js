import Vue from 'vue';
import indexFinder from '@/utils/indexFinder';
import generateId from '@/utils/generateId';
import { setStorage } from '@/utils/storage';

export default {
  state: () => ({}),
  mutations: {
    addLabel(state, { boardId, data }) {
      state[boardId].push(data);
    },
    updateLabel(state, { boardId, index, data }) {
      const label = { ...state[boardId][index], ...data };
      Vue.set(state[boardId], index, label);
    },
    addEntity(state, boardId) {
      Vue.set(state, boardId, []);
      setStorage('labels', state);
    },
    deleteLabel(state, { boardId, index }) {
      state[boardId].splice(index, 1);
    },
    deleteEntity(state, boardId) {
      Vue.delete(state, boardId);
    },
  },
  getters: {
    getActiveBoardId: (state, getters, rootState) => {
      return rootState.ui.activeBoard;
    },
    getLabelsByBoardId: (state, getters) => id => {
      const boardId = id || getters.getActiveBoardId;

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

      if (index !== -1) {
        commit('updateLabel', {
          boardId,
          index,
          data,
        });
        setStorage('labels', state);
      }
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
      setStorage('labels', state);
    },
    delete({ commit, getters, state, dispatch, rootState }, labelId) {
      if (rootState.ui.activeLabel === labelId)
        commit(
          'ui/update',
          {
            key: 'activeLabel',
            value: '',
          },
          { root: true }
        );

      const boardId = getters.getActiveBoardId;
      const findLabelIndex = state[boardId].findIndex(label => label.id === labelId);

      commit('deleteLabel', {
        boardId,
        index: findLabelIndex,
      });
      dispatch('columns/deleteColumnLabel', labelId, { root: true });
      setStorage('labels', state);
    },
  },
};
