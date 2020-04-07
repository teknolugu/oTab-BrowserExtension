import Vue from 'vue';
import { setStorage } from '~/utils/storage';

export default {
  state: () => ({
    dark: false,
    defaultNewTab: true,
    openURLInNewTab: true,
    closeTabOnSave: true,
  }),
  mutations: {
    updateSetting(state, { key, value }) {
      Vue.set(state, key, value);

      setStorage('settings', state);
    },
  },
};
