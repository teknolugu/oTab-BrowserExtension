export default {
  data: () => ({
    search: '',
  }),
  methods: {
    searchHandle(data, key, key2 = '') {
      if (data) return data.filter(tab => tab[key].toLowerCase().match(this.search) || tab[key2].toLowerCase().match(this.search));
    },
  },
};
