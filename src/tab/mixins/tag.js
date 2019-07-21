const Tag = key => ({
  methods: {
    filterData(item) {
      let items = this.$store.getters[key];
      let activeTag = this.$store.state.activeTag;
      return activeTag === 'all_tags#e4e4e4' ? items : item.tags.some(tag => tag.id === activeTag);
    },
  },
});

export default Tag;
