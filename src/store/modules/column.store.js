import Vue from 'vue';
import indexFinder from '../utils/indexFinder';
import generateId from '../utils/generateId';

export default {
  state: () => ({
    '193691': [
      {
        title: 'Some title',
        id: '12798',
        labels: ['dua_#f6ad55', '1', '2', '3', '4', 'satu_#4299e1'],
      },
      {
        title: 'Hello hee',
        id: '12198',
        labels: ['satu_#4299e1'],
      },
    ],
    '88873': [],
  }),

  mutations: {
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
    },
  },

  getters: {
    getActiveBoardId: (state, getters, rootState) => {
      return rootState.activeBoard;
    },
    getColumnsByBoardId: (state, getters) => boardId => {
      const activeBoard = boardId ? boardId : getters.getActiveBoardId;
      return state[activeBoard];
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
        commit('item/addEntity', columnId, { root: true });
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
        resolve();
      });
    },
    delete({ commit, state, getters }, id) {
      const activeBoard = getters.getActiveBoardId;
      return new Promise((resolve, reject) => {
        const columnIndex = indexFinder(state[activeBoard], id);

        if (columnIndex !== -1) {
          commit('deleteColumn', { boardId: activeBoard, index: columnIndex });
          commit('item/deleteEntity', id, { root: true });
          resolve();
        } else {
          reject(`Can't find data`);
        }
      });
    },
  },
};
