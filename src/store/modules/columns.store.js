import Vue from 'vue';
import indexFinder from '@/utils/indexFinder';
import generateId from '@/utils/generateId';
import { setStorage } from '@/utils/storage';

export default {
  state: () => ({}),

  mutations: {
    deleteEntity(state, boardId) {
      Vue.delete(state, boardId);
      setStorage('columns', state);
    },
    updateColumn(state, { index, boardId, data }) {
      const dataSet = Object.assign({}, state[boardId][index], data);
      Vue.set(state[boardId], index, dataSet);
    },
    deleteColumn(state, { index, boardId }) {
      state[boardId].splice(index, 1);
    },
    addColumn(state, { boardId, data }) {
      state[boardId].push(data);
    },
    addEntity(state, id) {
      Vue.set(state, id, []);
      setStorage('columns', state);
    },
  },

  getters: {
    getActiveBoardId: (state, getters, rootState) => {
      return rootState.ui.activeBoard;
    },
    getColumnsByBoardId: (state, getters) => boardId => {
      const activeBoard = boardId ? boardId : getters.getActiveBoardId;
      return typeof state[activeBoard] !== 'undefined' ? state[activeBoard] : [];
    },
  },

  actions: {
    update({ commit, state, getters }, { id, boardId, data }) {
      const activeBoardId = boardId ? boardId : getters.getActiveBoardId;
      const columnIndex = indexFinder(state[activeBoardId], id);

      if (columnIndex !== -1) {
        commit('updateColumn', {
          index: columnIndex,
          boardId: activeBoardId,
          data,
        });
        setStorage('columns', state);
      }
    },
    add({ commit, state, getters }, title) {
      return new Promise(resolve => {
        const boardId = getters.getActiveBoardId;
        const columnId = generateId(state[boardId]);
        commit('addColumn', {
          boardId,
          data: {
            id: columnId,
            title,
            labels: [],
          },
        });
        commit('items/addEntity', columnId, { root: true });
        setStorage('columns', state);
        resolve(columnId);
      });
    },
    deleteColumnLabel({ commit, state, getters }, labelId) {
      return new Promise(resolve => {
        const boardId = getters.getActiveBoardId;

        state[boardId].forEach((column, index) => {
          const indexOfLabel = column.labels.indexOf(labelId);
          if (indexOfLabel !== -1)
            commit('updateColumn', {
              index,
              boardId,
              data: {
                columns: column.labels.splice(indexOfLabel, 1),
              },
            });
        });
        setStorage('columns', state);
        resolve();
      });
    },
    delete({ commit, state, getters }, id) {
      const activeBoard = getters.getActiveBoardId;
      return new Promise((resolve, reject) => {
        const columnIndex = indexFinder(state[activeBoard], id);

        if (columnIndex !== -1) {
          commit('deleteColumn', { boardId: activeBoard, index: columnIndex });
          commit('items/deleteEntity', id, { root: true });
          setStorage('columns', state);
          resolve();
        } else {
          reject(`Can't find data`);
        }
      });
    },
  },
};
