import Vue from 'vue';

export default {
  state: () => ({
    active: false,
    interval: 'week',
    lastBackup: 581515851667,
  }),
  mutations: {
    update(state, { key, value }) {
      Vue.set(state, key, value);
    },
  },
};
