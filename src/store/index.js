import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';
import { getStorage, setStorage } from '@/utils/storage';

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  modules,
  mutations: {
    changeItems(state, { columnId, items }) {
      Vue.set(state.items, columnId, items);
      setStorage('items', state.items);
    },
    changeColumns(state, columns) {
      Vue.set(state.columns, state.activeBoard, columns);
      setStorage('columns', state.columns);
    },
    changeModules(state, { key, value }) {
      Vue.set(state, key, value);
    },
    overrideModule(state, { key, value }) {
      state[key] = value;
      setStorage(key, value);
    },
  },
  actions: {
    retrieveData({ commit }, vm) {
      return new Promise(async resolve => {
        const data = await getStorage(['boards', 'columns', 'items', 'labels', 'settings', 'backup']);
        const user = vm ? await vm.$sendMessage('getUser') : null;

        if (data.boards.length === 0) return resolve(null);

        Object.keys(data).forEach(key => {
          commit('changeModules', {
            key,
            value: data[key],
          });
        });

        if (user !== null) commit('changeModules', { key: 'user', value: { isLogin: true, ...user } });

        const { defaultBoard } = await getStorage('defaultBoard');
        commit('ui/setState', {
          defaultBoard,
          activeBoard: !!defaultBoard ? defaultBoard : data.boards[0].id,
        });

        resolve(data);
      });
    },
    overrideLocalData({ commit }, data) {
      return new Promise(resolve => {
        Object.keys(data).forEach(key => {
          commit('overrideModule', {
            key,
            value: data[key],
          });
        });
      });
    },
  },
});
