import Vue from 'vue';

export default {
  state: () => ({
    isLogin: false,
    name: '',
    email: '',
    emailVerified: false,
    lastLogin: '',
    createdAt: '',
  }),
  getters: {
    isLogin: state => {
      return state.isLogin;
    },
  },
  mutations: {
    update(state, { key, value }) {
      Vue.set(state, key, value);
    },
    toDefault(state) {
      state.isLogin = state.emailVerified = false;
      state.name = state.email = state.lastLogin = state.createdAt = '';
    },
  },
};
