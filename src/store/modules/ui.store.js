import Vue from 'vue';
import { setStorage } from '~/utils/storage';

export default {
  state: () => ({
    activeBoard: '',
    searchType: 'column',
    searchQuery: '',
    defaultBoard: '',
    activeLabel: '',
    activeHomePage: 'board-list',
    labelColors: ['#4299e1', '#CBD5E0', '#f6ad55', '#4FD1C5', '#fc8181', '#b794f4', '#68d391'],
  }),
  mutations: {
    update(state, { key, value }) {
      if (key === 'defaultBoard') setStorage('defaultBoard', value);

      Vue.set(state, key, value);
    },
    setState(state, data) {
      Object.keys(data).forEach(key => {
        Vue.set(state, key, data[key]);
      });
    },
    hideSideMenu(state) {
      state.hideSideMenu = !state.hideSideMenu;
    },
    toDefault(state) {
      state.activeBoard = state.activeLabel = '';
      state.activeHomePage = 'board-list';
    },
  },
};
