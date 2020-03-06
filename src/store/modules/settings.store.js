import Vue from 'vue';
import { setStorage } from '@/utils/storage';

export default {
  state: () => ({
    dark: false,
    openURLInNewTab: true,
    closeTabOnSave: false,
  }),
  mutations: {
    updateSetting(state, { key, value }) {
      Vue.set(state, key, value);
      setStorage('settings', state);
    },
  },
};
