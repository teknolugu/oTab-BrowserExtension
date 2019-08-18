export default {
  state: {
    items: {
      dark: false,
      openInCurrentTab: true,
      home: false,
      searchEngine: '',
      searchBar: true,
      homeBackground: {},
    },
  },
  mutations: {
    changeSettings(state, data) {
      state.items = data;
    },
    change(state, { key, value }) {
      state.items[key] = value;
    },
  },
};
