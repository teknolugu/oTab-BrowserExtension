import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import pathify from 'vuex-pathify';
// Models
// import Board from './models/board';
// import Column from './models/column';
// import Item from './models/item';
// import Tag from './models/tag';

Vue.use(Vuex);
import modules from './modules';
// const database = new VuexORM.Database()
/*

database.register(Board);
database.register(Column);
database.register(Item);
database.register(Tag);*/

// plugins: [VuexORM.install(database)],
export default new Vuex.Store({
  namespaced: true,
  plugins: [pathify.plugin],
  modules,
  state: {
    activeBoard: '193691',
    hideSideMenu: false,
    search: {
      type: 'column',
      query: '',
    },
    activeLabel: '',
    labels: ['#4299e1', '#CBD5E0', '#f6ad55', '#4FD1C5', '#fc8181', '#b794f4', '#68d391'],
  },
  mutations: {
    changeItems(state, { columnId, items }) {
      Vue.set(state.item, columnId, items);
    },
    changeColumns(state, columns) {
      Vue.set(state.column, state.activeBoard, columns);
    },
    updateActiveLabel(state, id) {
      state.activeLabel = id;
    },
    updateSearch(state, { key, value }) {
      state.search[key] = value;
    },
    activeBoard(state, board) {
      state.activeBoard = board;
    },
    hideSideMenu(state) {
      state.hideSideMenu = !state.hideSideMenu;
    },
  },
});
