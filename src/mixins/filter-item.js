export default {
  methods: {
    tagFilter(item) {
      const { activeTag } = this.$store.state;
      return activeTag === 'all_tags#e4e4e4' ? true : item.tags.some(tag => tag.id === activeTag);
    },
    searchFilter(data, key, key2 = '') {
      if (data) return data.filter(tab => tab[key].toLowerCase().match(this.search) || tab[key2].toLowerCase().match(this.search));
    },
  },
  computed: {
    search() {
      return this.$store.state.search;
    },
  },
};
