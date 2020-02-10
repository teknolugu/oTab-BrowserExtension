import Vue from 'vue';
import indexFinder from '../utils/indexFinder';
import generateId from '../utils/generateId';

export default {
  state: () => ({
    '12798': [
      {
        id: '10092',
        type: 'task',
        done: false,
        title: 'hulalala',
        content: '',
      },
      {
        id: '10042',
        type: 'task',
        done: true,
        title: 'lorem ipsum dolor',
        content: 'sit amter',
      },
      {
        id: '10392',
        type: 'note',
        title: 'notetete',
        content: '',
      },
    ],
    '12198': [
      {
        url: 'https://google.com',
        title: 'Google',
        favIconUrl: '',
        id: '1371983',
        type: 'tab',
      },
      {
        id: '10332',
        type: 'note',
        title: 'notee',
        content: 'askahsjh',
      },
    ],
  }),

  getters: {
    getItemsByColumnId: state => columnId => {
      return state[columnId];
    },
    getItemById: state => (columnId, itemId) => {
      return state[columnId].find(item => item.id === itemId);
    },
  },

  mutations: {
    updateItem(state, { columnId, index, data }) {
      const dataSet = Object.assign({}, state[columnId][index], data);
      Vue.set(state[columnId], index, dataSet);
    },
    deleteItem(state, { columnId, index }) {
      state[columnId].splice(index, 1);
    },
    changeItems(state, { columnId, data }) {
      state[columnId] = [...data];
    },
    addItem(state, { columnId, data }) {
      state[columnId].unshift({
        id: generateId(state[columnId]),
        ...data,
      });
    },
    sessionItem(state, { columnId, items }) {
      state[columnId] = items.map(item => {
        return {
          id: generateId(state[columnId]),
          ...item,
        };
      });
    },
    addEntity(state, id) {
      Vue.set(state, id, []);
    },
    deleteEntity(state, id) {
      Vue.delete(state, id);
    },
  },

  actions: {
    update({ state, commit }, { id, columnId, data }) {
      const index = indexFinder(state[columnId], id);

      if (index !== -1)
        commit('updateItem', {
          columnId,
          index,
          data,
        });
    },
    delete({ state, commit }, { columnId, id }) {
      return new Promise((resolve, reject) => {
        const index = indexFinder(state[columnId], id);

        if (index !== -1) {
          commit('deleteItem', { columnId, index });
          resolve();
        } else {
          reject("Can't find item");
        }
      });
    },
  },
};
