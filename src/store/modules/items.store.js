import Vue from 'vue';
import indexFinder from '~/utils/indexFinder';
import generateId from '~/utils/generateId';
import { setStorage } from '~/utils/storage';

export default {
  state: () => ({}),

  getters: {
    getItemsByColumnId: state => columnId => {
      return state[columnId] ? state[columnId] : [];
    },
    getItemById: state => (columnId, itemId) => {
      return state[columnId].find(item => item.id === itemId);
    },
  },

  mutations: {
    updateItem(state, { columnId, index, data }) {
      const dataSet = { ...state[columnId][index], ...data };
      Vue.set(state[columnId], index, dataSet);
    },
    deleteItem(state, { columnId, index }) {
      state[columnId].splice(index, 1);
    },
    changeItems(state, { columnId, data }) {
      state[columnId] = [...data];
      setStorage('items', state);
    },
    addItem(state, { columnId, data }) {
      state[columnId].unshift({
        id: generateId(state[columnId]),
        ...data,
      });
      setStorage('items', state);
    },
    sessionItem(state, { columnId, items }) {
      state[columnId] = items.map(item => {
        return {
          id: generateId(state[columnId]),
          ...item,
        };
      });
      setStorage('items', state);
    },
    addEntity(state, id) {
      Vue.set(state, id, []);
      setStorage('items', state);
    },
    deleteEntity(state, id) {
      Vue.delete(state, id);
      setStorage('items', state);
    },
  },

  actions: {
    update({ state, commit }, { id, columnId, data }) {
      const index = indexFinder(state[columnId], id);

      if (index !== -1) {
        commit('updateItem', {
          columnId,
          index,
          data,
        });
        setStorage('items', state);
      }
    },
    delete({ state, commit }, { columnId, id }) {
      return new Promise((resolve, reject) => {
        const commitDelete = idParam => {
          const index = indexFinder(state[columnId], idParam);

          if (index !== -1) commit('deleteItem', { columnId, index });
        };

        if (Array.isArray(id)) {
          id.forEach(item => {
            commitDelete(item);
          });
          setStorage('items', state);
          resolve();
        } else if (typeof id === 'string') {
          commitDelete(id);
          setStorage('items', state);
          resolve();
        }
      });
    },
  },
};
